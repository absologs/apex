use crate::models::RawRecord;
use crate::models::{GLEntry, PaymentEntry, PurchaseOrder, SalesInvoice, StockLedgerEntry};
use chrono::NaiveDate;
use rust_decimal::Decimal;

/// Adaptador determinista para transmutar la lógica de Frappe/ERPNext hacia el oráculo de Apex.
pub struct ERPNextAdapter;

impl ERPNextAdapter {
    /// FASE 1: Transmutación del Núcleo Logístico (`stock_ledger_entry.py` y `item.py`)
    /// Extrae la lógica de inmutabilidad del inventario. ERPNext valida dimensiones de stock negativo
    /// en Python (`validate_inventory_dimension_negative_stock`); aquí lo convertimos a deltas absolutos
    /// para el Event Sourcing de Apex.
    pub fn transmute_stock_ledger_entry(sle: &StockLedgerEntry) -> RawRecord {
        // Concatenación de fecha y hora que Frappe almacena por separado
        let time_str = format!("{} {}", sle.posting_date, sle.posting_time);
        let timestamp = match chrono::NaiveDateTime::parse_from_str(&time_str, "%Y-%m-%d %H:%M:%S")
        {
            Ok(dt) => dt.and_utc().timestamp(),
            Err(_) => 0,
        };

        RawRecord {
            tx_id: sle.id.clone(),
            product_id: sle.item_code.clone(),
            qty_delta: sle.actual_qty,
            cost_usd: sle.valuation_rate,
            price_usd: sle.valuation_rate,
            tx_timestamp_sec: timestamp,
            client_id: None,
        }
    }

    /// FASE 2: Extracción Lógica de Cadena de Suministro (`purchase_order.py` y `supplier.py`)
    /// En `purchase_order.py`, Frappe calcula el Lead Time implícito vía `transaction_date` vs `schedule_date`.
    /// Extraemos esto aritméticamente para predecir inflación de reposición en Apex.
    pub fn extract_lead_time_days(po: &PurchaseOrder) -> i64 {
        let default_date = NaiveDate::from_ymd_opt(1970, 1, 1).unwrap_or_default();
        let t_date =
            NaiveDate::parse_from_str(&po.transaction_date, "%Y-%m-%d").unwrap_or(default_date);
        let s_date = NaiveDate::parse_from_str(&po.schedule_date, "%Y-%m-%d").unwrap_or(t_date);

        let delta = s_date.signed_duration_since(t_date);
        let days = delta.num_days();

        if days < 0 { 0 } else { days }
    }

    /// FASE 3: Identidad y Demanda (`customer.py` y `sales_invoice.py`)
    /// Extrae al Cliente (Customer) e inicializa su proyección al Espacio Métrico R^5.
    /// Ignora los datos de contacto burocráticos de `customer.py` y toma solo variables duras.
    pub fn project_customer_to_r5(total_purchases: Decimal, max_discount: Decimal) -> [Decimal; 5] {
        let v1_inercia = total_purchases / Decimal::new(1000, 0); // Proxy de volumen extraído de `get_customer_outstanding`
        let v2_elasticidad = max_discount; // Sensibilidad al precio
        let v3_densidad = Decimal::ONE;
        let v4_friccion = Decimal::ZERO;
        let v5_gravedad = Decimal::ONE;

        [
            v1_inercia,
            v2_elasticidad,
            v3_densidad,
            v4_friccion,
            v5_gravedad,
        ]
    }

    /// Extracción lógica de `sales_invoice.py`: Determinación de Rentabilidad Unitaria Neta.
    /// Simula el método `make_gl_entries()` destruyendo la necesidad de contabilidad de doble partida,
    /// aplanando el Grand Total sobre la cantidad para el vector.
    pub fn flatten_sales_invoice_margin(si: &SalesInvoice, total_qty: Decimal) -> Decimal {
        if total_qty > Decimal::ZERO {
            si.base_grand_total / total_qty
        } else {
            Decimal::ZERO
        }
    }

    /// FASE 4: Extracción Matemática del Libro Mayor (`gl_entry.py` y `payment_entry.py`)
    /// Mapea la contabilidad tradicional y extrae los impuestos (Taxes)
    /// no como entidades fiscales legales (`gl_entry.py` on_update), sino como un multiplicador.
    pub fn extract_tax_multiplier_from_gl(gl: &GLEntry) -> Decimal {
        if gl.credit > Decimal::ZERO {
            // Asume que si es una cuenta de impuesto (ej. IVA retenido en PaymentEntry),
            // el multiplicador influye sobre el valor original.
            (gl.credit / Decimal::new(100, 0)) * Decimal::new(16, 2)
        } else {
            Decimal::ONE
        }
    }

    /// Simulador de `allocate_amount_to_references` de `payment_entry.py`
    /// Convierte el pago parcial en un escalar de confianza (0.0 a 1.0) para el `Logistics Reliability Score`
    pub fn extract_payment_reliability(
        pe: &PaymentEntry,
        total_invoice_amount: Decimal,
    ) -> Decimal {
        let base_paid = pe.base_paid_amount;
        let total = if total_invoice_amount > Decimal::ZERO {
            total_invoice_amount
        } else {
            Decimal::ONE
        };

        if total > Decimal::ZERO {
            let ratio = base_paid / total;
            if ratio > Decimal::ONE {
                Decimal::ONE
            } else {
                ratio
            }
        } else {
            Decimal::ZERO
        }
    }
}
