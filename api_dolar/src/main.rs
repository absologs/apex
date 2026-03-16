use axum::{Json, Router, routing::get};
use chrono::Utc;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

mod ve;

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Cotizacion {
    pub moneda: String,
    pub casa: String,
    pub nombre: String,
    pub compra: Option<Decimal>,
    pub venta: Option<Decimal>,
    pub fechaActualizacion: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/v1/estado", get(estado))
        .nest("/v1/ve", ve::router());

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    tracing::info!("Dolar API (Rust) listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;
    
    Ok(())
}

async fn estado() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "estado": "Disponible",
        "timestamp": Utc::now().to_rfc3339()
    }))
}
