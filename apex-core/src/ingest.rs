use crate::models::RawRecord;
use regex::Regex;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::str::FromStr;
use std::sync::LazyLock;

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
            if RE_PRODUCT.as_ref().is_ok_and(|re| re.is_match(h_clean))
                && map.product_id_col.is_none()
            {
                map.product_id_col = Some((h_clean.to_string(), Confidence::High));
            } else if RE_QTY.as_ref().is_ok_and(|re| re.is_match(h_clean)) && map.qty_col.is_none()
            {
                map.qty_col = Some((h_clean.to_string(), Confidence::High));
            } else if RE_PRICE.as_ref().is_ok_and(|re| re.is_match(h_clean))
                && map.price_col.is_none()
            {
                map.price_col = Some((h_clean.to_string(), Confidence::High));
            } else if RE_COST.as_ref().is_ok_and(|re| re.is_match(h_clean))
                && map.cost_col.is_none()
            {
                map.cost_col = Some((h_clean.to_string(), Confidence::High));
            } else if RE_DATE.as_ref().is_ok_and(|re| re.is_match(h_clean))
                && map.date_col.is_none()
            {
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
                    if !RE_NUMERIC.as_ref().is_ok_and(|re| re.is_match(val.trim())) {
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
                } else if !RE_NUMERIC.as_ref().is_ok_and(|re| re.is_match(val.trim())) {
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
            let (col_name, _) = col_opt
                .as_ref()
                .ok_or("Columna no mapeada en el esquema".to_string())?;
            row.get(col_name)
                .ok_or("Valor nulo o ausente en la fila".to_string())
        };

        // Producto ID
        let product_id = get_val(&schema.product_id_col)?.trim().to_string();
        if product_id.is_empty() {
            return Err("Identidad del producto vacía".to_string());
        }

        // Qty
        let qty_str = get_val(&schema.qty_col)?.trim();
        let qty_delta =
            Decimal::from_str(qty_str).map_err(|_| format!("Cantidad no numérica: {}", qty_str))?;

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
            return Ok(Self { values: [0.0; 64] }); // Cero panics: un flujo vacío retorna un tensor vacío
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

        // Firmas MinHash para strings
        const NUM_HASHES: usize = 58;
        let mut min_hashes = [u64::MAX; NUM_HASHES];

        // Registros HyperLogLog para estimación de cardinalidad (64 bins = 6 bits)
        let mut hll_bins = [0_u8; 64];

        for line in &lines {
            let s = String::from_utf8_lossy(line);
            let s = s.trim();
            if s.is_empty() {
                continue;
            }

            // Heurística de tipo (Determinista y agnóstica)
            if let Ok(num) = s.parse::<f64>() {
                num_count += 1;
                sum += num;
                sum_sq += num * num;
            } else if s.contains('-') && s.len() >= 8 && s.len() <= 10 {
                // Heurística simple de fecha
                date_count += 1;
            } else {
                text_count += 1;
            }

            // MinHash determinista
            for (i, hash_val) in min_hashes.iter_mut().enumerate() {
                let seed = (i as u64) ^ 0xA1E5_2026;
                let h = fnv1a_hash(line, seed);
                if h < *hash_val {
                    *hash_val = h;
                }
            }

            // HyperLogLog determinista
            let hll_hash = fnv1a_hash(line, 0x4115_EED5);
            let bin = (hll_hash & 0x3F) as usize; // Lower 6 bits
            let zeros = (hll_hash >> 6).leading_zeros() as u8 + 1;
            if zeros > hll_bins[bin] {
                hll_bins[bin] = zeros;
            }
        }

        let total = lines.len() as f32;

        // 0: num_prob
        values[0] = num_count as f32 / total;
        // 1: text_prob
        values[1] = text_count as f32 / total;
        // 2: date_prob
        values[2] = date_count as f32 / total;

        // 3: mean
        let mean = if num_count > 0 {
            sum / (num_count as f64)
        } else {
            0.0
        };
        values[3] = mean as f32;

        // 4: variance
        let var = if num_count > 0 {
            (sum_sq / (num_count as f64)) - (mean * mean)
        } else {
            0.0
        };
        values[4] = var as f32;

        // 5: HLL estimate
        let mut harmonic_mean = 0.0_f64;
        for &v in &hll_bins {
            harmonic_mean += 2.0_f64.powi(-(v as i32));
        }
        let alpha_m = 0.709;
        let m = 64.0;
        let estimate = alpha_m * m * m / harmonic_mean;
        values[5] = estimate as f32;

        // 6..64: MinHash normalizado
        for (i, &hash_val) in min_hashes.iter().enumerate() {
            // Transformamos el hash u64 en un espacio continuo 0.0 - 1.0 determinísticamente
            values[6 + i] = (hash_val as f64 / u64::MAX as f64) as f32;
        }

        Ok(Self { values })
    }
}

/// Función pura de Hashing determinista (FNV-1a adaptado)
#[inline]
fn fnv1a_hash(bytes: &[u8], seed: u64) -> u64 {
    let mut hash = seed ^ 0xcbf29ce484222325;
    for &b in bytes {
        hash ^= b as u64;
        hash = hash.wrapping_mul(0x100000001b3);
    }
    hash
}

/// Locality-Sensitive Hashing (LSH) usando la Proyección Tensor de 16 dimensiones
/// Retorna un u16 binario. Similitud de features implica proximidad binaria.
pub fn compute_lsh(tensor: &crate::tensor::ProjectionTensor) -> u16 {
    let mut hash = 0_u16;
    for (i, &val) in tensor.values.iter().enumerate() {
        if val > 0.0 {
            hash |= 1 << i;
        }
    }
    hash
}

/// Función central de ingesta: `ingest_column` pura, determinista y sin panics
/// Mapea de un dataset binario a un hash de localidad (LSH) de 16 bits.
pub fn ingest_column(data: &[u8]) -> Result<u16, IngestError> {
    let features = SensorFeatures::extract(data)?;
    let tensor = crate::tensor::project(&features);
    let lsh = compute_lsh(&tensor);
    Ok(lsh)
}
