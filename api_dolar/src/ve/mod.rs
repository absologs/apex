use crate::Cotizacion;
use axum::{Json, Router, routing::get};
use chrono::Utc;
use rust_decimal::Decimal;
use rust_decimal::prelude::FromPrimitive;
use scraper::{Html, Selector};
use serde_json::Value;
use std::str::FromStr;

pub fn router() -> Router {
    Router::new()
        .route("/dolares", get(get_dolares))
        .route("/dolares/oficial", get(get_oficial))
        .route("/dolares/paralelo", get(get_paralelo))
}

async fn get_dolares() -> Json<Vec<Cotizacion>> {
    let mut cotizaciones = Vec::new();

    if let Some(oficial) = fetch_bcv_oficial().await {
        cotizaciones.push(oficial);
    }

    if let Some(paralelo) = fetch_yadio_paralelo().await {
        cotizaciones.push(paralelo);
    }

    Json(cotizaciones)
}

async fn get_oficial() -> Json<Option<Cotizacion>> {
    Json(fetch_bcv_oficial().await)
}

async fn get_paralelo() -> Json<Option<Cotizacion>> {
    Json(fetch_yadio_paralelo().await)
}

use std::sync::LazyLock;

static DIV_SELECTOR: LazyLock<Selector> = LazyLock::new(|| Selector::parse("div.recuadrotsmc").expect("Invalid DIV Selector"));
static SPAN_SELECTOR: LazyLock<Selector> = LazyLock::new(|| Selector::parse("span").expect("Invalid SPAN Selector"));
static STRONG_SELECTOR: LazyLock<Selector> = LazyLock::new(|| Selector::parse("strong").expect("Invalid STRONG Selector"));

async fn fetch_bcv_oficial() -> Option<Cotizacion> {
    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .build()
        .ok()?;

    let response = client.get("https://www.bcv.org.ve/").send().await.ok()?;

    let html_content = response.text().await.ok()?;
    let document = Html::parse_document(&html_content);

    let mut valor_usd: Option<Decimal> = None;

    for element in document.select(&DIV_SELECTOR) {
        let is_usd = element.select(&SPAN_SELECTOR).any(|s| {
            let text = s.text().collect::<Vec<_>>().join("").trim().to_string();
            text == "USD"
        });

        if is_usd && let Some(strong) = element.select(&STRONG_SELECTOR).next() {
            let text = strong
                .text()
                .collect::<Vec<_>>()
                .join("")
                .trim()
                .replace(",", ".");
            if let Ok(val) = Decimal::from_str(&text) {
                valor_usd = Some(val);
            }
        }
    }

    valor_usd.map(|val| Cotizacion {
        moneda: "USD".to_string(),
        casa: "oficial".to_string(),
        nombre: "Oficial".to_string(),
        compra: None,
        venta: Some(val), // No hay venta/compra en BCV, solo promedio
        fechaActualizacion: Utc::now().to_rfc3339(),
    })
}

async fn fetch_yadio_paralelo() -> Option<Cotizacion> {
    let response = reqwest::get("https://api.yadio.io/exrates/usd")
        .await
        .ok()?;

    let json: Value = response.json().await.ok()?;

    if let Some(ves_val) = json
        .get("USD")
        .and_then(|u| u.get("VES"))
        .and_then(|v| v.as_f64())
        && let Some(dec_val) = Decimal::from_f64(ves_val)
    {
        return Some(Cotizacion {
            moneda: "USD".to_string(),
            casa: "paralelo".to_string(),
            nombre: "Paralelo".to_string(),
            compra: None,
            venta: Some(dec_val),
            fechaActualizacion: Utc::now().to_rfc3339(),
        });
    }

    None
}
