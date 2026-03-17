use crate::models::RawRecord;
use crate::tensor::LotTensor;
use rusqlite::Connection;
use rust_decimal::Decimal;
use sled::Db;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

/// Ledger Inmutable para Event Sourcing
/// Utiliza SQLite (modo WAL) para Indexado Forense Rápido
/// y Sled para almacenamiento B-Tree ultra-rápido K/V.
#[derive(Clone)]
pub struct Ledger {
    sqlite_conn: Arc<Mutex<Connection>>,
    sled_db: Db,
}

type InventorySnapshot = (HashMap<String, Vec<LotTensor>>, i64);

impl Ledger {
    pub fn new(db_path: &str) -> Result<Self, String> {
        let sled_db = sled::open(format!("{}_kv", db_path))
            .map_err(|e| format!("Error abriendo Sled (Motor Tensorial KV): {}", e))?;

        let conn = Connection::open(format!("{}.sqlite", db_path))
            .map_err(|e| format!("Error abriendo SQLite (Índice Forense): {}", e))?;

        // Configuración de Grado Militar / Alta Concurrencia (WAL mode)
        conn.execute_batch(
            "PRAGMA journal_mode = WAL;
             PRAGMA synchronous = NORMAL;
             CREATE TABLE IF NOT EXISTS records_index (
                 tx_id TEXT PRIMARY KEY,
                 product_id TEXT NOT NULL,
                 sha256_hash TEXT NOT NULL,
                 timestamp INTEGER NOT NULL
             );",
        )
        .map_err(|e| format!("Error inicializando base de datos SQLite: {}", e))?;

        Ok(Self {
            sqlite_conn: Arc::new(Mutex::new(conn)),
            sled_db,
        })
    }

    /// Añade de forma inmutable un registro aceptado
    pub fn append_record(&self, record: &RawRecord, sha256_hash: &str) -> Result<(), String> {
        let payload =
            serde_json::to_vec(record).map_err(|e| format!("Error serializando payload: {}", e))?;

        self.sled_db
            .insert(&record.tx_id, payload)
            .map_err(|e| format!("Error escribiendo en Sled: {}", e))?;

        let conn = self
            .sqlite_conn
            .lock()
            .map_err(|e| format!("Mutex lock error: {}", e))?;
        conn.execute(
            "INSERT OR IGNORE INTO records_index (tx_id, product_id, sha256_hash, timestamp) 
             VALUES (?1, ?2, ?3, ?4)",
            (
                &record.tx_id,
                &record.product_id,
                sha256_hash,
                record.tx_timestamp_sec,
            ),
        )
        .map_err(|e| format!("Error escribiendo índice SQLite: {}", e))?;

        Ok(())
    }

    pub fn get_records_after(&self, after_timestamp: i64) -> Result<Vec<RawRecord>, String> {
        let conn = self
            .sqlite_conn
            .lock()
            .map_err(|e| format!("Mutex lock error: {}", e))?;
        let mut stmt = conn
            .prepare("SELECT tx_id FROM records_index WHERE timestamp > ?1 ORDER BY timestamp ASC")
            .map_err(|e| format!("Error preparando consulta SQLite: {}", e))?;

        let tx_ids = stmt
            .query_map([after_timestamp], |row| {
                let id: String = row.get(0)?;
                Ok(id)
            })
            .map_err(|e| format!("Error ejecutando consulta: {}", e))?;

        let mut records = Vec::new();
        for tx_id in tx_ids.flatten() {
            if let Ok(Some(payload)) = self.sled_db.get(&tx_id)
                && let Ok(record) = serde_json::from_slice::<RawRecord>(&payload)
            {
                records.push(record);
            }
        }
        Ok(records)
    }

    /// Reconstruye la historia completa leyendo desde el índice forense y el almacén KV
    pub fn get_all_records(&self) -> Result<Vec<RawRecord>, String> {
        self.get_records_after(-1)
    }

    /// Filtro y Proyector Financiero (Máquina de Estados)
    /// Transforma el Event Sourcing en un mapa de Tensores Remanentes por Producto (FIFO para Lotes)
    pub fn project_current_inventory(&self) -> Result<HashMap<String, Vec<LotTensor>>, String> {
        // Intentar cargar snapshot
        let (mut inventory, mut last_ts) = match self.load_snapshot() {
            Ok(Some((inv, ts))) => (inv, ts),
            _ => (HashMap::new(), -1),
        };

        let records = self.get_records_after(last_ts)?;

        if records.is_empty() {
            return Ok(inventory);
        }

        for rec in records {
            if rec.tx_timestamp_sec > last_ts {
                last_ts = rec.tx_timestamp_sec;
            }
            if rec.qty_delta > Decimal::ZERO {
                // INGRESO: Se crea un nuevo tensor de lote discreto
                let tensor = LotTensor::new(
                    rec.tx_id.clone(),
                    rec.product_id.clone(),
                    rec.qty_delta,
                    Decimal::ONE, // Fx mock para V1
                    rec.cost_usd,
                );
                inventory
                    .entry(rec.product_id.clone())
                    .or_insert_with(Vec::new)
                    .push(tensor);
            } else {
                // EGRESO: Se descuenta la cantidad de los lotes más antiguos (FIFO) o más recientes (LIFO)
                // Usaremos LIFO financiero como indica la arquitectura
                let mut remaining_to_deduct = rec.qty_delta.abs();
                if let Some(lotes) = inventory.get_mut(&rec.product_id) {
                    // Iterar desde el más reciente al más antiguo (LIFO)
                    for lote in lotes.iter_mut().rev() {
                        if remaining_to_deduct <= Decimal::ZERO {
                            break;
                        }
                        if lote.q_actual > Decimal::ZERO {
                            if lote.q_actual >= remaining_to_deduct {
                                lote.q_actual -= remaining_to_deduct;
                                remaining_to_deduct = Decimal::ZERO;
                            } else {
                                remaining_to_deduct -= lote.q_actual;
                                lote.q_actual = Decimal::ZERO;
                            }
                        }
                    }
                }
            }
        }

        // Limpiar lotes vacíos para optimizar memoria
        for lotes in inventory.values_mut() {
            lotes.retain(|l| l.q_actual > Decimal::ZERO);
        }

        // Guardar snapshot actualizado
        let _ = self.save_snapshot(&inventory, last_ts);

        Ok(inventory)
    }

    /// Guarda la última tasa BCV conocida en el almacén KV
    pub fn save_last_bcv_rate(&self, rate: Decimal) -> Result<(), String> {
        let rate_bytes =
            serde_json::to_vec(&rate).map_err(|e| format!("Error serializando tasa: {}", e))?;
        self.sled_db
            .insert(b"LAST_BCV_RATE", rate_bytes)
            .map_err(|e| format!("Error guardando tasa en Sled: {}", e))?;
        Ok(())
    }

    /// Recupera la última tasa BCV conocida o Retorna Zero si no existe
    pub fn get_last_bcv_rate(&self) -> Decimal {
        if let Ok(Some(payload)) = self.sled_db.get(b"LAST_BCV_RATE") {
            serde_json::from_slice::<Decimal>(&payload).unwrap_or(Decimal::ZERO)
        } else {
            Decimal::ZERO
        }
    }

    /// Guarda la configuración del Agente Centinela
    pub fn save_sentinel_config(
        &self,
        config: &crate::ingest::SentinelConfig,
    ) -> Result<(), String> {
        let config_bytes = serde_json::to_vec(config)
            .map_err(|e| format!("Error serializando SentinelConfig: {}", e))?;
        self.sled_db
            .insert(b"SENTINEL_CONFIG", config_bytes)
            .map_err(|e| format!("Error guardando SentinelConfig en Sled: {}", e))?;
        Ok(())
    }

    /// Recupera la configuración del Agente Centinela
    pub fn get_sentinel_config(&self) -> Result<Option<crate::ingest::SentinelConfig>, String> {
        if let Ok(Some(payload)) = self.sled_db.get(b"SENTINEL_CONFIG") {
            let data = serde_json::from_slice(&payload)
                .map_err(|e| format!("Error deserializando SentinelConfig: {}", e))?;
            Ok(Some(data))
        } else {
            Ok(None)
        }
    }

    fn save_snapshot(
        &self,
        inventory: &HashMap<String, Vec<LotTensor>>,
        last_timestamp: i64,
    ) -> Result<(), String> {
        let snapshot_data = serde_json::to_vec(&(inventory, last_timestamp))
            .map_err(|e| format!("Error serializando snapshot: {}", e))?;
        self.sled_db
            .insert(b"LATEST_SNAPSHOT", snapshot_data)
            .map_err(|e| format!("Error guardando snapshot en Sled: {}", e))?;
        Ok(())
    }

    fn load_snapshot(&self) -> Result<Option<InventorySnapshot>, String> {
        if let Ok(Some(payload)) = self.sled_db.get(b"LATEST_SNAPSHOT") {
            let data = serde_json::from_slice(&payload)
                .map_err(|e| format!("Error deserializando snapshot: {}", e))?;
            Ok(Some(data))
        } else {
            Ok(None)
        }
    }
}
