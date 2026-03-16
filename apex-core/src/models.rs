use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

// FASE 5: Soporte y Metadatos (setup y controllers)
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum DocumentStatus {
    Draft,
    Submitted,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Company {
    #[serde(rename = "name")]
    pub id: String,
    pub company_name: String,
    pub default_currency: String,
}

// FASE 1: El Núcleo Logístico (stock)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Warehouse {
    #[serde(rename = "name")]
    pub id: String,
    pub warehouse_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Item {
    #[serde(rename = "name")]
    pub id: String,
    pub item_code: String,
    pub item_name: String,
    pub item_group: String,
    pub valuation_rate: Decimal,
    #[serde(default)]
    pub features: [Decimal; 5], // R^5 vectorization
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StockLedgerEntry {
    #[serde(rename = "name")]
    pub id: String,
    pub item_code: String,
    pub warehouse: String,
    pub actual_qty: Decimal,
    pub valuation_rate: Decimal,
    pub batch_no: Option<String>,
    pub posting_date: String,
    pub posting_time: String,
}

// FASE 2: La Cadena de Suministro (buying)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Supplier {
    #[serde(rename = "name")]
    pub id: String,
    pub supplier_name: String,
    pub supplier_primary_contact: Option<String>,
    #[serde(default)]
    pub logistics_reliability_score: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PurchaseOrder {
    #[serde(rename = "name")]
    pub id: String,
    pub supplier: String,
    pub transaction_date: String,
    pub schedule_date: String,
    pub base_grand_total: Decimal,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PurchaseOrderItem {
    #[serde(rename = "name")]
    pub id: String,
    pub parent: String,
    pub item_code: String,
    pub qty: Decimal,
    pub rate: Decimal,
    pub base_amount: Decimal,
}

// FASE 3: Identidad y Demanda (crm y selling)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Customer {
    #[serde(rename = "name")]
    pub id: String,
    pub customer_name: String,
    pub customer_primary_contact: Option<String>,
    #[serde(default)]
    pub features: [Decimal; 5], // R^5 vectorization (Afinidad)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SalesInvoice {
    #[serde(rename = "name")]
    pub id: String,
    pub customer: String,
    pub posting_date: String,
    pub base_grand_total: Decimal,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SalesInvoiceItem {
    #[serde(rename = "name")]
    pub id: String,
    pub parent: String,
    pub item_code: String,
    pub qty: Decimal,
    pub rate: Decimal,
    pub base_amount: Decimal,
}

// FASE 4: Liquidez y Flujo de Caja (accounts)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GLEntry {
    #[serde(rename = "name")]
    pub id: String,
    pub account: String,
    pub party_type: Option<String>,
    pub party: Option<String>,
    pub debit: Decimal,
    pub credit: Decimal,
    pub posting_date: String,
    pub voucher_type: String,
    pub voucher_no: String,
    #[serde(default)]
    pub tax_multiplier: Decimal, // Extracted tax multiplier
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentEntry {
    #[serde(rename = "name")]
    pub id: String,
    pub party_type: String, // "Customer" or "Supplier"
    pub party: String,
    pub base_paid_amount: Decimal,
    pub base_received_amount: Decimal,
    pub posting_date: String,
}

/// Estructura de ingesta recibida o transmutada para el Ledger
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RawRecord {
    pub tx_id: String,
    pub product_id: String,
    pub qty_delta: Decimal, // Positivo (ingreso) o Negativo (salida)
    pub cost_usd: Decimal,
    pub price_usd: Decimal,
    pub tx_timestamp_sec: i64,
    pub client_id: Option<String>, // Vector de Identidad
}
