use crate::error::UIError;
use datiolabs_core::db::Database as Ledger;
use datiolabs_core::models::EventoTasaBcv;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::str::FromStr;
use std::sync::{Arc, LazyLock, RwLock};
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use scraper::{Html, Selector};

const URL_BCV: &str = "https://www.bcv.org.ve/";
const FUENTE: &str = "BCV";
const INTERVALO_REFRESCHO_SEG: u64 = 3600;
const TIMEOUT_HTTP_SEG: u64 = 30;

static SELECTOR_DIV: LazyLock<Option<Selector>> =
    LazyLock::new(|| Selector::parse("div.recuadrotsmc").ok());
static SELECTOR_SPAN: LazyLock<Option<Selector>> = LazyLock::new(|| Selector::parse("span").ok());
static SELECTOR_STRONG: LazyLock<Option<Selector>> =
    LazyLock::new(|| Selector::parse("strong").ok());

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum DireccionTasa {
    Subio,
    Bajo,
    Estable,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TasaInfo {
    pub valor: Decimal,
    pub fecha_unix: i64,
    pub fluctuacion_pct: Option<Decimal>,
    pub direccion: Option<DireccionTasa>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CacheTasa {
    valor: Decimal,
    fecha_unix: i64,
}

#[derive(Default)]
struct Snapshot {
    actual: Option<CacheTasa>,
    anterior: Option<Decimal>,
    pendiente: Option<CacheTasa>,
}

pub struct ServicioTasa {
    cliente: reqwest::Client,
    ruta_cache: PathBuf,
    ledger: Arc<std::sync::Mutex<Ledger>>,
    snapshot: RwLock<Snapshot>,
}

impl ServicioTasa {
    pub fn new(
        ruta_cache: PathBuf,
        ledger: Arc<std::sync::Mutex<Ledger>>,
    ) -> Result<Self, UIError> {
        let cliente = reqwest::Client::builder()
            .danger_accept_invalid_certs(true)
            .timeout(Duration::from_secs(TIMEOUT_HTTP_SEG))
            .build()?;
        let actual = cargar_cache(&ruta_cache).or_else(|| {
            ledger
                .lock()
                .ok()
                .and_then(|db| db.ultima_tasa().ok().flatten())
                .map(|t| CacheTasa {
                    valor: t.valor_bs_por_usd,
                    fecha_unix: t.fecha_unix,
                })
        });
        Ok(Self {
            cliente,
            ruta_cache,
            ledger,
            snapshot: RwLock::new(Snapshot {
                actual,
                anterior: None,
                pendiente: None,
            }),
        })
    }

    pub fn info_actual(&self) -> TasaInfo {
        let guardia = self
            .snapshot
            .read()
            .unwrap_or_else(std::sync::PoisonError::into_inner);
        let Some(activa) = guardia.actual.as_ref() else {
            return TasaInfo {
                valor: Decimal::ZERO,
                fecha_unix: 0,
                fluctuacion_pct: None,
                direccion: None,
            };
        };
        let (valor, fecha_unix) = (activa.valor, activa.fecha_unix);
        drop(guardia);

        let fluctuacion_pct = calcular_fluctuacion(valor, self.anterior_conocida());
        let direccion = fluctuacion_pct.map(direccion_desde_fluctuacion);
        TasaInfo {
            valor,
            fecha_unix,
            fluctuacion_pct,
            direccion,
        }
    }

    fn anterior_conocida(&self) -> Option<Decimal> {
        let guardia = self
            .snapshot
            .read()
            .unwrap_or_else(std::sync::PoisonError::into_inner);
        guardia
            .anterior
            .or(guardia.actual.as_ref().map(|a| a.valor))
    }

    pub async fn refrescar(&self) -> Result<TasaInfo, UIError> {
        let valor = scrapear_bcv(&self.cliente).await?;
        let fecha_unix = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_secs() as i64)
            .unwrap_or_default();

        {
            let mut guardia = self
                .snapshot
                .write()
                .unwrap_or_else(std::sync::PoisonError::into_inner);
            guardia.pendiente = Some(CacheTasa { valor, fecha_unix });
        }

        Ok(self.info_actual())
    }

    pub fn tasa_pendiente(&self) -> Option<TasaInfo> {
        let guardia = self
            .snapshot
            .read()
            .unwrap_or_else(std::sync::PoisonError::into_inner);
        guardia.pendiente.as_ref().map(|p| {
            let fluctuacion_pct = calcular_fluctuacion(p.valor, self.anterior_conocida());
            let direccion = fluctuacion_pct.map(direccion_desde_fluctuacion);
            TasaInfo {
                valor: p.valor,
                fecha_unix: p.fecha_unix,
                fluctuacion_pct,
                direccion,
            }
        })
    }

    pub fn aplicar_tasa_pendiente(&self) -> Result<TasaInfo, UIError> {
        let mut guardia = self
            .snapshot
            .write()
            .unwrap_or_else(std::sync::PoisonError::into_inner);
        let Some(pendiente) = guardia.pendiente.take() else {
            return Err(UIError::new(
                "sin tasa pendiente",
                "No hay tasa scrappeada por confirmar",
            ));
        };

        if let Some(db) = self.ledger.lock().ok().as_deref() {
            db.insertar_tasa(EventoTasaBcv {
                valor_bs_por_usd: pendiente.valor,
                fecha_unix: pendiente.fecha_unix,
                fuente: FUENTE.to_string(),
                firma_sha256: String::new(),
            })?;
        }

        guardar_cache(&self.ruta_cache, &pendiente);

        let anterior = guardia.actual.take().map(|a| a.valor);
        guardia.actual = Some(pendiente);
        guardia.anterior = anterior;

        Ok(self.info_actual())
    }

    pub fn establecer_tasa_manual(&self, valor: Decimal) -> Result<TasaInfo, UIError> {
        if valor <= Decimal::ZERO {
            return Err(UIError::new(
                "tasa inválida",
                "La tasa debe ser mayor a cero",
            ));
        }
        let fecha_unix = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_secs() as i64)
            .unwrap_or_default();

        if let Some(db) = self.ledger.lock().ok().as_deref() {
            db.insertar_tasa(EventoTasaBcv {
                valor_bs_por_usd: valor,
                fecha_unix,
                fuente: "MANUAL".to_string(),
                firma_sha256: String::new(),
            })?;
        }

        let cache = CacheTasa { valor, fecha_unix };
        guardar_cache(&self.ruta_cache, &cache);

        let mut guardia = self
            .snapshot
            .write()
            .unwrap_or_else(std::sync::PoisonError::into_inner);
        let anterior = guardia.actual.take().map(|a| a.valor);
        guardia.actual = Some(cache);
        guardia.anterior = anterior;
        guardia.pendiente = None;

        Ok(self.info_actual())
    }
}

pub fn iniciar_refresco(servicio: Arc<ServicioTasa>) {
    tauri::async_runtime::spawn(async move {
        loop {
            let _ = servicio.refrescar().await;
            tokio::time::sleep(Duration::from_secs(INTERVALO_REFRESCHO_SEG)).await;
        }
    });
}

async fn scrapear_bcv(cliente: &reqwest::Client) -> Result<Decimal, UIError> {
    let respuesta = cliente.get(URL_BCV).send().await?.error_for_status()?;
    let html = respuesta.text().await?;
    extraer_valor_usd(&html).ok_or(UIError {
        message: "BCV sin valor USD legible".to_string(),
        diagnosis: "La estructura del portal BCV no expuso el recuadro USD; se conserva la ultima tasa cacheada".to_string(),
    })
}

fn extraer_valor_usd(html: &str) -> Option<Decimal> {
    let documento = Html::parse_document(html);
    let div_sel = SELECTOR_DIV.as_ref()?;
    let span_sel = SELECTOR_SPAN.as_ref()?;
    let strong_sel = SELECTOR_STRONG.as_ref()?;

    for div in documento.select(div_sel) {
        let es_usd = div
            .select(span_sel)
            .any(|s| s.text().collect::<String>().trim() == "USD");
        if !es_usd {
            continue;
        }
        if let Some(strong) = div.select(strong_sel).next() {
            let texto = strong.text().collect::<String>().trim().replace(',', ".");
            if let Ok(valor) = Decimal::from_str(&texto) {
                return Some(valor);
            }
        }
    }
    None
}

fn calcular_fluctuacion(actual: Decimal, anterior: Option<Decimal>) -> Option<Decimal> {
    let previa = anterior.filter(|p| !p.is_zero())?;
    Some(((actual - previa) / previa) * Decimal::from(100))
}

fn direccion_desde_fluctuacion(fluctuacion: Decimal) -> DireccionTasa {
    if fluctuacion > Decimal::ZERO {
        DireccionTasa::Subio
    } else if fluctuacion < Decimal::ZERO {
        DireccionTasa::Bajo
    } else {
        DireccionTasa::Estable
    }
}

fn cargar_cache(ruta: &PathBuf) -> Option<CacheTasa> {
    let crudo = std::fs::read_to_string(ruta).ok()?;
    serde_json::from_str(&crudo).ok()
}

fn guardar_cache(ruta: &PathBuf, cache: &CacheTasa) {
    if let Ok(json) = serde_json::to_string(cache) {
        let _ = std::fs::write(ruta, json);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rust_decimal_macros::dec;

    const HTML_BCV: &str = r#"
        <html><body>
            <div class="recuadrotsmc">
                <span>EUR</span><strong> 100,00000000</strong>
            </div>
            <div class="recuadrotsmc">
                <span>USD</span><strong> 36,92000000</strong>
            </div>
        </body></html>"#;

    #[test]
    fn extrae_valor_usd_y_no_eur() {
        assert_eq!(extraer_valor_usd(HTML_BCV), Some(dec!(36.92)));
    }

    #[test]
    fn html_sin_recuadro_devuelve_none() {
        assert_eq!(extraer_valor_usd("<html><body></body></html>"), None);
    }

    #[test]
    fn fluctuacion_sube_baja_y_cero_divisor() {
        assert_eq!(
            calcular_fluctuacion(dec!(50.00), Some(dec!(40.00))),
            Some(dec!(25.00))
        );
        assert_eq!(
            calcular_fluctuacion(dec!(30.00), Some(dec!(40.00))),
            Some(dec!(-25.00))
        );
        assert_eq!(
            direccion_desde_fluctuacion(dec!(25.00)),
            DireccionTasa::Subio
        );
        assert_eq!(
            direccion_desde_fluctuacion(dec!(-0.50)),
            DireccionTasa::Bajo
        );
        assert_eq!(
            direccion_desde_fluctuacion(Decimal::ZERO),
            DireccionTasa::Estable
        );
        assert_eq!(calcular_fluctuacion(dec!(40.00), Some(Decimal::ZERO)), None);
        assert_eq!(calcular_fluctuacion(dec!(40.00), None), None);
    }

    #[test]
    fn cache_ida_y_vuelta() {
        let ruta = std::env::temp_dir().join(format!("datio_cache_{}.json", std::process::id()));
        let original = CacheTasa {
            valor: dec!(36.92),
            fecha_unix: 1_700_000_001,
        };
        guardar_cache(&ruta, &original);
        let leido = cargar_cache(&ruta);
        let _ = std::fs::remove_file(&ruta);
        assert_eq!(leido.map(|c| c.valor), Some(dec!(36.92)));
    }
}
