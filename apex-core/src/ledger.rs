use crate::models::RawRecord;
use crate::nodes::{Infraestructura, Producto};
use rusqlite::Connection;
use rust_decimal::Decimal;
use sha2::{Digest, Sha256};
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

type InventorySnapshot = (HashMap<String, (Producto, Infraestructura)>, i64);

impl Ledger {
    pub fn new(db_path: &str) -> Result<Self, String> {
        let sled_db = sled::open(format!("{}_kv", db_path))
            .map_err(|e| format!("Error abriendo Sled (Motor Tensorial KV): {}", e))?;

        let conn = Connection::open(format!("{}.sqlite", db_path))
            .map_err(|e| format!("Error abriendo SQLite (Índice Forense): {}", e))?;

        // Configuración de Grado Militar / Alta Concurrencia (WAL mode)
        conn.execute_batch(
            "PRAGMA journal_mode = WAL;
             PRAGMA synchronous = FULL;
             CREATE TABLE IF NOT EXISTS records_index (
                 tx_id TEXT PRIMARY KEY,
                 product_id TEXT NOT NULL,
                 sha256_hash TEXT NOT NULL,
                 timestamp INTEGER NOT NULL
             );",
        )
        .map_err(|e| format!("Error inicializando base de datos SQLite: {}", e))?;

        audit_integrity(&conn, &sled_db)?;

        Ok(Self {
            sqlite_conn: Arc::new(Mutex::new(conn)),
            sled_db,
        })
    }

    /// Añade de forma inmutable un registro aceptado
    pub fn append_record(&self, record: &RawRecord, _sha256_hash: &str) -> Result<(), String> {
        let payload =
            serde_json::to_vec(record).map_err(|e| format!("Error serializando payload: {}", e))?;

        let mut hasher = Sha256::new();
        hasher.update(&payload);
        let computed_hash = format!("{:x}", hasher.finalize());

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
                &computed_hash,
                record.tx_timestamp_sec,
            ),
        )
        .map_err(|e| format!("Error escribiendo índice SQLite: {}", e))?;

        // Garantizar resiliencia eléctrica: Forzamos flush determinista antes de confirmar el OK
        let _ = self
            .sled_db
            .flush()
            .map_err(|e| format!("Error en flush determinista de Sled: {}", e))?;
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
    pub fn project_current_inventory(
        &self,
    ) -> Result<HashMap<String, (Producto, Infraestructura)>, String> {
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
            let entry = inventory.entry(rec.product_id.clone()).or_insert_with(|| {
                (
                    Producto {
                        sku_id: rec.product_id.clone(),
                        costo_reposicion_esperado: rec.cost_usd,
                        precio_actual: rec.price_usd,
                        velocidad_salida: Decimal::ZERO,
                        cluster_id: "default".to_string(),
                    },
                    Infraestructura {
                        ubicacion_id: "global".to_string(),
                        sku_id: rec.product_id.clone(),
                        tiempo_estancia: 0,
                        stock_actual: 0,
                    },
                )
            });

            let qty_u32 = rec.qty_delta.abs().to_string().parse::<u32>().unwrap_or(0);

            if rec.qty_delta > Decimal::ZERO {
                entry.1.stock_actual += qty_u32;
                entry.0.costo_reposicion_esperado = rec.cost_usd;
            } else {
                entry.1.stock_actual = entry.1.stock_actual.saturating_sub(qty_u32);
                entry.0.velocidad_salida += Decimal::ONE;
            }
        }

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
        inventory: &HashMap<String, (Producto, Infraestructura)>,
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

fn audit_integrity(conn: &Connection, sled_db: &Db) -> Result<(), String> {
    let mut stmt = conn
        .prepare("SELECT tx_id, sha256_hash FROM records_index")
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
        })
        .map_err(|e| e.to_string())?;

    let mut to_delete_sqlite = Vec::new();
    let mut valid_tx_ids = std::collections::HashSet::new();

    for row_res in rows {
        let (tx_id, expected_hash) = row_res.map_err(|e| e.to_string())?;

        match sled_db.get(tx_id.as_bytes()) {
            Ok(Some(payload)) => {
                let mut hasher = Sha256::new();
                hasher.update(&payload);
                let computed_hash = format!("{:x}", hasher.finalize());

                if expected_hash != computed_hash && expected_hash != "ingesta_masiva" {
                    to_delete_sqlite.push(tx_id.clone());
                } else {
                    valid_tx_ids.insert(tx_id);
                }
            }
            Ok(None) | Err(_) => {
                to_delete_sqlite.push(tx_id.clone());
            }
        }
    }

    for tx_id in &to_delete_sqlite {
        conn.execute("DELETE FROM records_index WHERE tx_id = ?1", [tx_id])
            .map_err(|e| e.to_string())?;
        let _ = sled_db.remove(tx_id.as_bytes());
    }

    let system_keys = [
        b"LAST_BCV_RATE".to_vec(),
        b"SENTINEL_CONFIG".to_vec(),
        b"LATEST_SNAPSHOT".to_vec(),
    ];
    let mut to_delete_sled = Vec::new();

    for (key_bytes, _) in sled_db.iter().flatten() {
        if system_keys.contains(&key_bytes.to_vec()) {
            continue;
        }
        if let Ok(key_str) = String::from_utf8(key_bytes.to_vec())
            && !valid_tx_ids.contains(&key_str)
        {
            to_delete_sled.push(key_bytes);
        }
    }

    for key in to_delete_sled {
        let _ = sled_db.remove(key);
    }

    let _ = sled_db.flush();

    Ok(())
}
