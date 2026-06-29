mod error;
#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use apex_core::ledger::Ledger;
use error::UIError;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tauri::Manager;


use axum::{
    extract::State as AxumState,
    http::Method,
    response::Json,
    routing::get,
    Router,
};
use tower_http::cors::{Any, CorsLayer};
// Contenedor de estado seguro para Tauri
struct AppState {
    ledger: Arc<Mutex<Option<Ledger>>>,
    tasa_bcv: Arc<Mutex<Decimal>>,
}


#[tauri::command]
async fn request_sudo() -> Result<String, UIError> { Ok("dummy".to_string()) }

#[tauri::command]
async fn select_data_source() -> Result<Option<String>, UIError> { Ok(None) }

#[tauri::command]
async fn execute_agnostic_ingestion() -> Result<String, UIError> { Ok("dummy".to_string()) }
#[tauri::command]
async fn sync_bcv_rate(_state: tauri::State<'_, AppState>) -> Result<String, UIError> {
    let url = "https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv";
    let client = reqwest::Client::new();
    let res = client.get(url).send().await.map_err(|e| UIError::from(e.to_string()))?;
    let json: serde_json::Value = res.json().await.map_err(|e| UIError::from(e.to_string()))?;
    
    if let Some(price) = json.get("monitors").and_then(|m| m.get("usd")).and_then(|u| u.get("price")) {
        Ok(price.to_string())
    } else {
        Err(UIError::from("No se pudo parsear el precio de la API del BCV".to_string()))
    }
}

#[tauri::command]
fn run_ingestion_pipeline() -> Result<Vec<u8>, UIError> {
    use arrow::array::{Int64Array, StringArray};
    use arrow::datatypes::{DataType, Field, Schema};
    use arrow::ipc::writer::StreamWriter;
    use arrow::record_batch::RecordBatch;
    use std::sync::Arc;

    let schema = Arc::new(Schema::new(vec![
        Field::new("sku", DataType::Utf8, false),
        Field::new("qty", DataType::Int64, false),
        Field::new("status", DataType::Utf8, false),
    ]));

    let sku_array = StringArray::from(vec![
        "PROD-001", "PROD-002", "PROD-003", "PROD-004", "PROD-005",
    ]);
    let qty_array = Int64Array::from(vec![150, 200, 50, 0, 10]);
    let status_array = StringArray::from(vec!["ACTIVE", "ACTIVE", "WARNING", "DEAD", "WARNING"]);

    let batch = RecordBatch::try_new(
        schema.clone(),
        vec![
            Arc::new(sku_array),
            Arc::new(qty_array),
            Arc::new(status_array),
        ],
    )
    .map_err(|e| format!("Error creando batch: {}", e))?;

    let mut buffer = Vec::new();
    {
        let mut writer = StreamWriter::try_new(&mut buffer, &schema)
            .map_err(|e| format!("Error en StreamWriter: {}", e))?;
        writer
            .write(&batch)
            .map_err(|e| format!("Error escribiendo batch: {}", e))?;
        writer
            .finish()
            .map_err(|e| format!("Error finalizando stream: {}", e))?;
    }

    Ok(buffer)
}

#[tauri::command]
async fn register_pos_transaction(
    state: tauri::State<'_, AppState>,
    sku: String,
    qty: rust_decimal::Decimal,
    price: rust_decimal::Decimal,
) -> Result<String, UIError> {
    if let Ok(ledger_guard) = state.ledger.lock()
        && let Some(ledger) = &*ledger_guard
    {
        use std::time::{SystemTime, UNIX_EPOCH};
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or(std::time::Duration::from_secs(0));
        let tx_id = format!("POS-{}-{}", now.as_secs(), now.subsec_micros());

        let record = apex_core::models::RawRecord {
            tx_id: tx_id.clone(),
            product_id: sku,
            qty_delta: qty, // Negativo para ventas
            cost_usd: price,
            price_usd: price,
            tx_timestamp_sec: now.as_secs() as i64,
            client_id: Some("POS-LOCAL".to_string()),
        };

        ledger
            .append_record(&record, "pos_terminal")
            .map_err(|e| e.to_string())?;

        Ok(tx_id)
    } else {
        Err("Ledger inactivo".to_string().into())
    }
}

#[tauri::command]
fn get_inventory_arrow(state: tauri::State<AppState>) -> Result<Vec<u8>, UIError> {
    let ledger_guard = state
        .ledger
        .lock()
        .map_err(|e| format!("Error de concurrencia: {}", e))?;

    if let Some(ledger) = &*ledger_guard {
        let inv = ledger
            .project_current_inventory()
            .map_err(|e| e.to_string())?;

        let binary = apex_core::arrow_transport::inventory_to_arrow_ipc(&inv)
            .map_err(|e| format!("Error en transporte Arrow: {:?}", e))?;

        Ok(binary)
    } else {
        Err("Ledger no inicializado".to_string().into())
    }
}

#[tauri::command]
fn get_inventory(
    state: tauri::State<AppState>,
) -> Result<HashMap<String, (apex_core::nodes::Producto, apex_core::nodes::Infraestructura)>, UIError> {
    let ledger_guard = state
        .ledger
        .lock()
        .map_err(|e| format!("Error de concurrencia: {}", e))?;

    if let Some(ledger) = &*ledger_guard {
        let inv = ledger
            .project_current_inventory()
            .map_err(|e| e.to_string())?;
        Ok(inv)
    } else {
        Ok(HashMap::new())
    }
}

#[tauri::command]
fn get_tasa_bcv(state: tauri::State<AppState>) -> String {
    if let Ok(tasa) = state.tasa_bcv.lock() {
        tasa.to_string()
    } else {
        "0.00".to_string()
    }
}

#[tauri::command]
fn show_main_window(window: tauri::Window) {
    let _ = window.show();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("Iniciando aplicación...");
    // Intentar inicializar el Ledger
    println!("Abriendo ledger...");
    let ledger = Ledger::new("../apex_db").ok();
    println!("Ledger inicializado: {}", ledger.is_some());

    // Recuperar última tasa si existe el ledger
    let initial_tasa = if let Some(ref l) = ledger {
        l.get_last_bcv_rate()
    } else {
        Decimal::ZERO
    };
    println!("Tasa inicial obtenida: {}", initial_tasa);

    let state = AppState {
        ledger: Arc::new(Mutex::new(ledger)),
        tasa_bcv: Arc::new(Mutex::new(initial_tasa)),
    };

    println!("Construyendo Tauri...");
    tauri::Builder::default()
        .manage(state)
        .setup(|app| {
            // Sentinel Background Task (CDC)
            let state = app.state::<AppState>();
            let _ledger_clone = state.ledger.clone();

            tauri::async_runtime::spawn(async move {
                // Background CDC thread disabled for Android cross-compilation
            });

            // Marketplace REST API (Axum)
            let api_ledger = app.state::<AppState>().ledger.clone();
            tauri::async_runtime::spawn(async move {
                let cors = CorsLayer::new()
                    .allow_origin(Any)
                    .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
                    .allow_headers(Any);

                let app = Router::new()
                    .route("/api/inventory", get(api_get_inventory))
                    .layer(cors)
                    .with_state(api_ledger);

                println!("MARKETPLACE API EN LÍNEA: Escuchando en http://127.0.0.1:4000");
                let listener = tokio::net::TcpListener::bind("127.0.0.1:4000").await.unwrap();
                axum::serve(listener, app).await.unwrap();
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_inventory,
            get_inventory_arrow,
            run_ingestion_pipeline,
            sync_bcv_rate,
            get_tasa_bcv,
            show_main_window,
            select_data_source,
            
            execute_agnostic_ingestion,
            request_sudo,
            get_crm_clusters,
            register_pos_transaction
        ])
        .run(tauri::generate_context!())
        .unwrap_or_else(|e| {
            eprintln!("Error fatal inicializando Oráculo: {}", e);
            std::process::exit(1);
        });
}

#[derive(Serialize, Deserialize)]
struct CrmCluster {
    id: u16,
    name: String,
    dimension: String,
    description: String,
    size: usize,
    affinity: rust_decimal::Decimal,
}

#[tauri::command]
fn get_crm_clusters(_state: tauri::State<AppState>) -> Result<Vec<CrmCluster>, UIError> {
    Ok(vec![])
}

// Axum API Handlers para Marketplace
#[derive(Serialize)]
struct ApiProduct {
    id: String,
    name: String,
    price: rust_decimal::Decimal,
    category: String,
    image: String,
}

async fn api_get_inventory(
    AxumState(ledger_arc): AxumState<Arc<Mutex<Option<Ledger>>>>,
) -> Json<Vec<ApiProduct>> {
    let mut products = Vec::new();
    
    let inv_opt = ledger_arc
        .lock()
        .ok()
        .and_then(|guard| guard.as_ref().and_then(|ledger| ledger.project_current_inventory().ok()));

    if let Some(inv) = inv_opt {
        for (sku, (prod, infra)) in inv {
            if infra.stock_actual > 0 {
                // Mapeo básico para B2C
                let (name, category, image) = match sku.as_str() {
                    s if s.contains("AX") => ("Procesador AX", "Componentes", "Imagen_Vectorial_01"),
                    s if s.contains("K9") || s.contains("RAM") => ("Memoria RAM K-9", "Componentes", "Imagen_Vectorial_02"),
                    s if s.contains("SHOE") || s.contains("ZAPAT") => ("Zapatillas Deportivas Ultra", "Moda", "Zapatillas_Deportivas"),
                    s if s.contains("CAFE") => ("Cafetera Exprés Automática", "Hogar", "Cafetera_Expres"),
                    _ => ("Producto Genérico", "Otros", "Producto_00"),
                };
                
                products.push(ApiProduct {
                    id: sku.clone(),
                    name: name.to_string(),
                    price: prod.precio_actual,
                    category: category.to_string(),
                    image: image.to_string(),
                });
            }
        }
    }
    
    Json(products)
}
