use crate::models::RawRecord;
use regex::Regex;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::str::FromStr;
use std::sync::LazyLock;

static RE_PRODUCT: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?i)^(sku|item_code|codigo|id_producto|articulo|id)$").expect("Regex de SKU inválida"));
static RE_QTY: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?i)^(qty|cantidad|cant|stock|unidades|volumen|quantity)$").expect("Regex de Qty inválida")
});
static RE_PRICE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?i)^(price|precio.*|venta|pvp|monto.*venta|valuation_rate)$").expect("Regex de Precio inválida")
});
static RE_COST: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?i)^(cost.*|compra|monto.*compra)$").expect("Regex de Costo inválida"));
static RE_DATE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?i)^(date|fecha|timestamp|created_at|posting_date|hora)$").expect("Regex de Fecha inválida")
});
static RE_NUMERIC: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^[+-]?([0-9]*[.])?[0-9]+$").expect("Regex Numérica inválida"));

/// Nivel de confianza de la heurística.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Confidence {
    High,
    Medium,
    Low,
    ManualInterventionRequired,
}

/// Identificación de un Campo sucio o ambiguo detectado por el Oráculo de Ingesta.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Anomaly {
    pub column_name: String,
    pub raw_value: String,
    pub issue_description: String,
    pub row_index: usize,
}

/// Mapa de Columnas Inferidas y su nivel de confianza
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SchemaMap {
    pub product_id_col: Option<(String, Confidence)>,
    pub qty_col: Option<(String, Confidence)>,
    pub price_col: Option<(String, Confidence)>,
    pub cost_col: Option<(String, Confidence)>,
    pub date_col: Option<(String, Confidence)>,

    // Columnas extrañas que el usuario debe decidir qué hacer con ellas
    pub unmapped_columns: Vec<String>,
}

/// Configuración del Agente Centinela para ingesta continua
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SentinelConfig {
    pub source_path: String,
    pub source_type: String, // ej. "CSV", "SQL"
    pub schema: SchemaMap,
}

/// El resultado del análisis topológico de los datos crudos.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DataTopologyReport {
    pub schema_inferred: SchemaMap,
    pub total_rows_analyzed: usize,
    pub anomalies_detected: Vec<Anomaly>,
    pub is_ready_for_ingestion: bool, // Solo true si anomalies = 0 y SchemaMap es High en todo.
}

/// Capa de abstracción para múltiples orígenes de datos (CSV, SQL, JSON)
pub trait SourceAdapter {
    fn fetch_headers(&mut self) -> Result<Vec<String>, String>;
    fn fetch_chunk(&mut self, chunk_size: usize) -> Result<Vec<HashMap<String, String>>, String>;
}

/// Implementación concreta para archivos CSV
pub struct CsvAdapter {
    reader: csv::Reader<std::fs::File>,
    headers: Vec<String>,
}

impl CsvAdapter {
    pub fn new(path: &str) -> Result<Self, String> {
        let mut reader = csv::ReaderBuilder::new()
            .has_headers(true)
            .from_path(path)
            .map_err(|e| format!("Error abriendo CSV: {}", e))?;

        let headers_record = reader
            .headers()
            .map_err(|e| format!("Error leyendo cabeceras: {}", e))?;

        let headers: Vec<String> = headers_record.iter().map(|s| s.to_string()).collect();

        Ok(Self { reader, headers })
    }
}

impl SourceAdapter for CsvAdapter {
    fn fetch_headers(&mut self) -> Result<Vec<String>, String> {
        Ok(self.headers.clone())
    }

    fn fetch_chunk(&mut self, chunk_size: usize) -> Result<Vec<HashMap<String, String>>, String> {
        let mut chunk = Vec::with_capacity(chunk_size);
        let mut count = 0;

        // Iteramos manualmente usando la API core de csv
        for result in self.reader.records() {
            let record = result.map_err(|e| format!("Error parseando fila CSV: {}", e))?;
            let mut row_map = HashMap::new();

            for (i, h) in self.headers.iter().enumerate() {
                if let Some(val) = record.get(i) {
                    row_map.insert(h.clone(), val.to_string());
                }
            }

            chunk.push(row_map);
            count += 1;
            if count >= chunk_size {
                break;
            }
        }

        Ok(chunk)
    }
}

/// Entidad en la Cola de Cuarentena (Dead Letter Queue)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeadLetter {
    pub raw_data: HashMap<String, String>,
    pub reason: String,
}

pub struct UniversalIngester;

impl UniversalIngester {
    /// Infiere el esquema (columnas) de un conjunto de cabeceras (headers) utilizando heurística.
    pub fn infer_schema(headers: &[String]) -> SchemaMap {
        let mut map = SchemaMap {
            product_id_col: None,
            qty_col: None,
            price_col: None,
            cost_col: None,
            date_col: None,
            unmapped_columns: Vec::new(),
        };

        for h in headers {
            let h_clean = h.trim();
            if RE_PRODUCT.is_match(h_clean) && map.product_id_col.is_none() {
                map.product_id_col = Some((h_clean.to_string(), Confidence::High));
            } else if RE_QTY.is_match(h_clean) && map.qty_col.is_none() {
                map.qty_col = Some((h_clean.to_string(), Confidence::High));
            } else if RE_PRICE.is_match(h_clean) && map.price_col.is_none() {
                map.price_col = Some((h_clean.to_string(), Confidence::High));
            } else if RE_COST.is_match(h_clean) && map.cost_col.is_none() {
                map.cost_col = Some((h_clean.to_string(), Confidence::High));
            } else if RE_DATE.is_match(h_clean) && map.date_col.is_none() {
                map.date_col = Some((h_clean.to_string(), Confidence::High));
            } else {
                map.unmapped_columns.push(h_clean.to_string());
            }
        }

        map
    }

    /// Analiza un lote de registros (diccionarios Key-Value) para auditar la entropía estructural.
    /// NO limpia la basura, solo señala DÓNDE ESTÁ para intervención manual.
    pub fn audit_data_batch(
        schema: &SchemaMap,
        records: &[HashMap<String, String>],
    ) -> DataTopologyReport {
        let mut anomalies = Vec::new();

        for (i, row) in records.iter().enumerate() {
            // Validar Qty
            if let Some((col, _)) = &schema.qty_col {
                if let Some(val) = row.get(col) {
                    if !RE_NUMERIC.is_match(val.trim()) {
                        anomalies.push(Anomaly {
                            column_name: col.clone(),
                            raw_value: val.clone(),
                            issue_description: "Cantidad no es determinista.".to_string(),
                            row_index: i,
                        });
                    }
                } else {
                    anomalies.push(Anomaly {
                        column_name: col.clone(),
                        raw_value: "NULL".to_string(),
                        issue_description: "Valor ausente en columna crítica.".to_string(),
                        row_index: i,
                    });
                }
            }

            // Validar Precio
            if let Some((col, _)) = &schema.price_col
                && let Some(val) = row.get(col)
            {
                if val.contains('$') || val.contains('B') || val.contains(',') {
                    anomalies.push(Anomaly {
                        column_name: col.clone(),
                        raw_value: val.clone(),
                        issue_description: "Precio contaminado con formato local.".to_string(),
                        row_index: i,
                    });
                } else if !RE_NUMERIC.is_match(val.trim()) {
                    anomalies.push(Anomaly {
                        column_name: col.clone(),
                        raw_value: val.clone(),
                        issue_description: "Precio no es un número puro.".to_string(),
                        row_index: i,
                    });
                }
            }

            // Validar Producto ID
            if let Some((col, _)) = &schema.product_id_col {
                if let Some(val) = row.get(col) {
                    if val.trim().is_empty() {
                        anomalies.push(Anomaly {
                            column_name: col.clone(),
                            raw_value: val.clone(),
                            issue_description: "Identidad del producto (SKU) vacía.".to_string(),
                            row_index: i,
                        });
                    }
                } else {
                    anomalies.push(Anomaly {
                        column_name: col.clone(),
                        raw_value: "NULL".to_string(),
                        issue_description: "Identidad del producto ausente.".to_string(),
                        row_index: i,
                    });
                }
            }
        }

        let is_ready = anomalies.is_empty()
            && schema.product_id_col.is_some()
            && schema.qty_col.is_some()
            && schema.price_col.is_some();

        DataTopologyReport {
            schema_inferred: schema.clone(),
            total_rows_analyzed: records.len(),
            anomalies_detected: anomalies,
            is_ready_for_ingestion: is_ready,
        }
    }

    /// Transmuta los registros crudos hacia la base R^5 y aísla los corruptos en la DLQ.
    pub fn process_stream<A: SourceAdapter>(
        adapter: &mut A,
        schema: &SchemaMap,
        chunk_size: usize,
    ) -> Result<(Vec<RawRecord>, Vec<DeadLetter>), String> {
        let mut valid_records = Vec::new();
        let mut dlq = Vec::new();

        loop {
            let chunk = adapter.fetch_chunk(chunk_size)?;
            if chunk.is_empty() {
                break; // Fin del stream
            }

            for row in chunk {
                match Self::transmute_row(&row, schema) {
                    Ok(record) => valid_records.push(record),
                    Err(reason) => dlq.push(DeadLetter {
                        raw_data: row,
                        reason,
                    }),
                }
            }
        }

        Ok((valid_records, dlq))
    }

    fn transmute_row(
        row: &HashMap<String, String>,
        schema: &SchemaMap,
    ) -> Result<RawRecord, String> {
        let get_val = |col_opt: &Option<(String, Confidence)>| -> Result<&String, String> {
            let (col_name, _) = col_opt.as_ref().ok_or("Columna no mapeada en el esquema".to_string())?;
            row.get(col_name).ok_or("Valor nulo o ausente en la fila".to_string())
        };

        // Producto ID
        let product_id = get_val(&schema.product_id_col)?.trim().to_string();
        if product_id.is_empty() {
            return Err("Identidad del producto vacía".to_string());
        }

        // Qty
        let qty_str = get_val(&schema.qty_col)?.trim();
        let qty_delta = Decimal::from_str(qty_str)
            .map_err(|_| format!("Cantidad no numérica: {}", qty_str))?;

        // Precio
        let price_str = get_val(&schema.price_col)?.trim();
        let price_usd = Decimal::from_str(price_str).unwrap_or(Decimal::ZERO); // Fallback en precio si hay cost

        // Costo (opcional para ingesta inicial)
        let cost_usd = if let Some(cost_col) = &schema.cost_col {
            if let Some(val) = row.get(&cost_col.0) {
                Decimal::from_str(val.trim()).unwrap_or(Decimal::ZERO)
            } else {
                Decimal::ZERO
            }
        } else {
            Decimal::ZERO
        };

        // Date (opcional, fallback a timestamp actual)
        let ts = if let Some(_date_col) = &schema.date_col {
            // Un parser real aquí es ideal, pero fallback al actual
            chrono::Utc::now().timestamp()
        } else {
            chrono::Utc::now().timestamp()
        };

        let tx_id = format!("tx_{}_{}", uuid::Uuid::new_v4(), ts);

        Ok(RawRecord {
            tx_id,
            product_id,
            qty_delta,
            cost_usd,
            price_usd,
            tx_timestamp_sec: ts,
            client_id: None,
        })
    }
}
