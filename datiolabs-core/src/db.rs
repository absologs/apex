use crate::capacidades::ErrorNegocio;
use crate::models::{Catalogo, ConfigNegocio, EventoTasaBcv, MovimientoStock, Producto, Venta};
use crate::modulos::panaderia::{LibroLotes, Lote};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use sled::Db;
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};
use thiserror::Error;

#[derive(Serialize, Deserialize)]
struct BackupHeader {
    version: u32,
    timestamp_unix: i64,
    arboles_count: u32,
}

const ARBOL_TASAS: &str = "tasas_bcv";
const ARBOL_PRODUCTOS: &str = "productos";
const ARBOL_VENTAS: &str = "ventas";
const ARBOL_MOVIMIENTOS: &str = "movimientos";
const ARBOL_LOTES: &str = "lotes";
const ARBOL_CONFIG: &str = "config";
const ARBOL_SESIONES: &str = "sesiones";
const CLAVE_CONFIG: &[u8] = b"config";

const TODOS_ARBOLES: &[&str] = &[
    ARBOL_TASAS,
    ARBOL_PRODUCTOS,
    ARBOL_VENTAS,
    ARBOL_MOVIMIENTOS,
    ARBOL_LOTES,
    ARBOL_CONFIG,
    ARBOL_SESIONES,
];

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackupMetadata {
    pub version: u32,
    pub timestamp_unix: i64,
    pub arboles: Vec<String>,
    pub total_registros: usize,
    pub checksum_sha256: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackupData {
    pub metadata: BackupMetadata,
    pub arboles: Vec<ArbolBackup>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArbolBackup {
    pub nombre: String,
    pub registros: Vec<RegistroBackup>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegistroBackup {
    pub clave: Vec<u8>,
    pub valor: Vec<u8>,
}

#[derive(Debug, Error)]
pub enum DbError {
    #[error("fallo del almacenamiento embebido: {0}")]
    Almacenamiento(#[from] sled::Error),
    #[error("fallo de serializacion binaria: {0}")]
    Serializacion(#[from] bincode::Error),
    #[error("violacion de negocio: {0}")]
    Negocio(#[from] ErrorNegocio),
    #[error("error de E/S: {0}")]
    Io(#[from] std::io::Error),
}

pub struct Database {
    db: Arc<Db>,
}

impl Database {
    pub fn abrir(path: &str) -> Result<Self, DbError> {
        let db = sled::open(path)?;
        Ok(Self { db: Arc::new(db) })
    }

    pub fn inner_db(&self) -> Arc<Db> {
        self.db.clone()
    }

    // ---------------- tasas BCV ----------------

    /// Persists a BCV rate event under a chronological big-endian key and
    /// couples it with its SHA-256 signature before any write occurs.
    pub fn insertar_tasa(&self, mut tasa: EventoTasaBcv) -> Result<EventoTasaBcv, DbError> {
        tasa.firma_sha256 = firmar_tasa(&tasa);
        let tree = self.db.open_tree(ARBOL_TASAS)?;
        let clave = (tasa.fecha_unix as u64).to_be_bytes();
        tree.insert(clave, bincode::serialize(&tasa)?)?;
        Ok(tasa)
    }

    pub fn ultimas_tasas(&self, cantidad: usize) -> Result<Vec<EventoTasaBcv>, DbError> {
        let tree = self.db.open_tree(ARBOL_TASAS)?;
        let mut tasas = Vec::with_capacity(cantidad.min(1024));
        for par in tree.iter().rev().take(cantidad) {
            let (_, valor) = par?;
            tasas.push(bincode::deserialize(&valor)?);
        }
        Ok(tasas)
    }

    // ---------------- configuracion (arranque en blanco) ----------------

    /// Ausencia de registro = fabrica. El wizard escribe exactamente una vez.
    pub fn guardar_config(&self, config: &ConfigNegocio) -> Result<(), DbError> {
        if self.cargar_config()?.is_some() {
            return Err(DbError::Negocio(ErrorNegocio::YaInicializado));
        }
        let tree = self.db.open_tree(ARBOL_CONFIG)?;
        tree.insert(CLAVE_CONFIG, bincode::serialize(config)?)?;
        Ok(())
    }

    pub fn cargar_config(&self) -> Result<Option<ConfigNegocio>, DbError> {
        let tree = self.db.open_tree(ARBOL_CONFIG)?;
        match tree.get(CLAVE_CONFIG)? {
            Some(bytes) => Ok(Some(bincode::deserialize(&bytes)?)),
            None => Ok(None),
        }
    }

    // ---------------- productos ----------------

    pub fn guardar_producto(&self, producto: &Producto) -> Result<(), DbError> {
        let tree = self.db.open_tree(ARBOL_PRODUCTOS)?;
        if tree.contains_key(producto.sku.as_bytes())? {
            return Err(DbError::Negocio(ErrorNegocio::SkuDuplicado(
                producto.sku.as_str().to_string(),
            )));
        }
        tree.insert(producto.sku.as_bytes(), bincode::serialize(producto)?)?;
        Ok(())
    }

    pub fn actualizar_producto(&self, producto: &Producto) -> Result<(), DbError> {
        let tree = self.db.open_tree(ARBOL_PRODUCTOS)?;
        tree.insert(producto.sku.as_bytes(), bincode::serialize(producto)?)?;
        Ok(())
    }

    /// Carga fila a fila desde almacenamiento y proyecta a columnas contiguas
    /// para el runtime (DoD: cold row-wise, hot column-wise).
    pub fn cargar_catalogo(&self) -> Result<Catalogo, DbError> {
        let tree = self.db.open_tree(ARBOL_PRODUCTOS)?;
        let mut filas = Vec::new();
        for par in tree.iter() {
            let (_, valor) = par?;
            filas.push(bincode::deserialize::<Producto>(&valor)?);
        }
        Ok(Catalogo::desde_productos(filas))
    }

    /// Movimiento append-only + actualizacion atomica de la columna stock.
    /// La firma se acopla antes del primer write (inmutabilidad forense).
    pub fn aplicar_movimiento(
        &self,
        mut movimiento: MovimientoStock,
        delta_catalogo: impl FnOnce(&str, Decimal),
    ) -> Result<MovimientoStock, DbError> {
        movimiento.firma_sha256 = firmar_movimiento(&movimiento);
        let clave_mov = clave_cronologica(movimiento.fecha_unix, movimiento.id.as_bytes());
        self.db
            .open_tree(ARBOL_MOVIMIENTOS)?
            .insert(clave_mov, bincode::serialize(&movimiento)?)?;

        let tree = self.db.open_tree(ARBOL_PRODUCTOS)?;
        match tree.get(movimiento.sku.as_bytes())? {
            Some(bytes) => {
                let mut producto: Producto = bincode::deserialize(&bytes)?;
                producto.stock += movimiento.delta;
                tree.insert(movimiento.sku.as_bytes(), bincode::serialize(&producto)?)?;
            }
            None => return Err(DbError::Negocio(ErrorNegocio::ProductoInexistente)),
        }
        delta_catalogo(&movimiento.sku, movimiento.delta);
        Ok(movimiento)
    }

    // ---------------- lotes de panaderia ----------------

    pub fn guardar_lote(&self, lote: &Lote) -> Result<(), DbError> {
        let tree = self.db.open_tree(ARBOL_LOTES)?;
        tree.insert(lote.id.as_bytes(), bincode::serialize(lote)?)?;
        Ok(())
    }

    pub fn cargar_lotes(&self) -> Result<LibroLotes, DbError> {
        let tree = self.db.open_tree(ARBOL_LOTES)?;
        let mut libro = LibroLotes::nuevo();
        for par in tree.iter() {
            let (_, valor) = par?;
            libro.insertar(bincode::deserialize::<Lote>(&valor)?);
        }
        Ok(libro)
    }

    pub fn actualizar_disponible_lote(
        &self,
        lote_id: &str,
        disponible: Decimal,
    ) -> Result<(), DbError> {
        let tree = self.db.open_tree(ARBOL_LOTES)?;
        match tree.get(lote_id.as_bytes())? {
            Some(bytes) => {
                let mut lote: Lote = bincode::deserialize(&bytes)?;
                lote.disponible = disponible;
                tree.insert(lote_id.as_bytes(), bincode::serialize(&lote)?)?;
                Ok(())
            }
            None => Err(DbError::Negocio(ErrorNegocio::ProductoInexistente)),
        }
    }

    // ---------------- ventas ----------------

    /// Upsert de venta con firma acoplada. Las cuentas abiertas reescriben su
    /// registro al agregar lineas; el cierre congela totales y firma final.
    pub fn guardar_venta(&self, mut venta: Venta) -> Result<Venta, DbError> {
        venta.firma_sha256 = firmar_venta(&venta);
        let tree = self.db.open_tree(ARBOL_VENTAS)?;
        tree.insert(venta.id.as_bytes(), bincode::serialize(&venta)?)?;
        Ok(venta)
    }

    pub fn cargar_venta(&self, venta_id: &str) -> Result<Option<Venta>, DbError> {
        let tree = self.db.open_tree(ARBOL_VENTAS)?;
        match tree.get(venta_id.as_bytes())? {
            Some(bytes) => Ok(Some(bincode::deserialize(&bytes)?)),
            None => Ok(None),
        }
    }

    /// Escaneo cronologico descendente para el panel del dueno.
    pub fn ventas_recientes(&self, limite: usize) -> Result<Vec<Venta>, DbError> {
        let tree = self.db.open_tree(ARBOL_VENTAS)?;
        let mut ventas = Vec::new();
        for par in tree.iter().rev().take(limite) {
            let (_, valor) = par?;
            ventas.push(bincode::deserialize(&valor)?);
        }
        Ok(ventas)
    }

    /// Consulta ventas dentro de un rango temporal exacto [desde_unix, hasta_unix].
    pub fn consultar_ventas_rango(
        &self,
        desde_unix: i64,
        hasta_unix: i64,
    ) -> Result<Vec<Venta>, DbError> {
        let tree = self.db.open_tree(ARBOL_VENTAS)?;
        let mut ventas = Vec::new();
        for par in tree.iter() {
            let (_, valor) = par?;
            let v: Venta = bincode::deserialize(&valor)?;
            if v.fecha_cierre_unix >= desde_unix && v.fecha_cierre_unix <= hasta_unix {
                ventas.push(v);
            }
        }
        ventas.sort_by_key(|v| v.fecha_cierre_unix);
        Ok(ventas)
    }

    /// Calcula metricas comerciales directas para un rango temporal.
    pub fn metricas_rango(
        &self,
        desde_unix: i64,
        hasta_unix: i64,
    ) -> Result<crate::analytics::MetricasPeriodo, DbError> {
        let ventas = self.consultar_ventas_rango(desde_unix, hasta_unix)?;
        let engine = crate::analytics::AnalyticsEngine::new();
        Ok(engine.calcular_metricas(&ventas))
    }

    pub fn cuentas_abiertas(&self) -> Result<Vec<Venta>, DbError> {
        Ok(self
            .ventas_recientes(usize::MAX)?
            .into_iter()
            .filter(|v| v.es_cuenta_abierta && v.estado == crate::models::EstadoVenta::Abierta)
            .collect())
    }

    pub fn exportar_backup(&self, ruta: &str) -> Result<BackupMetadata, DbError> {
        use sha2::{Digest, Sha256};
        use std::io::{BufWriter, Write};

        let file = std::fs::File::create(ruta)?;
        let mut writer = BufWriter::new(file);

        let mut total_registros = 0usize;
        let mut hasher = Sha256::new();

        let timestamp_unix = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_secs() as i64)
            .unwrap_or(0);

        let mut metadata = BackupMetadata {
            version: 1,
            timestamp_unix,
            arboles: TODOS_ARBOLES.iter().map(|s| s.to_string()).collect(),
            total_registros: 0,
            checksum_sha256: String::new(),
        };

        let header = BackupHeader {
            version: 1,
            timestamp_unix,
            arboles_count: TODOS_ARBOLES.len() as u32,
        };
        let header_bytes = bincode::serialize(&header)?;
        hasher.update(&header_bytes);
        writer.write_all(&(header_bytes.len() as u32).to_le_bytes())?;
        writer.write_all(&header_bytes)?;

        for nombre_arbol in TODOS_ARBOLES {
            let tree = self.db.open_tree(nombre_arbol)?;
            let nombre_bytes = nombre_arbol.as_bytes();
            hasher.update(nombre_bytes);
            writer.write_all(&(nombre_bytes.len() as u32).to_le_bytes())?;
            writer.write_all(nombre_bytes)?;

            let entries: Vec<(sled::IVec, sled::IVec)> =
                tree.iter().filter_map(|r| r.ok()).collect();
            let n_entries = entries.len() as u32;
            hasher.update(n_entries.to_le_bytes());
            writer.write_all(&n_entries.to_le_bytes())?;

            for (clave, valor) in entries {
                hasher.update(&clave);
                hasher.update(&valor);

                writer.write_all(&(clave.len() as u32).to_le_bytes())?;
                writer.write_all(&clave)?;
                writer.write_all(&(valor.len() as u32).to_le_bytes())?;
                writer.write_all(&valor)?;
                total_registros += 1;
            }
        }

        writer.flush()?;

        let checksum = format!("{:x}", hasher.finalize());
        metadata.total_registros = total_registros;
        metadata.checksum_sha256 = checksum;

        let metadata_bytes = bincode::serialize(&metadata)?;
        let mut file = std::fs::OpenOptions::new().write(true).open(ruta)?;
        use std::io::Seek;
        file.seek(std::io::SeekFrom::End(0))?;
        file.write_all(&metadata_bytes)?;
        file.flush()?;

        Ok(metadata)
    }

    pub fn importar_backup(&self, ruta: &str) -> Result<BackupMetadata, DbError> {
        use sha2::{Digest, Sha256};
        use std::io::{BufReader, Read, Seek, SeekFrom};

        let file = std::fs::File::open(ruta)?;
        let mut reader = BufReader::new(file);
        let file_size = reader.seek(SeekFrom::End(0))?;
        reader.seek(SeekFrom::Start(0))?;

        let mut hasher = Sha256::new();

        let mut len_buf = [0u8; 4];
        reader.read_exact(&mut len_buf)?;
        let header_len = u32::from_le_bytes(len_buf) as usize;
        let mut header_buf = vec![0u8; header_len];
        reader.read_exact(&mut header_buf)?;
        hasher.update(&header_buf);

        let _header: BackupHeader = bincode::deserialize(&header_buf)?;

        let mut _total_registros = 0usize;

        for _ in 0.._header.arboles_count {
            reader.read_exact(&mut len_buf)?;
            let nombre_len = u32::from_le_bytes(len_buf) as usize;
            let mut nombre_buf = vec![0u8; nombre_len];
            reader.read_exact(&mut nombre_buf)?;
            hasher.update(&nombre_buf);
            let nombre_arbol = std::str::from_utf8(&nombre_buf).map_err(|_| {
                DbError::Io(std::io::Error::new(
                    std::io::ErrorKind::InvalidData,
                    "Nombre árbol inválido",
                ))
            })?;

            let tree = self.db.open_tree(nombre_arbol)?;
            tree.clear()?;

            reader.read_exact(&mut len_buf)?;
            let cant_registros = u32::from_le_bytes(len_buf);
            hasher.update(len_buf);

            for _ in 0..cant_registros {
                reader.read_exact(&mut len_buf)?;
                let clave_len = u32::from_le_bytes(len_buf) as usize;
                let mut clave_buf = vec![0u8; clave_len];
                reader.read_exact(&mut clave_buf)?;
                hasher.update(&clave_buf);

                reader.read_exact(&mut len_buf)?;
                let valor_len = u32::from_le_bytes(len_buf) as usize;
                let mut valor_buf = vec![0u8; valor_len];
                reader.read_exact(&mut valor_buf)?;
                hasher.update(&valor_buf);

                tree.insert(clave_buf, valor_buf)?;
                _total_registros += 1;
            }
        }

        let metadata_len = file_size - reader.stream_position()?;
        let mut metadata_buf = vec![0u8; metadata_len as usize];
        reader.read_exact(&mut metadata_buf)?;

        let metadata: BackupMetadata = bincode::deserialize(&metadata_buf)?;

        let checksum = format!("{:x}", hasher.finalize());
        if checksum != metadata.checksum_sha256 {
            return Err(DbError::Serializacion(bincode::Error::from(
                std::io::Error::new(
                    std::io::ErrorKind::InvalidData,
                    "Checksum de backup inválido",
                ),
            )));
        }

        self.db.flush()?;
        Ok(metadata)
    }

    pub fn listar_backups(&self, directorio: &str) -> Result<Vec<BackupMetadata>, DbError> {
        use std::io::{BufReader, Read, Seek, SeekFrom};
        let mut metadatos = Vec::new();
        for entry in std::fs::read_dir(directorio)? {
            let entry = entry?;
            let path = entry.path();
            if path.extension().and_then(|s| s.to_str()) == Some("backup") {
                let file = std::fs::File::open(&path)?;
                let mut reader = BufReader::new(file);
                let file_size = reader.seek(SeekFrom::End(0))?;
                reader.seek(SeekFrom::Start(0))?;

                let _header: BackupHeader = match bincode::deserialize_from(&mut reader) {
                    Ok(h) => h,
                    Err(_) => continue,
                };

                let mut len_buf = [0u8; 4];
                let mut ok = true;
                for _ in 0.._header.arboles_count {
                    if reader.read_exact(&mut len_buf).is_err() {
                        ok = false;
                        break;
                    }
                    let nombre_len = u32::from_le_bytes(len_buf) as i64;
                    if reader.seek(SeekFrom::Current(nombre_len)).is_err() {
                        ok = false;
                        break;
                    }

                    if reader.read_exact(&mut len_buf).is_err() {
                        ok = false;
                        break;
                    }
                    let cant_registros = u32::from_le_bytes(len_buf);

                    for _ in 0..cant_registros {
                        if reader.read_exact(&mut len_buf).is_err() {
                            ok = false;
                            break;
                        }
                        let clave_len = u32::from_le_bytes(len_buf) as i64;
                        if reader.seek(SeekFrom::Current(clave_len)).is_err() {
                            ok = false;
                            break;
                        }

                        if reader.read_exact(&mut len_buf).is_err() {
                            ok = false;
                            break;
                        }
                        let valor_len = u32::from_le_bytes(len_buf) as i64;
                        if reader.seek(SeekFrom::Current(valor_len)).is_err() {
                            ok = false;
                            break;
                        }
                    }
                    if !ok {
                        break;
                    }
                }

                if ok {
                    let metadata_len = file_size - reader.stream_position()?;
                    if metadata_len > 0 && metadata_len < 1024 * 1024 {
                        let mut metadata_buf = vec![0u8; metadata_len as usize];
                        if reader.read_exact(&mut metadata_buf).is_ok()
                            && let Ok(metadata) =
                                bincode::deserialize::<BackupMetadata>(&metadata_buf)
                        {
                            metadatos.push(metadata);
                        }
                    }
                }
            }
        }
        metadatos.sort_by_key(|b| std::cmp::Reverse(b.timestamp_unix));
        Ok(metadatos)
    }

    pub fn auto_backup(
        &self,
        directorio: &str,
        max_backups: usize,
    ) -> Result<Option<BackupMetadata>, DbError> {
        let _ = std::fs::create_dir_all(directorio);
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|e| DbError::Io(std::io::Error::other(e)))?;
        let timestamp = now.as_secs();
        let ruta = std::path::Path::new(directorio).join(format!("datio_{}.backup", timestamp));
        let ruta_str = ruta.to_str().ok_or_else(|| {
            DbError::Io(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                "ruta de backup no es UTF-8 valido",
            ))
        })?;

        let metadata = self.exportar_backup(ruta_str)?;

        let mut backups = self.listar_backups(directorio)?;
        if backups.len() > max_backups {
            for viejo in backups.drain(max_backups..) {
                let ruta_vieja = std::path::Path::new(directorio)
                    .join(format!("datio_{}.backup", viejo.timestamp_unix));
                let _ = std::fs::remove_file(ruta_vieja);
            }
        }

        Ok(Some(metadata))
    }
}

fn clave_cronologica(fecha_unix: i64, id: &[u8]) -> Vec<u8> {
    let mut clave = Vec::with_capacity(8 + id.len());
    clave.extend_from_slice(&(fecha_unix as u64).to_be_bytes());
    clave.extend_from_slice(id);
    clave
}

fn firmar_tasa(tasa: &EventoTasaBcv) -> String {
    let mut hasher = Sha256::new();
    hasher.update(tasa.valor_bs_por_usd.to_string().as_bytes());
    hasher.update(b"|");
    hasher.update(tasa.fecha_unix.to_string().as_bytes());
    hasher.update(b"|");
    hasher.update(&tasa.fuente[..tasa.fuente_len as usize]);
    format!("{:x}", hasher.finalize())
}

fn firmar_venta(venta: &Venta) -> String {
    let mut hasher = Sha256::new();
    hasher.update(venta.id.as_bytes());
    hasher.update(b"|");
    hasher.update(venta.lineas.total_usd().to_string().as_bytes());
    hasher.update(b"|");
    hasher.update(venta.lineas.total_bs().to_string().as_bytes());
    hasher.update(b"|");
    hasher.update(format!("{:?}", venta.estado).as_bytes());
    hasher.update(b"|");
    for i in 0..venta.lineas.skus.len() {
        hasher.update(venta.lineas.skus[i].as_bytes());
        hasher.update(venta.lineas.cantidades[i].to_string().as_bytes());
        hasher.update(venta.lineas.precios_usd[i].to_string().as_bytes());
        hasher.update(venta.lineas.tasas_bloqueadas[i].to_string().as_bytes());
        hasher.update(b"#");
    }
    format!("{:x}", hasher.finalize())
}

fn firmar_movimiento(mov: &MovimientoStock) -> String {
    let mut hasher = Sha256::new();
    hasher.update(mov.id.as_bytes());
    hasher.update(b"|");
    hasher.update(mov.sku.as_bytes());
    hasher.update(b"|");
    hasher.update(mov.delta.to_string().as_bytes());
    hasher.update(b"|");
    hasher.update(format!("{:?}", mov.motivo).as_bytes());
    hasher.update(b"|");
    hasher.update(mov.fecha_unix.to_string().as_bytes());
    format!("{:x}", hasher.finalize())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::capacidades::{CAP_UNITARIA, ErrorNegocio, RUBRO_LICORERIA};
    use crate::models::{EstadoVenta, MAX_FUENTE_LEN, MotivoMovimiento, Nombre, Sku};
    use rust_decimal_macros::dec;

    fn db_temporal(etiqueta: &str) -> Database {
        let dir = std::env::temp_dir().join(format!("datio_{}_{}", etiqueta, std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        Database::abrir(dir.to_str().unwrap()).unwrap()
    }

    fn producto_base(sku: &str) -> Producto {
        Producto {
            sku: Sku::new(sku).unwrap(),
            nombre: Nombre::new("Producto").unwrap(),
            precio_usd: dec!(2.50),
            impuesto_pct: dec!(16),
            stock: dec!(100),
            capacidades: CAP_UNITARIA,
        }
    }

    #[test]
    fn firma_es_determinista_y_sensible_al_contenido() {
        let mut fuente = [0u8; MAX_FUENTE_LEN];
        let fuente_str = "BCV";
        fuente[..fuente_str.len()].copy_from_slice(fuente_str.as_bytes());

        let tasa = EventoTasaBcv {
            valor_bs_por_usd: dec!(36.92),
            fecha_unix: 1_700_000_000,
            fuente,
            fuente_len: fuente_str.len() as u8,
            firma_sha256: String::new(),
        };
        let a = firmar_tasa(&tasa);
        assert_eq!(a.len(), 64);

        let mut venta = venta_simple("V1", dec!(100));
        let f1 = firmar_venta(&venta);
        venta.estado = EstadoVenta::Cerrada;
        let f2 = firmar_venta(&venta);
        assert_ne!(f1, f2);
    }

    fn venta_simple(id: &str, tasa: Decimal) -> crate::models::Venta {
        let mut lineas = crate::models::LineasVenta::nuevas();
        lineas.agregar(
            Sku::new("SKU1").unwrap(),
            Nombre::new("Uno").unwrap(),
            dec!(2),
            dec!(5),
            tasa,
        );
        crate::models::Venta {
            id: id.to_string(),
            etiqueta: String::new(),
            es_cuenta_abierta: false,
            estado: EstadoVenta::Abierta,
            lineas,
            tasa_del_dia: tasa,
            total_usd: dec!(10),
            total_bs: dec!(1000),
            monto_recibido_bs: Decimal::ZERO,
            vuelto_bs: Decimal::ZERO,
            pagos: Vec::new(),
            estado_vuelto: None,
            metodo_vuelto: None,
            monto_vuelto_usd: None,
            tasa_vuelto: None,
            fecha_apertura_unix: 1000,
            fecha_cierre_unix: 0,
            firma_sha256: String::new(),
        }
    }

    #[test]
    fn config_arranque_blanco_y_escritura_unica() {
        let db = db_temporal("cfg");
        assert!(db.cargar_config().unwrap().is_none());
        db.guardar_config(&ConfigNegocio {
            nombre: Nombre::new("Mi Licoreria").unwrap(),
            rubros: RUBRO_LICORERIA,
            pin_dueno_sha256: "abc".into(),
        })
        .unwrap();
        let cfg = db.cargar_config().unwrap().unwrap();
        assert_eq!(cfg.nombre.as_str(), "Mi Licoreria");
        let duplicada = db.guardar_config(&ConfigNegocio {
            nombre: Nombre::new("Otra").unwrap(),
            rubros: 1,
            pin_dueno_sha256: String::new(),
        });
        assert!(matches!(
            duplicada,
            Err(DbError::Negocio(ErrorNegocio::YaInicializado))
        ));
    }

    #[test]
    fn catalogo_roundtrip_y_stock_atomico_por_movimiento() {
        let db = db_temporal("cat");
        db.guardar_producto(&producto_base("A001")).unwrap();

        let mut catalogo = db.cargar_catalogo().unwrap();
        assert_eq!(catalogo.len(), 1);
        let idx = catalogo.indice_de("A001").unwrap();

        let mov = MovimientoStock {
            id: "M1".into(),
            sku: "A001".into(),
            delta: dec!(-3),
            motivo: MotivoMovimiento::Venta,
            venta_id: Some("V1".into()),
            fecha_unix: 5000,
            firma_sha256: String::new(),
        };
        let firmado = db
            .aplicar_movimiento(mov, |sku, delta| {
                if let Some(i) = catalogo.indice_de(sku) {
                    catalogo.aplicar_delta_stock(i, delta);
                }
            })
            .unwrap();
        assert!(!firmado.firma_sha256.is_empty());
        assert_eq!(catalogo.stock(idx), dec!(97));

        let recargado = db.cargar_catalogo().unwrap();
        let idx2 = recargado.indice_de("A001").unwrap();
        assert_eq!(recargado.stock(idx2), dec!(97));

        let fantasma = MovimientoStock {
            id: "M2".into(),
            sku: "NOPE".into(),
            delta: dec!(-1),
            motivo: MotivoMovimiento::Venta,
            venta_id: None,
            fecha_unix: 5001,
            firma_sha256: String::new(),
        };
        assert!(db.aplicar_movimiento(fantasma, |_, _| {}).is_err());
    }

    #[test]
    fn venta_upsert_y_filtro_cuentas_abiertas() {
        let db = db_temporal("ven");
        let mut abierta = venta_simple("CTA1", dec!(100));
        abierta.es_cuenta_abierta = true;
        abierta.etiqueta = "Mesa 3".into();
        db.guardar_venta(abierta.clone()).unwrap();

        abierta.lineas.agregar(
            Sku::new("SKU2").unwrap(),
            Nombre::new("Dos").unwrap(),
            dec!(1),
            dec!(7),
            dec!(101),
        );
        abierta.total_usd = abierta.lineas.total_usd();
        db.guardar_venta(abierta).unwrap();

        let guardada = db.cargar_venta("CTA1").unwrap().unwrap();
        assert_eq!(guardada.lineas.skus.len(), 2);
        assert_eq!(
            db.cuentas_abiertas().unwrap().len(),
            1,
            "upsert no debe duplicar cuentas"
        );

        let directa = venta_simple("V9", dec!(100));
        db.guardar_venta(directa).unwrap();
        assert_eq!(db.cuentas_abiertas().unwrap().len(), 1);
        assert_eq!(db.ventas_recientes(10).unwrap().len(), 2);
    }
}
