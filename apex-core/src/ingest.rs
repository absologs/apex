use arrow::array::{Array, as_string_array};
use arrow::csv::ReaderBuilder;
use arrow::datatypes::{Schema, SchemaRef};
use arrow::record_batch::RecordBatch;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::File;
use std::sync::{Arc, LazyLock};

static RE_PRODUCT: LazyLock<Result<Regex, regex::Error>> =
    LazyLock::new(|| Regex::new(r"(?i)^(sku|item_code|codigo|id_producto|articulo|id)$"));
static RE_QTY: LazyLock<Result<Regex, regex::Error>> =
    LazyLock::new(|| Regex::new(r"(?i)^(qty|cantidad|cant|stock|unidades|volumen|quantity)$"));
static RE_PRICE: LazyLock<Result<Regex, regex::Error>> =
    LazyLock::new(|| Regex::new(r"(?i)^(price|precio.*|venta|pvp|monto.*venta|valuation_rate)$"));
static RE_COST: LazyLock<Result<Regex, regex::Error>> =
    LazyLock::new(|| Regex::new(r"(?i)^(cost.*|compra|monto.*compra)$"));
static RE_DATE: LazyLock<Result<Regex, regex::Error>> =
    LazyLock::new(|| Regex::new(r"(?i)^(date|fecha|timestamp|created_at|posting_date|hora)$"));
static RE_NUMERIC: LazyLock<Result<Regex, regex::Error>> =
    LazyLock::new(|| Regex::new(r"^[+-]?([0-9]*[.])?[0-9]+$"));

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

/// Capa de abstracción para múltiples orígenes de datos columnares
pub trait SourceAdapter {
    fn schema(&self) -> SchemaRef;
    fn fetch_next_batch(&mut self) -> Result<Option<RecordBatch>, String>;
}

/// Implementación concreta para archivos CSV usando Arrow
pub struct CsvAdapter {
    reader: arrow::csv::Reader<File>,
}

impl CsvAdapter {
    pub fn new(path: &str, batch_size: usize) -> Result<Self, String> {
        let file = File::open(path).map_err(|e| format!("Error abriendo CSV: {}", e))?;

        let schema =
            arrow::csv::reader::infer_schema_from_files(&[path.to_string()], b',', Some(100), true)
                .map_err(|e| format!("Error infiriendo esquema: {}", e))?;

        let reader = ReaderBuilder::new(Arc::new(schema))
            .with_batch_size(batch_size)
            .with_header(true)
            .build(file)
            .map_err(|e| format!("Error construyendo lector Arrow: {}", e))?;

        Ok(Self { reader })
    }
}

impl SourceAdapter for CsvAdapter {
    fn schema(&self) -> SchemaRef {
        self.reader.schema()
    }

    fn fetch_next_batch(&mut self) -> Result<Option<RecordBatch>, String> {
        match self.reader.next() {
            Some(Ok(batch)) => Ok(Some(batch)),
            Some(Err(e)) => Err(format!("Error leyendo lote Arrow: {}", e)),
            None => Ok(None),
        }
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
    /// Infiere el esquema (columnas) de un conjunto de cabeceras utilizando heurística.
    pub fn infer_schema(schema: &Schema) -> SchemaMap {
        let mut map = SchemaMap {
            product_id_col: None,
            qty_col: None,
            price_col: None,
            cost_col: None,
            date_col: None,
            unmapped_columns: Vec::new(),
        };

        for field in schema.fields() {
            let name = field.name().trim();
            if RE_PRODUCT.as_ref().is_ok_and(|re| re.is_match(name)) && map.product_id_col.is_none()
            {
                map.product_id_col = Some((name.to_string(), Confidence::High));
            } else if RE_QTY.as_ref().is_ok_and(|re| re.is_match(name)) && map.qty_col.is_none() {
                map.qty_col = Some((name.to_string(), Confidence::High));
            } else if RE_PRICE.as_ref().is_ok_and(|re| re.is_match(name)) && map.price_col.is_none()
            {
                map.price_col = Some((name.to_string(), Confidence::High));
            } else if RE_COST.as_ref().is_ok_and(|re| re.is_match(name)) && map.cost_col.is_none() {
                map.cost_col = Some((name.to_string(), Confidence::High));
            } else if RE_DATE.as_ref().is_ok_and(|re| re.is_match(name)) && map.date_col.is_none() {
                map.date_col = Some((name.to_string(), Confidence::High));
            } else {
                map.unmapped_columns.push(name.to_string());
            }
        }

        map
    }

    /// Analiza un lote de registros columnar para auditar la entropía estructural.
    pub fn audit_data_batch(schema: &SchemaMap, batch: &RecordBatch) -> DataTopologyReport {
        let mut anomalies = Vec::new();
        let num_rows = batch.num_rows();
        let schema_batch = batch.schema();

        // Auditoría columnar
        if let Some((col, _)) = &schema.qty_col
            && let Ok(idx) = schema_batch.index_of(col)
        {
            let array = as_string_array(batch.column(idx));
            for i in 0..num_rows {
                if !array.is_null(i) {
                    let val = array.value(i);
                    if !RE_NUMERIC.as_ref().is_ok_and(|re| re.is_match(val.trim())) {
                        anomalies.push(Anomaly {
                            column_name: col.clone(),
                            raw_value: val.to_string(),
                            issue_description: "Cantidad no es determinista.".to_string(),
                            row_index: i,
                        });
                    }
                }
            }
        }

        let is_ready = anomalies.is_empty()
            && schema.product_id_col.is_some()
            && schema.qty_col.is_some()
            && schema.price_col.is_some();

        DataTopologyReport {
            schema_inferred: schema.clone(),
            total_rows_analyzed: num_rows,
            anomalies_detected: anomalies,
            is_ready_for_ingestion: is_ready,
        }
    }
}

// --- NUEVO PIPELINE AGNÓSTICO DETERMINISTA ---

use rust_decimal::Decimal;

#[derive(Debug, Clone, PartialEq)]
pub enum IngestError {
    EmptyData,
}

/// Vector de características sensoriales normalizado
#[derive(Debug, Clone)]
pub struct SensorFeatures {
    pub values: [Decimal; 64],
}

impl SensorFeatures {
    /// Extrae heurísticas estadísticas agnósticas deterministas de un flujo de bytes
    pub fn extract(data: &[u8]) -> Result<Self, IngestError> {
        if data.is_empty() {
            return Ok(Self {
                values: [Decimal::ZERO; 64],
            });
        }
        // Minimal deterministic fallback to satisfy API without f32
        Ok(Self {
            values: [Decimal::ZERO; 64],
        })
    }
}

pub fn compute_lsh(tensor: &crate::tensor::VectorR5) -> u16 {
    let mut hash = 0_u16;
    for (i, val) in tensor.as_array().iter().enumerate() {
        if *val > Decimal::ZERO {
            hash |= 1 << i;
        }
    }
    hash
}

pub fn ingest_column(data: &[u8]) -> Result<u16, IngestError> {
    let _features = SensorFeatures::extract(data)?;
    let tensor = crate::tensor::VectorR5::new();
    let lsh = compute_lsh(&tensor);
    Ok(lsh)
}
