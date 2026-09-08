mod error;
mod tasa_bcv;
#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use datiolabs_core::capacidades::{
    self, ErrorNegocio, capacidades_de_rubros, rubros_activos, validar_linea,
};
use datiolabs_core::db::{Database as Ledger, DbError};
use datiolabs_core::models::{
    Catalogo, ConfigNegocio, EstadoVenta, LineasVenta, MotivoMovimiento, MovimientoStock,
    PagoVenta, Producto, Venta,
};
use datiolabs_core::modulos::licoreria;
use datiolabs_core::modulos::panaderia::Lote;
use error::UIError;
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::str::FromStr;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::Manager;

use tasa_bcv::{ServicioTasa, TasaInfo, iniciar_refresco};

use uuid::Uuid;

use axum::{
    Router,
    extract::{FromRequestParts, Request, State as AxumState},
    http::{
        HeaderMap, Method, StatusCode,
        header::{COOKIE, SET_COOKIE},
    },
    middleware::{self, Next},
    response::sse::{Event, Sse},
    response::{Html, IntoResponse, Json, Response},
    routing::{get, post},
};
use futures::stream::Stream;
use rand::Rng;
use std::convert::Infallible;
use std::sync::Mutex as StdMutex;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tokio::sync::broadcast;
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::ServeDir;

const SESSION_COOKIE_NAME: &str = "datiolabs_session";
const SESSION_TTL_SECS: u64 = 7 * 24 * 3600;
const SESSION_KEY_PREFIX: &[u8] = b"session:";
const MAX_SESSIONS: usize = 128;

#[derive(Clone)]
struct SessionStore {
    tree: Arc<sled::Tree>,
}

impl SessionStore {
    fn new(db: &sled::Db) -> Result<Self, UIError> {
        let tree = Arc::new(
            db.open_tree("sesiones")
                .map_err(|e| UIError::new("error abriendo sesiones", &e.to_string()))?,
        );
        Ok(Self { tree })
    }

    fn now_unix() -> Result<i64, UIError> {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_secs() as i64)
            .map_err(|_| UIError::new("error de tiempo", "reloj del sistema anterior a UNIX epoch"))
    }

    fn create(&self) -> Result<[u8; 32], UIError> {
        let mut rng = rand::thread_rng();
        let mut token = [0u8; 32];
        for b in &mut token {
            *b = rng.sample(rand::distributions::Alphanumeric);
        }
        let now = Self::now_unix()?;
        let expiry = (now + SESSION_TTL_SECS as i64).to_be_bytes();
        let mut key = [0u8; 8 + 32];
        key[..8].copy_from_slice(SESSION_KEY_PREFIX);
        key[8..].copy_from_slice(&token);
        self.tree
            .insert(&key, &expiry)
            .map_err(|e| UIError::new("error creando sesion", &e.to_string()))?;
        Ok(token)
    }

    fn validate(&self, token: &[u8; 32]) -> bool {
        let mut key = [0u8; 8 + 32];
        key[..8].copy_from_slice(SESSION_KEY_PREFIX);
        key[8..].copy_from_slice(token);
        let now = match Self::now_unix() {
            Ok(n) => n,
            Err(_) => return false,
        };
        match self.tree.get(&key) {
            Ok(Some(expiry_bytes)) => {
                if expiry_bytes.len() == 8 {
                    if let Ok(arr) = <[u8; 8]>::try_from(expiry_bytes.as_ref()) {
                        let expiry = i64::from_be_bytes(arr);
                        if expiry > now {
                            return true;
                        }
                        let _ = self.tree.remove(&key);
                    }
                }
            }
            _ => {}
        }
        false
    }

    fn remove(&self, token: &[u8; 32]) {
        let mut key = [0u8; 8 + 32];
        key[..8].copy_from_slice(SESSION_KEY_PREFIX);
        key[8..].copy_from_slice(token);
        let _ = self.tree.remove(&key);
    }
}

fn extract_session_token(headers: &HeaderMap) -> Option<[u8; 32]> {
    let cookie_header = headers.get(COOKIE)?.to_str().ok()?;
    let prefix = "datiolabs_session=";
    for part in cookie_header.split(';') {
        let part = part.trim();
        if let Some(val) = part.strip_prefix(prefix) {
            if val.len() == 32 {
                let mut token = [0u8; 32];
                token.copy_from_slice(val.as_bytes());
                return Some(token);
            }
        }
    }
    None
}

async fn auth_middleware(
    State(session_store): State<SessionStore>,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let token = extract_session_token(request.headers()).ok_or(StatusCode::UNAUTHORIZED)?;
    if !session_store.validate(&token) {
        return Err(StatusCode::UNAUTHORIZED);
    }
    Ok(next.run(request).await)
}

const SESSION_COOKIE_NAME: &str = "datiolabs_session";
const SESSION_COOKIE_PREFIX_LEN: usize = 17; // "datiolabs_session="
const SESSION_COOKIE_SUFFIX: &str = "; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800";
const SESSION_COOKIE_SUFFIX_LEN: usize = 40;
const MAX_COOKIE_LEN: usize = SESSION_COOKIE_PREFIX_LEN + 32 + SESSION_COOKIE_SUFFIX_LEN;

fn write_session_cookie(token: &[u8; 32], buf: &mut [u8; MAX_COOKIE_LEN]) -> usize {
    let mut pos = 0;
    buf[pos..pos + SESSION_COOKIE_PREFIX_LEN].copy_from_slice(SESSION_COOKIE_NAME.as_bytes());
    buf[SESSION_COOKIE_PREFIX_LEN - 1] = b'=';
    pos = SESSION_COOKIE_PREFIX_LEN;
    buf[pos..pos + 32].copy_from_slice(token);
    pos += 32;
    buf[pos..pos + SESSION_COOKIE_SUFFIX_LEN].copy_from_slice(SESSION_COOKIE_SUFFIX.as_bytes());
    pos + SESSION_COOKIE_SUFFIX_LEN
}

fn make_cookie_header(token: &[u8; 32]) -> Option<HeaderValue> {
    let mut buf = [0u8; MAX_COOKIE_LEN];
    let len = write_session_cookie(token, &mut buf);
    let s = std::str::from_utf8(&buf[..len]).ok()?;
    HeaderValue::from_str(s).ok()
}

fn clear_session_cookie() -> &'static str {
    "datiolabs_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"
}

#[derive(Clone)]
struct AxumAppState {
    ledger: Arc<Mutex<Ledger>>,
    servicio_tasa: Arc<ServicioTasa>,
    session_store: SessionStore,
    tx: broadcast::Sender<()>,
}

async fn api_auth_login(
    State(state): State<AxumAppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    let ledger = state
        .ledger
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let cfg = match ledger.cargar_config() {
        Ok(Some(c)) => c,
        _ => return Err(StatusCode::UNAUTHORIZED),
    };
    drop(ledger);

    if cfg.pin_dueno_sha256.is_empty() {
        return Err(StatusCode::UNAUTHORIZED);
    }
    if cfg.pin_dueno_sha256 != hash_pin(&payload.pin) {
        return Err(StatusCode::UNAUTHORIZED);
    }
    let token = state
        .session_store
        .create()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let cookie = make_cookie_header(&token).ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    let mut resp = Json(LoginResponse {
        ok: true,
        message: hex_token(&token),
    })
    .into_response();
    resp.headers_mut().insert(SET_COOKIE, cookie);
    Ok(resp)
}

async fn api_auth_logout(
    State(state): State<AxumAppState>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, StatusCode> {
    if let Some(token) = extract_session_token(&headers) {
        state.session_store.remove(&token);
    }
    let clear =
        HeaderValue::from_static("datiolabs_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
    let mut resp = Json(LoginResponse {
        ok: true,
        message: "Sesion cerrada".into(),
    })
    .into_response();
    resp.headers_mut().insert(SET_COOKIE, clear);
    Ok(resp)
}

async fn serve_panel_html() -> Html<&'static str> {
    Html(include_str!("../panel.html"))
}

async fn api_panel(State(state): State<AxumAppState>) -> Result<Json<PanelDto>, StatusCode> {
    let ledger = state
        .ledger
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let catalogo = ledger
        .cargar_catalogo()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let limite = ahora_unix() - 86_400;
    let ventas = ledger
        .ventas_recientes(2_000)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut usd = Decimal::ZERO;
    let mut bs = Decimal::ZERO;
    let mut tickets = 0usize;

    // Fixed-size columnar tracker for top products (max 32 unique names)
    const MAX_VENDIDOS: usize = 32;
    const MAX_TOP: usize = 5;
    let mut vendidos_nombre: [Nombre; MAX_VENDIDOS] = [Nombre::empty(); MAX_VENDIDOS];
    let mut vendidos_cant: [Decimal; MAX_VENDIDOS] = [Decimal::ZERO; MAX_VENDIDOS];
    let mut vendidos_len: usize = 0;

    for v in &ventas {
        if v.estado != EstadoVenta::Cerrada || v.fecha_cierre_unix < limite {
            continue;
        }
        tickets += 1;
        usd += v.total_usd;
        bs += v.total_bs;
        for i in 0..v.lineas.nombres.len() {
            let nombre = &v.lineas.nombres[i];
            let cant = v.lineas.cantidades[i];
            // Search existing entry
            let mut found = false;
            for j in 0..vendidos_len {
                if vendidos_nombre[j].as_str() == nombre.as_str() {
                    vendidos_cant[j] += cant;
                    found = true;
                    break;
                }
            }
            if !found && vendidos_len < MAX_VENDIDOS {
                vendidos_nombre[vendidos_len] = nombre.clone();
                vendidos_cant[vendidos_len] = cant;
                vendidos_len += 1;
            }
        }
    }

    // Insertion sort top-5 (bounded, no allocation)
    let mut top_len: usize = 0;
    let mut top_nombre: [Nombre; MAX_TOP] = [Nombre::empty(); MAX_TOP];
    let mut top_cant: [Decimal; MAX_TOP] = [Decimal::ZERO; MAX_TOP];
    for k in 0..vendidos_len {
        if top_len < MAX_TOP {
            top_nombre[top_len] = vendidos_nombre[k].clone();
            top_cant[top_len] = vendidos_cant[k];
            top_len += 1;
            // Bubble up
            let mut m = top_len - 1;
            while m > 0 && top_cant[m] > top_cant[m - 1] {
                top_nombre.swap(m, m - 1);
                top_cant.swap(m, m - 1);
                m -= 1;
            }
        } else if vendidos_cant[k] > top_cant[MAX_TOP - 1] {
            top_nombre[MAX_TOP - 1] = vendidos_nombre[k].clone();
            top_cant[MAX_TOP - 1] = vendidos_cant[k];
            let mut m = MAX_TOP - 1;
            while m > 0 && top_cant[m] > top_cant[m - 1] {
                top_nombre.swap(m, m - 1);
                top_cant.swap(m, m - 1);
                m -= 1;
            }
        }
    }

    let mut top: [TopProductoDto; MAX_TOP] = [TopProductoDto {
        nombre: Nombre::empty(),
        cantidad: Decimal::ZERO,
    }; MAX_TOP];
    for i in 0..top_len {
        top[i] = TopProductoDto {
            nombre: top_nombre[i].clone(),
            cantidad: top_cant[i],
        };
    }

    // Fixed-size criticos (max 16 low-stock items)
    const MAX_CRITICOS: usize = 16;
    let mut criticos: [CriticoDto; MAX_CRITICOS] = [CriticoDto {
        sku: Sku::empty(),
        nombre: Nombre::empty(),
        stock: Decimal::ZERO,
    }; MAX_CRITICOS];
    let mut criticos_len: usize = 0;
    for i in 0..catalogo.len() {
        if catalogo.stock(i) <= dec!(5) && criticos_len < MAX_CRITICOS {
            criticos[criticos_len] = CriticoDto {
                sku: Sku::from_slice(catalogo.sku(i).as_bytes()),
                nombre: Nombre::from_slice(catalogo.nombre(i).as_bytes()),
                stock: catalogo.stock(i),
            };
            criticos_len += 1;
        }
    }

    let abiertas = ledger
        .cuentas_abiertas()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .len();

    Ok(Json(PanelDto {
        ventas_24h_usd: usd,
        ventas_24h_bs: bs,
        tickets_24h: tickets,
        total_productos: catalogo.len(),
        valor_inventario_usd: catalogo.valor_inventario_usd(),
        criticos,
        criticos_len,
        cuentas_abiertas: abiertas,
        top_productos: top,
        top_productos_len: top_len,
    }))
}

async fn api_tasa(State(state): State<AxumAppState>) -> Result<Json<TasaInfo>, StatusCode> {
    Ok(Json(state.servicio_tasa.info_actual()))
}

async fn api_tasa_pendiente(
    State(state): State<AxumAppState>,
) -> Result<Json<Option<TasaInfo>>, StatusCode> {
    Ok(Json(state.servicio_tasa.tasa_pendiente()))
}

async fn api_tasa_aplicar(State(state): State<AxumAppState>) -> Result<Json<TasaInfo>, StatusCode> {
    state
        .servicio_tasa
        .aplicar_tasa_pendiente()
        .map(Json)
        .map_err(|_| StatusCode::BAD_REQUEST)
}

#[derive(Deserialize)]
struct ManualRateRequest {
    valor: String,
}

async fn api_tasa_manual(
    State(state): State<AxumAppState>,
    Json(payload): Json<ManualRateRequest>,
) -> Result<Json<TasaInfo>, StatusCode> {
    let valor = Decimal::from_str(&payload.valor.trim().replace(',', "."))
        .map_err(|_| StatusCode::BAD_REQUEST)?;
    state
        .servicio_tasa
        .establecer_tasa_manual(valor)
        .map(Json)
        .map_err(|_| StatusCode::BAD_REQUEST)
}

async fn api_sse_events(
    State(state): State<AxumAppState>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let mut rx = state.tx.subscribe();
    let stream = async_stream::stream! {
        loop {
            match rx.recv().await {
                Ok(_) => {
                    yield Ok(Event::default().event("panel-update").data(""));
                }
                Err(_) => break,
            }
        }
    };
    Sse::new(stream).keep_alive(axum::response::sse::KeepAlive::default())
}

async fn api_cuentas(
    State(state): State<AxumAppState>,
) -> Result<Json<Vec<CuentaDto>>, StatusCode> {
    let ledger = state
        .ledger
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let cuentas = ledger
        .cuentas_abiertas()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(cuentas.iter().map(cuenta_dto).collect()))
}

async fn api_productos(
    State(state): State<AxumAppState>,
) -> Result<Json<Vec<ProductoDto>>, StatusCode> {
    let ledger = state
        .ledger
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let catalogo = ledger
        .cargar_catalogo()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let filas = (0..catalogo.len())
        .map(|i| ProductoDto {
            sku: Sku::from_slice(catalogo.sku(i).as_bytes()),
            nombre: Nombre::from_slice(catalogo.nombre(i).as_bytes()),
            precio_usd: catalogo.precio_usd(i),
            impuesto_pct: catalogo.impuesto_pct(i),
            stock: catalogo.stock(i),
            capacidades: catalogo.capacidades(i),
        })
        .collect();
    Ok(Json(filas))
}

struct AppState {
    ledger: Arc<Mutex<Ledger>>,
    servicio_tasa: Arc<ServicioTasa>,
    session_store: SessionStore,
}

fn ahora_unix() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs() as i64)
        .unwrap_or_default()
}

fn hash_pin(pin: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(pin.as_bytes());
    format!("{:x}", hasher.finalize())
}

fn hex_token(token: &[u8; 32]) -> String {
    let mut out = [0u8; 64];
    const HEX: &[u8; 16] = b"0123456789abcdef";
    for i in 0..32 {
        out[i * 2] = HEX[(token[i] >> 4) as usize];
        out[i * 2 + 1] = HEX[(token[i] & 0x0f) as usize];
    }
    String::from_utf8_lossy(&out).into_owned()
}

fn con_ledger<T, E>(
    estado: &AppState,
    operacion: impl FnOnce(&Ledger) -> Result<T, E>,
) -> Result<T, UIError>
where
    E: Into<UIError>,
{
    let guardia = estado.ledger.lock().map_err(|_| {
        UIError::new(
            "almacenamiento bloqueado",
            "El mutex de la base de datos esta envenenado",
        )
    })?;
    operacion(&guardia).map_err(Into::into)
}

// ---------------- DTOs (contrato camelCase con el frontend) ----------------

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ConfigDto {
    nombre: String,
    rubros: u16,
    capacidades: u16,
    tiene_pin: bool,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ProductoInput {
    sku: String,
    nombre: String,
    precio_usd: String,
    impuesto_pct: String,
    stock_inicial: String,
    pesable: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ProductoDto {
    sku: Sku,
    nombre: Nombre,
    precio_usd: Decimal,
    impuesto_pct: Decimal,
    stock: Decimal,
    capacidades: u16,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ItemVentaDto {
    sku: String,
    cantidad: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct LineaTicketDto {
    sku: Sku,
    nombre: Nombre,
    cantidad: Decimal,
    precio_usd: Decimal,
    tasa_bloqueada: Decimal,
    subtotal_usd: Decimal,
    subtotal_bs: Decimal,
}

#[derive(Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct PagoTicketDto {
    metodo: String,
    moneda: Option<String>,
    monto_usd: String,
    monto_bs: String,
    tasa_cambio: Option<String>,
    referencia: Option<String>,
}

#[derive(Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct ResolucionVueltoDto {
    estado: String,
    metodo: Option<String>,
    monto_bs: Option<String>,
    monto_usd: Option<String>,
    tasa: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct TicketDto {
    venta_id: String,
    lineas: Vec<LineaTicketDto>,
    total_usd: Decimal,
    total_bs: Decimal,
    monto_recibido_bs: Decimal,
    vuelto_bs: Decimal,
    tasa_del_dia: Decimal,
    #[serde(skip_serializing_if = "Option::is_none")]
    pagos: Option<Vec<PagoTicketDto>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    estado_vuelto: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    metodo_vuelto: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    monto_vuelto_bs: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    monto_vuelto_usd: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    tasa_vuelto: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct CuentaDto {
    venta_id: String,
    etiqueta: String,
    lineas: usize,
    total_parcial_usd: Decimal,
    total_parcial_bs: Decimal,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct CriticoDto {
    sku: Sku,
    nombre: Nombre,
    stock: Decimal,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct TopProductoDto {
    nombre: Nombre,
    cantidad: Decimal,
}

const MAX_PANEL_TOP: usize = 5;
const MAX_PANEL_CRITICOS: usize = 16;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct PanelDto {
    ventas_24h_usd: Decimal,
    ventas_24h_bs: Decimal,
    tickets_24h: usize,
    total_productos: usize,
    valor_inventario_usd: Decimal,
    criticos: [CriticoDto; MAX_PANEL_CRITICOS],
    criticos_len: usize,
    cuentas_abiertas: usize,
    top_productos: [TopProductoDto; MAX_PANEL_TOP],
    top_productos_len: usize,
}

fn decimal_de(texto: &str) -> Result<Decimal, UIError> {
    Decimal::from_str(texto.trim().replace(',', ".").as_str()).map_err(|_| {
        UIError::new(
            format!("monto invalido: {texto}"),
            "Se esperaba un numero decimal",
        )
    })
}

fn config_requerida(estado: &AppState) -> Result<ConfigNegocio, UIError> {
    con_ledger(estado, |db| db.cargar_config())?.ok_or_else(|| {
        UIError::new(
            "negocio sin inicializar",
            "Ejecute el asistente inicial antes de operar",
        )
    })
}

fn catalogo_fresco(db: &Ledger) -> Result<Catalogo, UIError> {
    Ok(db.cargar_catalogo()?)
}

fn tasa_viva(estado: &AppState) -> Result<Decimal, UIError> {
    let info = estado.servicio_tasa.info_actual();
    if info.valor <= Decimal::ZERO {
        return Err(UIError::new(
            "sin tasa BCV vigente",
            "Actualice la tasa manual o revise la conexion antes de cobrar",
        ));
    }
    Ok(info.valor)
}

fn movimiento(
    sku: &str,
    delta: Decimal,
    motivo: MotivoMovimiento,
    venta_id: Option<String>,
) -> MovimientoStock {
    MovimientoStock {
        id: Uuid::new_v4().to_string(),
        sku: sku.to_string(),
        delta,
        motivo,
        venta_id,
        fecha_unix: ahora_unix(),
        firma_sha256: String::new(),
    }
}

fn descontar_con_lotes_interno(
    db: &Ledger,
    catalogo: &Catalogo,
    idx: usize,
    cantidad: Decimal,
    venta_id: &str,
) -> Result<(), DbError> {
    let es_perecedero = catalogo.capacidades(idx) & capacidades::CAP_PERECEDERO != 0;
    if es_perecedero {
        let sku = catalogo.sku(idx).to_string();
        let mut libro = db.cargar_lotes()?;
        let tocados = libro.descontar_fefo(&sku, cantidad, ahora_unix())?;
        for (lote_id, _) in tocados {
            if let Some((_, disp)) = libro.par_disponible_por_id(&lote_id) {
                db.actualizar_disponible_lote(&lote_id, disp)?;
            }
        }
    }
    let mov = movimiento(
        catalogo.sku(idx),
        -cantidad,
        MotivoMovimiento::Venta,
        Some(venta_id.to_string()),
    );
    db.aplicar_movimiento(mov, |_, _| {})?;
    Ok(())
}

// ---------------- comandos: configuracion ----------------

#[tauri::command]
fn obtener_config(estado: tauri::State<AppState>) -> Result<Option<ConfigDto>, UIError> {
    let cfg = con_ledger(&estado, |db| db.cargar_config())?;
    Ok(cfg.map(|c| ConfigDto {
        capacidades: capacidades_de_rubros(c.rubros),
        tiene_pin: !c.pin_dueno_sha256.is_empty(),
        nombre: c.nombre,
        rubros: c.rubros,
    }))
}

#[tauri::command]
fn inicializar_negocio(
    estado: tauri::State<AppState>,
    nombre: String,
    rubros: u8,
    pin_dueno: Option<String>,
) -> Result<(), UIError> {
    if !rubros_activos(rubros) {
        return Err(UIError::new(
            "seleccion de rubros invalida",
            "Active al menos un rubro conocido (abasto, panaderia, licoreria)",
        ));
    }
    con_ledger(&estado, |db| {
        db.guardar_config(&ConfigNegocio {
            nombre,
            rubros,
            pin_dueno_sha256: pin_dueno.map(|p| hash_pin(&p)).unwrap_or_default(),
        })
    })?;
    Ok(())
}

#[tauri::command]
fn validar_pin_dueno(estado: tauri::State<AppState>, pin: String) -> Result<bool, UIError> {
    let cfg = config_requerida(&estado)?;
    Ok(!cfg.pin_dueno_sha256.is_empty() && cfg.pin_dueno_sha256 == hash_pin(&pin))
}

// ---------------- comandos: productos ----------------

#[tauri::command]
fn crear_producto(estado: tauri::State<AppState>, input: ProductoInput) -> Result<(), UIError> {
    let cfg = config_requerida(&estado)?;
    let permitidas = capacidades_de_rubros(cfg.rubros);
    let mut caps = capacidades::CAP_UNITARIA;
    if input.pesable {
        caps |= capacidades::CAP_PESABLE;
        if permitidas & capacidades::CAP_PESABLE == 0 {
            return Err(UIError::from(ErrorNegocio::CapacidadInactiva(caps)));
        }
    }
    let producto = Producto {
        sku: Sku::new(&input.sku.trim().to_uppercase())
            .map_err(|e| UIError::new("SKU invalido", e))?,
        nombre: Nombre::new(input.nombre.trim()).map_err(|e| UIError::new("nombre invalido", e))?,
        precio_usd: decimal_de(&input.precio_usd)?,
        impuesto_pct: decimal_de(&input.impuesto_pct)?,
        stock: decimal_de(&input.stock_inicial)?,
        capacidades: caps,
    };
    if producto.sku.as_str().is_empty()
        || producto.nombre.as_str().is_empty()
        || producto.precio_usd <= Decimal::ZERO
        || producto.stock < Decimal::ZERO
    {
        return Err(UIError::new(
            "datos de producto invalidos",
            "SKU y nombre obligatorios; precio mayor a cero; stock no negativo",
        ));
    }
    con_ledger(&estado, |db| db.guardar_producto(&producto))?;
    Ok(())
}

#[tauri::command]
fn listar_productos(estado: tauri::State<AppState>) -> Result<Vec<ProductoDto>, UIError> {
    config_requerida(&estado)?;
    let catalogo = con_ledger(&estado, catalogo_fresco)?;
    let filas = (0..catalogo.len())
        .map(|i| ProductoDto {
            sku: Sku::from_slice(catalogo.sku(i).as_bytes()),
            nombre: Nombre::from_slice(catalogo.nombre(i).as_bytes()),
            precio_usd: catalogo.precio_usd(i),
            impuesto_pct: catalogo.impuesto_pct(i),
            stock: catalogo.stock(i),
            capacidades: catalogo.capacidades(i),
        })
        .collect();
    Ok(filas)
}

#[tauri::command]
fn compra_stock(
    estado: tauri::State<AppState>,
    sku: String,
    cantidad: String,
) -> Result<Decimal, UIError> {
    config_requerida(&estado)?;
    let cant = decimal_de(&cantidad)?;
    if cant <= Decimal::ZERO {
        return Err(UIError::new("cantidad invalida", "Debe ser mayor a cero"));
    }
    let mov = movimiento(
        sku.trim().to_uppercase().as_str(),
        cant,
        MotivoMovimiento::Compra,
        None,
    );
    let nuevo_stock = con_ledger(&estado, |db| {
        db.aplicar_movimiento(mov, |_, _| {})?;
        let cat = db.cargar_catalogo()?;
        let idx = cat
            .indice_de(sku.trim().to_uppercase().as_str())
            .ok_or(DbError::Negocio(ErrorNegocio::ProductoInexistente))?;
        Ok(cat.stock(idx))
    })?;
    Ok(nuevo_stock)
}

#[tauri::command]
fn registrar_merma(
    estado: tauri::State<AppState>,
    sku: String,
    cantidad: String,
    lote_id: Option<String>,
) -> Result<Decimal, UIError> {
    config_requerida(&estado)?;
    let cant = decimal_de(&cantidad)?;
    if cant <= Decimal::ZERO {
        return Err(UIError::new("cantidad invalida", "Debe ser mayor a cero"));
    }
    let sku_norm = sku.trim().to_uppercase();

    if let Some(lid) = lote_id {
        let (_, restante) = con_ledger(&estado, |db| {
            let mut libro = db.cargar_lotes()?;
            let restante = libro.registrar_merma(&lid, cant)?;
            Ok((lid.clone(), restante))
        })?;
        con_ledger(&estado, |db| db.actualizar_disponible_lote(&lid, restante))?;
    }

    let mov = movimiento(&sku_norm, -cant, MotivoMovimiento::Merma, None);
    let nuevo_stock = con_ledger(&estado, |db| {
        db.aplicar_movimiento(mov, |_, _| {})?;
        let cat = db.cargar_catalogo()?;
        let idx = cat
            .indice_de(&sku_norm)
            .ok_or(DbError::Negocio(ErrorNegocio::ProductoInexistente))?;
        Ok(cat.stock(idx))
    })?;
    Ok(nuevo_stock)
}

#[tauri::command]
fn crear_lote(
    estado: tauri::State<AppState>,
    sku: String,
    cantidad: String,
    caduce_unix: i64,
) -> Result<String, UIError> {
    let cfg = config_requerida(&estado)?;
    if capacidades_de_rubros(cfg.rubros) & capacidades::CAP_PERECEDERO == 0 {
        return Err(UIError::from(ErrorNegocio::CapacidadInactiva(
            capacidades::CAP_PERECEDERO,
        )));
    }
    let cant = decimal_de(&cantidad)?;
    if cant <= Decimal::ZERO || caduce_unix <= ahora_unix() {
        return Err(UIError::new(
            "lote invalido",
            "Cantidad mayor a cero y caducidad futura requeridas",
        ));
    }
    let sku_norm = sku.trim().to_uppercase();
    let lote = Lote {
        id: Uuid::new_v4().to_string(),
        sku: sku_norm.clone(),
        horneado_unix: ahora_unix(),
        cantidad_inicial: cant,
        disponible: cant,
        caduce_unix,
    };
    con_ledger(&estado, |db| db.guardar_lote(&lote))?;

    let mov = movimiento(&sku_norm, cant, MotivoMovimiento::Compra, None);
    con_ledger(&estado, |db| db.aplicar_movimiento(mov, |_, _| {}))?;
    Ok(lote.id)
}

// ---------------- comandos: venta directa ----------------

#[tauri::command]
fn registrar_venta(
    estado: tauri::State<AppState>,
    items: Vec<ItemVentaDto>,
    monto_recibido_bs: String,
    pagos: Option<Vec<PagoTicketDto>>,
    resolucion_vuelto: Option<ResolucionVueltoDto>,
) -> Result<TicketDto, UIError> {
    if items.is_empty() {
        return Err(UIError::new("venta vacia", "Agregue productos al carrito"));
    }
    let _cfg = config_requerida(&estado)?;
    let tasa = tasa_viva(&estado)?;
    let recibido = decimal_de(&monto_recibido_bs)?;

    con_ledger(&estado, |db| {
        let catalogo = catalogo_fresco(db)?;
        let mut lineas = LineasVenta::nuevas();
        let mut toques: Vec<(usize, Decimal)> = Vec::with_capacity(items.len());
        for item in &items {
            let idx = catalogo
                .indice_de(item.sku.trim().to_uppercase().as_str())
                .ok_or(DbError::Negocio(ErrorNegocio::ProductoInexistente))?;
            let cantidad = decimal_de(&item.cantidad)?;
            validar_linea(catalogo.capacidades(idx), cantidad, catalogo.stock(idx))?;
            toques.push((idx, cantidad));
            lineas.agregar(
                Sku::from_slice(catalogo.sku(idx).as_bytes()),
                Nombre::from_slice(catalogo.nombre(idx).as_bytes()),
                cantidad,
                catalogo.precio_usd(idx),
                tasa,
            );
        }

        let total_usd = lineas.total_usd();
        let total_bs = lineas.total_bs();
        if recibido > Decimal::ZERO && recibido < total_bs {
            return Err(UIError::new(
                "monto insuficiente",
                "El pago recibido no cubre el total en bolivares",
            ));
        }
        let vuelto = if recibido > Decimal::ZERO {
            recibido - total_bs
        } else {
            Decimal::ZERO
        };

        let pagos_model: Vec<PagoVenta> = pagos
            .unwrap_or_default()
            .into_iter()
            .map(|p| PagoVenta {
                metodo: p.metodo,
                moneda: p.moneda.unwrap_or_else(|| "BS".to_string()),
                monto_usd: decimal_de(&p.monto_usd).unwrap_or(Decimal::ZERO),
                monto_bs: decimal_de(&p.monto_bs).unwrap_or(Decimal::ZERO),
                tasa_cambio: p.tasa_cambio.and_then(|t| decimal_de(&t).ok()),
                referencia: p.referencia,
            })
            .collect();

        let (estado_v, metodo_v, monto_v_usd, tasa_v) = match resolucion_vuelto {
            Some(res) => (
                Some(res.estado),
                res.metodo,
                res.monto_usd.and_then(|m| decimal_de(&m).ok()),
                res.tasa.and_then(|t| decimal_de(&t).ok()),
            ),
            None => {
                let est = if vuelto > Decimal::ZERO {
                    Some("PAGADO".to_string())
                } else {
                    Some("SIN_VUELTO".to_string())
                };
                (est, None, None, None)
            }
        };

        let venta_id = Uuid::new_v4().to_string();
        for (idx, cantidad) in &toques {
            descontar_con_lotes_interno(db, &catalogo, *idx, *cantidad, &venta_id)?;
        }

        let venta = Venta {
            id: venta_id,
            etiqueta: String::new(),
            es_cuenta_abierta: false,
            estado: EstadoVenta::Cerrada,
            lineas,
            tasa_del_dia: tasa,
            total_usd,
            total_bs,
            monto_recibido_bs: recibido,
            vuelto_bs: vuelto,
            pagos: pagos_model,
            estado_vuelto: estado_v,
            metodo_vuelto: metodo_v,
            monto_vuelto_usd: monto_v_usd,
            tasa_vuelto: tasa_v,
            fecha_apertura_unix: ahora_unix(),
            fecha_cierre_unix: ahora_unix(),
            firma_sha256: String::new(),
        };
        let firmada = db.guardar_venta(venta)?;

        Ok(armar_ticket(&firmada, recibido, vuelto))
    })
}

fn armar_ticket(venta: &Venta, recibido: Decimal, vuelto: Decimal) -> TicketDto {
    let pagos_dto: Option<Vec<PagoTicketDto>> = if venta.pagos.is_empty() {
        None
    } else {
        Some(
            venta
                .pagos
                .iter()
                .map(|p| PagoTicketDto {
                    metodo: p.metodo.clone(),
                    moneda: Some(p.moneda.clone()),
                    monto_usd: p.monto_usd.to_string(),
                    monto_bs: p.monto_bs.to_string(),
                    tasa_cambio: p.tasa_cambio.map(|t| t.to_string()),
                    referencia: p.referencia.clone(),
                })
                .collect(),
        )
    };

    TicketDto {
        venta_id: venta.id.clone(),
        total_usd: venta.total_usd,
        total_bs: venta.total_bs,
        monto_recibido_bs: recibido,
        vuelto_bs: vuelto,
        tasa_del_dia: venta.tasa_del_dia,
        pagos: pagos_dto,
        estado_vuelto: venta.estado_vuelto.clone(),
        metodo_vuelto: venta.metodo_vuelto.clone(),
        monto_vuelto_bs: if vuelto > Decimal::ZERO {
            Some(vuelto.to_string())
        } else {
            None
        },
        monto_vuelto_usd: venta.monto_vuelto_usd.map(|m| m.to_string()),
        tasa_vuelto: venta.tasa_vuelto.map(|t| t.to_string()),
        lineas: (0..venta.lineas.skus.len())
            .map(|i| {
                let sub_usd = venta.lineas.cantidades[i] * venta.lineas.precios_usd[i];
                LineaTicketDto {
                    sku: venta.lineas.skus[i].clone(),
                    nombre: venta.lineas.nombres[i].clone(),
                    cantidad: venta.lineas.cantidades[i],
                    precio_usd: venta.lineas.precios_usd[i],
                    tasa_bloqueada: venta.lineas.tasas_bloqueadas[i],
                    subtotal_usd: sub_usd,
                    subtotal_bs: sub_usd * venta.lineas.tasas_bloqueadas[i],
                }
            })
            .collect(),
    }
}

// ---------------- comandos: cuenta abierta (licoreria) ----------------

#[tauri::command]
fn abrir_cuenta(estado: tauri::State<AppState>, etiqueta: String) -> Result<CuentaDto, UIError> {
    let cfg = config_requerida(&estado)?;
    let permitidas = capacidades_de_rubros(cfg.rubros);
    if !licoreria::admite_cuenta_abierta(permitidas) {
        return Err(UIError::from(ErrorNegocio::CapacidadInactiva(
            capacidades::CAP_CUENTA_ABIERTA,
        )));
    }
    if etiqueta.trim().is_empty() {
        return Err(UIError::new(
            "etiqueta requerida",
            "Identifique mesa o cliente",
        ));
    }
    let venta = Venta {
        id: Uuid::new_v4().to_string(),
        etiqueta: etiqueta.trim().to_string(),
        es_cuenta_abierta: true,
        estado: EstadoVenta::Abierta,
        lineas: LineasVenta::nuevas(),
        tasa_del_dia: Decimal::ZERO,
        total_usd: Decimal::ZERO,
        total_bs: Decimal::ZERO,
        monto_recibido_bs: Decimal::ZERO,
        vuelto_bs: Decimal::ZERO,
        pagos: Vec::new(),
        estado_vuelto: None,
        metodo_vuelto: None,
        monto_vuelto_usd: None,
        tasa_vuelto: None,
        fecha_apertura_unix: ahora_unix(),
        fecha_cierre_unix: 0,
        firma_sha256: String::new(),
    };
    let guardada = con_ledger(&estado, |db| db.guardar_venta(venta))?;
    Ok(cuenta_dto(&guardada))
}

fn cuenta_dto(v: &Venta) -> CuentaDto {
    CuentaDto {
        venta_id: v.id.clone(),
        etiqueta: v.etiqueta.clone(),
        lineas: v.lineas.skus.len(),
        total_parcial_usd: v.lineas.total_usd(),
        total_parcial_bs: v.lineas.total_bs(),
    }
}

#[tauri::command]
fn listar_cuentas(estado: tauri::State<AppState>) -> Result<Vec<CuentaDto>, UIError> {
    config_requerida(&estado)?;
    Ok(con_ledger(&estado, |db| db.cuentas_abiertas())?
        .iter()
        .map(cuenta_dto)
        .collect())
}

#[tauri::command]
fn agregar_consumo(
    estado: tauri::State<AppState>,
    venta_id: String,
    sku: String,
    cantidad: String,
) -> Result<CuentaDto, UIError> {
    let _cfg = config_requerida(&estado)?;
    let tasa = tasa_viva(&estado)?;
    let cant = decimal_de(&cantidad)?;

    let actualizada = con_ledger(&estado, |db| {
        let mut venta = db
            .cargar_venta(&venta_id)?
            .filter(|v| v.es_cuenta_abierta && v.estado == EstadoVenta::Abierta)
            .ok_or(DbError::Negocio(ErrorNegocio::CuentaInvalida(
                venta_id.clone(),
            )))?;

        let catalogo = catalogo_fresco(db)?;
        let idx = catalogo
            .indice_de(sku.trim().to_uppercase().as_str())
            .ok_or(DbError::Negocio(ErrorNegocio::ProductoInexistente))?;
        validar_linea(catalogo.capacidades(idx), cant, catalogo.stock(idx))?;

        venta.lineas.agregar(
            Sku::from_slice(catalogo.sku(idx).as_bytes()),
            Nombre::from_slice(catalogo.nombre(idx).as_bytes()),
            cant,
            catalogo.precio_usd(idx),
            tasa,
        );
        descontar_con_lotes_interno(db, &catalogo, idx, cant, &venta.id)?;
        db.guardar_venta(venta)
    })?;
    Ok(cuenta_dto(&actualizada))
}

#[tauri::command]
fn cerrar_cuenta(
    estado: tauri::State<AppState>,
    venta_id: String,
    monto_recibido_bs: String,
    pagos: Option<Vec<PagoTicketDto>>,
    resolucion_vuelto: Option<ResolucionVueltoDto>,
) -> Result<TicketDto, UIError> {
    let _cfg = config_requerida(&estado)?;
    let recibido = decimal_de(&monto_recibido_bs)?;

    let cerrada = con_ledger(&estado, |db| {
        let mut venta = db
            .cargar_venta(&venta_id)?
            .filter(|v| v.es_cuenta_abierta && v.estado == EstadoVenta::Abierta)
            .ok_or(DbError::Negocio(ErrorNegocio::CuentaInvalida(venta_id)))?;

        let cierre = licoreria::liquidar_cierre(&venta.lineas);
        if recibido > Decimal::ZERO && recibido < cierre.total_bs {
            return Err(DbError::Negocio(ErrorNegocio::PagoInsuficiente {
                requerido: cierre.total_bs,
                recibido,
            }));
        }

        let vuelto = if recibido > Decimal::ZERO {
            recibido - cierre.total_bs
        } else {
            Decimal::ZERO
        };

        let pagos_model: Vec<PagoVenta> = pagos
            .unwrap_or_default()
            .into_iter()
            .map(|p| PagoVenta {
                metodo: p.metodo,
                moneda: p.moneda.unwrap_or_else(|| "BS".to_string()),
                monto_usd: decimal_de(&p.monto_usd).unwrap_or(Decimal::ZERO),
                monto_bs: decimal_de(&p.monto_bs).unwrap_or(Decimal::ZERO),
                tasa_cambio: p.tasa_cambio.and_then(|t| decimal_de(&t).ok()),
                referencia: p.referencia,
            })
            .collect();

        let (estado_v, metodo_v, monto_v_usd, tasa_v) = match resolucion_vuelto {
            Some(res) => (
                Some(res.estado),
                res.metodo,
                res.monto_usd.and_then(|m| decimal_de(&m).ok()),
                res.tasa.and_then(|t| decimal_de(&t).ok()),
            ),
            None => {
                let est = if vuelto > Decimal::ZERO {
                    Some("PAGADO".to_string())
                } else {
                    Some("SIN_VUELTO".to_string())
                };
                (est, None, None, None)
            }
        };

        venta.estado = EstadoVenta::Cerrada;
        venta.total_usd = cierre.total_usd;
        venta.total_bs = cierre.total_bs;
        venta.monto_recibido_bs = recibido;
        venta.vuelto_bs = vuelto;
        venta.pagos = pagos_model;
        venta.estado_vuelto = estado_v;
        venta.metodo_vuelto = metodo_v;
        venta.monto_vuelto_usd = monto_v_usd;
        venta.tasa_vuelto = tasa_v;
        venta.fecha_cierre_unix = ahora_unix();
        db.guardar_venta(venta)
    })?;

    Ok(armar_ticket(
        &cerrada,
        cerrada.monto_recibido_bs,
        cerrada.vuelto_bs,
    ))
}

// ---------------- comandos: panel del dueno ----------------

#[tauri::command]
fn datos_panel(estado: tauri::State<AppState>) -> Result<PanelDto, UIError> {
    config_requerida(&estado)?;
    con_ledger(&estado, |db| {
        let catalogo = db.cargar_catalogo()?;
        let limite = ahora_unix() - 86_400;
        let ventas = db.ventas_recientes(2_000)?;

        let mut usd = Decimal::ZERO;
        let mut bs = Decimal::ZERO;
        let mut tickets = 0usize;

        const MAX_VENDIDOS: usize = 32;
        const MAX_TOP: usize = 5;
        let mut vendidos_nombre: [Nombre; MAX_VENDIDOS] = [Nombre::empty(); MAX_VENDIDOS];
        let mut vendidos_cant: [Decimal; MAX_VENDIDOS] = [Decimal::ZERO; MAX_VENDIDOS];
        let mut vendidos_len: usize = 0;

        for v in &ventas {
            if v.estado != EstadoVenta::Cerrada || v.fecha_cierre_unix < limite {
                continue;
            }
            tickets += 1;
            usd += v.total_usd;
            bs += v.total_bs;
            for i in 0..v.lineas.nombres.len() {
                let nombre = &v.lineas.nombres[i];
                let cant = v.lineas.cantidades[i];
                let mut found = false;
                for j in 0..vendidos_len {
                    if vendidos_nombre[j].as_str() == nombre.as_str() {
                        vendidos_cant[j] += cant;
                        found = true;
                        break;
                    }
                }
                if !found && vendidos_len < MAX_VENDIDOS {
                    vendidos_nombre[vendidos_len] = nombre.clone();
                    vendidos_cant[vendidos_len] = cant;
                    vendidos_len += 1;
                }
            }
        }

        let mut top_len: usize = 0;
        let mut top_nombre: [Nombre; MAX_TOP] = [Nombre::empty(); MAX_TOP];
        let mut top_cant: [Decimal; MAX_TOP] = [Decimal::ZERO; MAX_TOP];
        for k in 0..vendidos_len {
            if top_len < MAX_TOP {
                top_nombre[top_len] = vendidos_nombre[k].clone();
                top_cant[top_len] = vendidos_cant[k];
                top_len += 1;
                let mut m = top_len - 1;
                while m > 0 && top_cant[m] > top_cant[m - 1] {
                    top_nombre.swap(m, m - 1);
                    top_cant.swap(m, m - 1);
                    m -= 1;
                }
            } else if vendidos_cant[k] > top_cant[MAX_TOP - 1] {
                top_nombre[MAX_TOP - 1] = vendidos_nombre[k].clone();
                top_cant[MAX_TOP - 1] = vendidos_cant[k];
                let mut m = MAX_TOP - 1;
                while m > 0 && top_cant[m] > top_cant[m - 1] {
                    top_nombre.swap(m, m - 1);
                    top_cant.swap(m, m - 1);
                    m -= 1;
                }
            }
        }

        let mut top: [TopProductoDto; MAX_TOP] = [TopProductoDto {
            nombre: Nombre::empty(),
            cantidad: Decimal::ZERO,
        }; MAX_TOP];
        for i in 0..top_len {
            top[i] = TopProductoDto {
                nombre: top_nombre[i].clone(),
                cantidad: top_cant[i],
            };
        }

        const MAX_CRITICOS: usize = 16;
        let mut criticos: [CriticoDto; MAX_CRITICOS] = [CriticoDto {
            sku: Sku::empty(),
            nombre: Nombre::empty(),
            stock: Decimal::ZERO,
        }; MAX_CRITICOS];
        let mut criticos_len: usize = 0;
        for i in 0..catalogo.len() {
            if catalogo.stock(i) <= dec!(5) && criticos_len < MAX_CRITICOS {
                criticos[criticos_len] = CriticoDto {
                    sku: Sku::from_slice(catalogo.sku(i).as_bytes()),
                    nombre: Nombre::from_slice(catalogo.nombre(i).as_bytes()),
                    stock: catalogo.stock(i),
                };
                criticos_len += 1;
            }
        }

        let abiertas = db.cuentas_abiertas()?.len();

        Ok(PanelDto {
            ventas_24h_usd: usd,
            ventas_24h_bs: bs,
            tickets_24h: tickets,
            valor_inventario_usd: catalogo.valor_inventario_usd(),
            total_productos: catalogo.len(),
            criticos,
            criticos_len,
            cuentas_abiertas: abiertas,
            top_productos: top,
            top_productos_len: top_len,
        })
    })
}

#[tauri::command]
fn obtener_tasa_bcv(state: tauri::State<AppState>) -> Result<TasaInfo, UIError> {
    Ok(state.servicio_tasa.info_actual())
}

#[tauri::command]
async fn forzar_actualizacion_tasa(state: tauri::State<'_, AppState>) -> Result<TasaInfo, UIError> {
    state.servicio_tasa.refrescar().await
}

#[tauri::command]
fn obtener_tasa_pendiente(state: tauri::State<AppState>) -> Result<Option<TasaInfo>, UIError> {
    Ok(state.servicio_tasa.tasa_pendiente())
}

#[tauri::command]
fn aplicar_tasa_pendiente(state: tauri::State<AppState>) -> Result<TasaInfo, UIError> {
    state.servicio_tasa.aplicar_tasa_pendiente()
}

#[tauri::command]
fn establecer_tasa_manual(
    state: tauri::State<AppState>,
    valor: String,
) -> Result<TasaInfo, UIError> {
    let valor = Decimal::from_str(&valor.trim().replace(',', "."))
        .map_err(|_| UIError::new("tasa inválida", "Formato decimal inválido"))?;
    state.servicio_tasa.establecer_tasa_manual(valor)
}

#[tauri::command]
fn show_main_window(window: tauri::Window) {
    let _ = window.show();
}

#[derive(Deserialize)]
struct LoginRequest {
    pin: String,
}

#[derive(Serialize)]
struct LoginResponse {
    ok: bool,
    message: String,
}

#[tauri::command]
async fn api_login(
    state: tauri::State<'_, AppState>,
    payload: LoginRequest,
) -> Result<LoginResponse, UIError> {
    let cfg = config_requerida(&state)?;
    if cfg.pin_dueno_sha256.is_empty() {
        return Ok(LoginResponse {
            ok: false,
            message: "No hay PIN configurado".into(),
        });
    }
    if cfg.pin_dueno_sha256 != hash_pin(&payload.pin) {
        return Ok(LoginResponse {
            ok: false,
            message: "PIN incorrecto".into(),
        });
    }
    let token = state.session_store.create()?;
    Ok(LoginResponse {
        ok: true,
        message: hex_token(&token),
    })
}

#[tauri::command]
fn api_logout(state: tauri::State<'_, AppState>) -> Result<LoginResponse, UIError> {
    if let Some(token) = extract_session_token(&HeaderMap::new()) {
        state.session_store.remove(&token);
    }
    Ok(LoginResponse {
        ok: true,
        message: "Sesion cerrada".into(),
    })
}

#[tauri::command]
fn get_lan_ip() -> Result<String, UIError> {
    let addrs = local_ip_address::list_afinet_netifas()
        .map_err(|e| UIError::new("error obteniendo IP", &e.to_string()))?;
    for (_, ip) in addrs {
        if ip.is_ipv4() && !ip.is_loopback() {
            return Ok(ip.to_string());
        }
    }
    Ok("127.0.0.1".into())
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct QrData {
    url: String,
    qr_base64: String,
}

#[tauri::command]
fn generar_qr_panel(state: tauri::State<AppState>) -> Result<QrData, UIError> {
    let ip = get_lan_ip()?;
    let url = format!("http://{}:4000/panel", ip);

    let code = qrcode::QrCode::new(url.as_bytes())
        .map_err(|e| UIError::new("error generando QR", &e.to_string()))?;
    let image = code
        .render::<image::Luma<u8>>()
        .min_dimensions(256, 256)
        .dark_color(image::Luma([0x0f]))
        .light_color(image::Luma([0x1e]))
        .build();

    let mut png_bytes = Vec::new();
    image
        .write_to(
            &mut std::io::Cursor::new(&mut png_bytes),
            image::ImageFormat::Png,
        )
        .map_err(|e| UIError::new("error codificando PNG", &e.to_string()))?;

    let qr_base64 = base64::encode(&png_bytes);
    Ok(QrData { url, qr_base64 })
}

#[tauri::command]
fn abrir_panel_movil(app: tauri::AppHandle) -> Result<(), UIError> {
    let ip = get_lan_ip()?;
    let url = format!("http://{}:4000/panel", ip);
    let webview_url = url
        .parse()
        .map_err(|e| UIError::new("error parseando URL", &e.to_string()))?;

    tauri::WebviewWindowBuilder::new(
        &app,
        "panel-movil",
        tauri::WebviewUrl::External(webview_url),
    )
    .title("DatioLabs Panel Móvil")
    .inner_size(400.0, 700.0)
    .resizable(true)
    .decorations(true)
    .always_on_top(false)
    .build()
    .map_err(|e| UIError::new("error creando ventana", &e.to_string()))?;

    Ok(())
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct BackupMetadataDto {
    version: u32,
    timestamp_unix: i64,
    arboles: Vec<String>,
    total_registros: usize,
    checksum_sha256: String,
}

#[derive(Deserialize)]
struct BackupRuta {
    ruta: String,
}

#[tauri::command]
fn exportar_backup(
    state: tauri::State<AppState>,
    payload: BackupRuta,
) -> Result<BackupMetadataDto, UIError> {
    let db = state
        .ledger
        .lock()
        .map_err(|_| UIError::new("db bloqueada", ""))?;
    let meta = db.exportar_backup(&payload.ruta)?;
    Ok(BackupMetadataDto {
        version: meta.version,
        timestamp_unix: meta.timestamp_unix,
        arboles: meta.arboles,
        total_registros: meta.total_registros,
        checksum_sha256: meta.checksum_sha256,
    })
}

#[tauri::command]
fn importar_backup(
    state: tauri::State<AppState>,
    payload: BackupRuta,
) -> Result<BackupMetadataDto, UIError> {
    let db = state
        .ledger
        .lock()
        .map_err(|_| UIError::new("db bloqueada", ""))?;
    let meta = db.importar_backup(&payload.ruta)?;
    Ok(BackupMetadataDto {
        version: meta.version,
        timestamp_unix: meta.timestamp_unix,
        arboles: meta.arboles,
        total_registros: meta.total_registros,
        checksum_sha256: meta.checksum_sha256,
    })
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct BackupInfo {
    ruta: String,
    metadata: BackupMetadataDto,
}

#[tauri::command]
fn listar_backups(
    state: tauri::State<AppState>,
    directorio: String,
) -> Result<Vec<BackupInfo>, UIError> {
    let db = state
        .ledger
        .lock()
        .map_err(|_| UIError::new("db bloqueada", ""))?;
    let metas = db.listar_backups(&directorio)?;
    let mut infos = Vec::new();
    for meta in metas {
        let ruta =
            std::path::Path::new(&directorio).join(format!("datio_{}.backup", meta.timestamp_unix));
        infos.push(BackupInfo {
            ruta: ruta.to_string_lossy().to_string(),
            metadata: BackupMetadataDto {
                version: meta.version,
                timestamp_unix: meta.timestamp_unix,
                arboles: meta.arboles,
                total_registros: meta.total_registros,
                checksum_sha256: meta.checksum_sha256,
            },
        });
    }
    Ok(infos)
}

#[tauri::command]
fn auto_backup(
    state: tauri::State<AppState>,
    directorio: String,
    max_backups: usize,
) -> Result<Option<BackupMetadataDto>, UIError> {
    let db = state
        .ledger
        .lock()
        .map_err(|_| UIError::new("db bloqueada", ""))?;
    let meta = db.auto_backup(&directorio, max_backups)?;
    Ok(meta.map(|m| BackupMetadataDto {
        version: m.version,
        timestamp_unix: m.timestamp_unix,
        arboles: m.arboles,
        total_registros: m.total_registros,
        checksum_sha256: m.checksum_sha256,
    }))
}

#[tauri::command]
fn get_backup_dir() -> Result<String, UIError> {
    let dir = dirs::data_dir()
        .unwrap_or_else(|| std::env::temp_dir())
        .join("DatioLabs")
        .join("backups");
    Ok(dir.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(target_os = "windows")]
    {
        // En Windows, verificar activación de licencia registrada por el instalador
        use std::process::Command;
        let salida = Command::new("reg")
            .args(["query", r"HKCU\Software\DatioLabs", "/v", "LicenseKey"])
            .output();

        let activado = match salida {
            Ok(out) if out.status.success() => {
                let texto = String::from_utf8_lossy(&out.stdout);
                texto.contains("LicenseKey") && !texto.trim().is_empty()
            }
            _ => false,
        };

        if !activado && !cfg!(debug_assertions) {
            eprintln!(
                "LICENCIA NO ACTIVADA: Ejecute el instalador autorizado para activar su copia."
            );
            std::process::exit(1);
        }
    }

    tauri::Builder::default()
        .setup(|app| {
            let mut db_path = std::path::PathBuf::from("../datiolabs_db");
            if let Ok(dir) = app.path().app_data_dir() {
                let _ = std::fs::create_dir_all(&dir);
                db_path = dir.join("datiolabs_db");
            }
            let ledger = Ledger::abrir(db_path.to_str().unwrap_or("../datiolabs_db"))
                .map_err(UIError::from)?;

            let mut ruta_cache = db_path.clone();
            ruta_cache.set_file_name("tasa_bcv_cache.json");

            let ledger_arc = Arc::new(Mutex::new(ledger));
            let servicio_tasa = Arc::new(ServicioTasa::new(ruta_cache, ledger_arc.clone())?);

            let app_state = AppState {
                ledger: ledger_arc.clone(),
                servicio_tasa: servicio_tasa.clone(),
                session_store: SessionStore::new(&ledger_arc.inner_db())?,
            };

            app.manage(app_state.clone());

            iniciar_refresco(servicio_tasa);

            let session_store = app_state.session_store.clone();
            let ledger_for_axum = ledger_arc.clone();
            let servicio_tasa_for_axum = servicio_tasa.clone();

            tauri::async_runtime::spawn(async move {
                let cors = CorsLayer::new()
                    .allow_origin(Any)
                    .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
                    .allow_headers(Any)
                    .allow_credentials(true);

                let protected = Router::new()
                    .route("/api/panel", get(api_panel))
                    .route("/api/tasa", get(api_tasa))
                    .route("/api/tasa/pendiente", get(api_tasa_pendiente))
                    .route("/api/tasa/aplicar", post(api_tasa_aplicar))
                    .route("/api/tasa/manual", post(api_tasa_manual))
                    .route("/api/cuentas", get(api_cuentas))
                    .route("/api/productos", get(api_productos))
                    .layer(middleware::from_fn_with_state(
                        session_store.clone(),
                        auth_middleware,
                    ));

                let public = Router::new()
                    .route("/api/auth/login", post(api_auth_login))
                    .route("/api/auth/logout", post(api_auth_logout))
                    .route("/api/events", get(api_sse_events))
                    .route("/panel", get(serve_panel_html))
                    .layer(cors.clone());

                let app = Router::new()
                    .merge(public)
                    .merge(protected)
                    .layer(axum::extract::DefaultBodyLimit::max(2 * 1024 * 1024))
                    .with_state(AxumAppState {
                        ledger: ledger_for_axum,
                        servicio_tasa: servicio_tasa_for_axum,
                        session_store,
                        tx: broadcast::channel(16).0,
                    });

                if let Ok(listener) = tokio::net::TcpListener::bind("0.0.0.0:4000").await {
                    let _ = axum::serve(listener, app).await;
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            obtener_config,
            inicializar_negocio,
            validar_pin_dueno,
            crear_producto,
            listar_productos,
            compra_stock,
            registrar_merma,
            crear_lote,
            registrar_venta,
            abrir_cuenta,
            listar_cuentas,
            agregar_consumo,
            cerrar_cuenta,
            datos_panel,
            obtener_tasa_bcv,
            forzar_actualizacion_tasa,
            obtener_tasa_pendiente,
            aplicar_tasa_pendiente,
            establecer_tasa_manual,
            show_main_window,
            api_login,
            api_logout,
            get_lan_ip,
            generar_qr_panel,
            abrir_panel_movil,
            exportar_backup,
            importar_backup,
            listar_backups,
            auto_backup,
            get_backup_dir
        ])
        .run(tauri::generate_context!())
        .unwrap_or_else(|e| {
            eprintln!("Error fatal: {}", e);
        });
}
