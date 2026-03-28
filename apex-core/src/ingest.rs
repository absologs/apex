use arrow::array::{Array, as_string_array};
use arrow::csv::ReaderBuilder;
use arrow::datatypes::{Schema, SchemaRef};
use arrow::record_batch::RecordBatch;
use regex::Regex;
use serde::{Deserialize, Serialize};
use siphasher::sip::SipHasher13;
use std::collections::HashMap;
use std::fs::File;
use std::hash::Hasher;
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

#[derive(Debug, Clone, PartialEq)]
pub enum IngestError {
    EmptyData,
}

/// Vector de características sensoriales normalizado de 64 dimensiones
#[derive(Debug, Clone)]
pub struct SensorFeatures {
    pub values: [f32; 64],
}

impl SensorFeatures {
    /// Extrae heurísticas estadísticas agnósticas deterministas de un flujo de bytes
    pub fn extract(data: &[u8]) -> Result<Self, IngestError> {
        if data.is_empty() {
            return Ok(Self { values: [0.0; 64] });
        }

        let mut values = [0.0; 64];

        let lines: Vec<&[u8]> = data
            .split(|&b| b == b'\n')
            .filter(|l| !l.is_empty())
            .collect();
        if lines.is_empty() {
            return Ok(Self { values });
        }

        let mut num_count = 0;
        let mut text_count = 0;
        let mut date_count = 0;
        let mut sum = 0.0_f64;
        let mut sum_sq = 0.0_f64;

        const NUM_HASHES: usize = 58;
        let mut min_hashes = [u64::MAX; NUM_HASHES];
        let mut hll_bins = [0_u8; 64];

        for line in &lines {
            let s = String::from_utf8_lossy(line);
            let s = s.trim();
            if s.is_empty() {
                continue;
            }

            if let Ok(num) = s.parse::<f64>() {
                num_count += 1;
                sum += num;
                sum_sq += num * num;
            } else if s.contains('-') && s.len() >= 8 && s.len() <= 10 {
                date_count += 1;
            } else {
                text_count += 1;
            }

            for (i, hash_val) in min_hashes.iter_mut().enumerate() {
                let mut hasher = SipHasher13::new_with_keys(i as u64, 0xA1E5_2026);
                hasher.write(line);
                let h = hasher.finish();
                if h < *hash_val {
                    *hash_val = h;
                }
            }

            let mut hasher = SipHasher13::new_with_keys(0x4115_EED5, 0x4115_EED5);
            hasher.write(line);
            let hll_hash = hasher.finish();
            let bin = (hll_hash & 0x3F) as usize;
            let zeros = (hll_hash >> 6).leading_zeros() as u8 + 1;
            if zeros > hll_bins[bin] {
                hll_bins[bin] = zeros;
            }
        }

        let total = lines.len() as f32;
        values[0] = num_count as f32 / total;
        values[1] = text_count as f32 / total;
        values[2] = date_count as f32 / total;

        let mean = if num_count > 0 {
            sum / (num_count as f64)
        } else {
            0.0
        };
        values[3] = mean as f32;

        let var = if num_count > 0 {
            (sum_sq / (num_count as f64)) - (mean * mean)
        } else {
            0.0
        };
        values[4] = var as f32;

        let mut harmonic_mean = 0.0_f64;
        for &v in &hll_bins {
            harmonic_mean += 2.0_f64.powi(-(v as i32));
        }
        let alpha_m = 0.709;
        let m = 64.0;
        let estimate = alpha_m * m * m / harmonic_mean;
        values[5] = estimate as f32;

        for (i, &hash_val) in min_hashes.iter().enumerate() {
            values[6 + i] = (hash_val as f64 / u64::MAX as f64) as f32;
        }

        Ok(Self { values })
    }
}

pub fn compute_lsh(tensor: &crate::tensor::ProjectionTensor) -> u16 {
    let mut hash = 0_u16;
    for (i, &val) in tensor.values.iter().enumerate() {
        if val > 0.0 {
            hash |= 1 << i;
        }
    }
    hash
}

pub fn ingest_column(data: &[u8]) -> Result<u16, IngestError> {
    let features = SensorFeatures::extract(data)?;
    let tensor = crate::tensor::project(&features);
    let lsh = compute_lsh(&tensor);
    Ok(lsh)
}
