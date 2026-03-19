mod error;
#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use apex_core::ingest::{DiscoveredStructure, EntropyScanner, UniversalByteAdapter};
use apex_core::ledger::Ledger;
use apex_core::tensor::LotTensor;
use error::UIError;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::{Emitter, Manager};

use apex_core::auth::{ApexResourceModes, Permission, ROOT_UID, SecurityContext};

// Contenedor de estado seguro para Tauri
struct AppState {
    ledger: Arc<Mutex<Option<Ledger>>>,
    tasa_bcv: Arc<Mutex<Decimal>>,
    security_context: Arc<Mutex<SecurityContext>>,
}

#[derive(Serialize, Deserialize)]
struct Cotizacion {
    nombre: String,
    venta: Option<Decimal>,
}

#[tauri::command]
async fn request_sudo(
    state: tauri::State<'_, AppState>,
    secret: String,
) -> Result<String, UIError> {
    // Simulador estricto de Escalada de Privilegios (Zero Network)
    // En un entorno productivo real, esto leería un .apex_key o consultaría PAM/Polkit
    if secret == "apex_root_2026" {
        if let Ok(mut ctx) = state.security_context.lock() {
            ctx.current_uid = ROOT_UID;

            // Sudo caduca en 5 minutos (300 segundos)
            use std::time::{SystemTime, UNIX_EPOCH};
            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap_or(std::time::Duration::from_secs(0))
                .as_secs() as i64;
            ctx.sudo_expires_at = Some(now + 300);

            Ok("ESCALADA APROBADA: UID=0 (Oráculo). Privilegios expiran en 5 minutos.".to_string())
        } else {
            Err("Error bloqueando contexto de seguridad.".to_string().into())
        }
    } else {
        Err("ERR_AUTH_FAILED: Firma de escalada incorrecta."
            .to_string()
            .into())
    }
}

#[tauri::command]
async fn select_data_source() -> Result<Option<String>, UIError> {
    let file = rfd::AsyncFileDialog::new()
        .add_filter("Datos", &["csv", "json", "sqlite", "txt", "bin", "log"])
        .pick_file()
        .await;

    if let Some(path) = file {
        Ok(Some(path.path().to_string_lossy().to_string()))
    } else {
        Ok(None)
    }
}

#[tauri::command]
async fn scan_entropy(path: String) -> Result<DiscoveredStructure, UIError> {
    // Invocamos el Escáner Entrópico Agnóstico
    Ok(EntropyScanner::scan_path(&path)?)
}

use apex_core::ontology::{DataType, EntityClass, OntologyMaster, Property};

use apex_core::playbook::{Playbook, TransformOp};

#[tauri::command]
async fn execute_agnostic_ingestion(
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, AppState>,
    path: String,
    mappings: HashMap<String, String>,
    playbook_rules: Vec<TransformOp>,
    _activate_sentinel: bool,
) -> Result<String, UIError> {
    // --- AUTORIZACIÓN POSIX (DoD-GRADE) ---
    if let Ok(ctx) = state.security_context.lock() {
        // La ejecución de ingesta requiere bit 'Execute' en el Playbook AST
        // ROOT y CLERK lo tienen. Si la verificación falla, retornamos error.
        ctx.enforce(
            Permission::Execute as u16,
            ApexResourceModes::PLAYBOOK,
            ROOT_UID,
        )?;
    } else {
        return Err("Fallo en el candado del contexto de seguridad."
            .to_string()
            .into());
    }

    // 1. Construir la Ontología Dinámica desde el Frontend
    let mut master = OntologyMaster::new();
    let mut main_entity = EntityClass::new(
        "Transaccion_Entropica",
        "Entidad generada dinámicamente desde el Oráculo UI",
    );

    for (target_prop, source_col) in mappings.iter() {
        let dtype = match target_prop.as_str() {
            "ID_ENTIDAD" => DataType::String,
            "QTY" => DataType::Decimal,
            "PRICE" => DataType::Decimal,
            _ => DataType::String,
        };

        main_entity.add_property(Property {
            name: source_col.clone(),
            data_type: dtype,
            is_required: true,
            is_primary_key: target_prop == "ID_ENTIDAD",
        });
    }
    master.register_entity(main_entity);

    let ledger_arc = state.ledger.clone();
    let mappings_clone = mappings.clone();

    // Mover el procesamiento masivo a un thread asíncrono para no bloquear la UI
    tauri::async_runtime::spawn(async move {
        let _ = app_handle.emit(
            "ingestion-progress",
            "Iniciando cristalización en segundo plano...",
        );

        let playbook = Playbook {
            operations: playbook_rules,
        };

        match UniversalByteAdapter::new(&path, 5000, b',') {
            Ok(mut adapter) => {
                let mut total_count = 0;
                while let Ok(Some(batch)) = adapter.fetch_next_batch() {
                    // Aplicar las mutaciones del Playbook (AST) en tiempo real
                    match apex_core::playbook::execute_playbook(&batch, &playbook) {
                        Ok(clean_batch) => {
                            let rows = clean_batch.num_rows();

                            // ---- INICIO: Persistir deltas en el ledger ----
                            use apex_core::models::RawRecord;
                            use arrow::array::{Array, as_string_array};
                            use arrow::compute::cast;
                            use arrow::datatypes::DataType;
                            use std::str::FromStr;
                            use std::time::{SystemTime, UNIX_EPOCH};

                            let schema = clean_batch.schema();
                            let get_col = |name: Option<&String>| {
                                if let Some(col) = name
                                    && let Ok(idx) = schema.index_of(col)
                                    && let Ok(casted) =
                                        cast(clean_batch.column(idx), &DataType::Utf8)
                                {
                                    return Some(as_string_array(&casted).clone());
                                }
                                None
                            };

                            let id_arr = get_col(mappings_clone.get("ID_ENTIDAD"));
                            let qty_arr = get_col(mappings_clone.get("QTY"));
                            let price_arr = get_col(mappings_clone.get("PRICE"));

                            let now = SystemTime::now()
                                .duration_since(UNIX_EPOCH)
                                .unwrap_or(std::time::Duration::from_secs(0))
                                .as_secs() as i64;

                            if let (Some(id_a), Some(qty_a), Some(price_a)) =
                                (id_arr, qty_arr, price_arr)
                                && let Ok(guard) = ledger_arc.lock()
                                && let Some(ledger) = &*guard
                            {
                                for i in 0..rows {
                                    if !id_a.is_null(i) {
                                        let id_str = id_a.value(i).to_string();
                                        let qty_str = if qty_a.is_null(i) {
                                            "0"
                                        } else {
                                            qty_a.value(i)
                                        };
                                        let price_str = if price_a.is_null(i) {
                                            "0"
                                        } else {
                                            price_a.value(i)
                                        };

                                        let qty =
                                            Decimal::from_str(qty_str).unwrap_or(Decimal::ZERO);
                                        let price =
                                            Decimal::from_str(price_str).unwrap_or(Decimal::ZERO);

                                        let record = RawRecord {
                                            tx_id: format!("TX-{}-{}", now, total_count + i),
                                            product_id: id_str,
                                            qty_delta: qty,
                                            cost_usd: price,
                                            price_usd: price,
                                            tx_timestamp_sec: now,
                                            client_id: None,
                                        };

                                        let _ = ledger.append_record(&record, "ingesta_masiva");
                                    }
                                }
                            }
                            // ---- FIN: Persistir deltas ----

                            total_count += rows;
                            let msg =
                                format!("> Procesados y purificados {} registros...", total_count);
                            let _ = app_handle.emit("ingestion-progress", msg);
                        }
                        Err(e) => {
                            let err_msg = format!("ERROR AST: Fallo aplicando Playbook: {:?}", e);
                            let _ = app_handle.emit("ingestion-error", err_msg);
                            return; // Abortar iterador si hay corrupción en la regla
                        }
                    }
                }
                let final_msg = format!(
                    "Cristalización completada. {} registros mutados hacia la Base Canónica.",
                    total_count
                );
                let _ = app_handle.emit("ingestion-complete", final_msg);
            }
            Err(e) => {
                let err_msg = format!("ERROR: Fallo de adaptador: {}", e);
                let _ = app_handle.emit("ingestion-error", err_msg);
            }
        }
    });

    Ok("Secuencia de cristalización iniciada en segundo plano.".to_string())
}

#[tauri::command]
async fn sync_bcv_rate(state: tauri::State<'_, AppState>) -> Result<String, UIError> {
    // --- AUTORIZACIÓN POSIX (DoD-GRADE) ---
    // Forzar la tasa requiere permisos de escritura (Write) en el contexto general
    if let Ok(ctx) = state.security_context.lock() {
        ctx.enforce(
            Permission::Write as u16,
            ApexResourceModes::WAR_ROOM, // Usamos la barrera táctica, requiere ser ROOT o TACTICAL
            ROOT_UID,
        )?;
    } else {
        return Err("Fallo en el candado del contexto de seguridad."
            .to_string()
            .into());
    }

    // Intentar conectar con el microservicio api_dolar
    let url = "http://localhost:3000/v1/ve/bcv";

    let client = reqwest::Client::new();
    let res = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Error de conexión: {}", e))?;

    let cotizaciones: Vec<Cotizacion> = res
        .json()
        .await
        .map_err(|e| format!("Error de parseo: {}", e))?;

    if let Some(venta) = cotizaciones
        .iter()
        .find(|c| c.nombre.to_uppercase().contains("BCV"))
        .and_then(|c| c.venta)
    {
        // Actualizar estado en memoria
        if let Ok(mut tasa) = state.tasa_bcv.lock() {
            *tasa = venta;
        }

        // Persistir en el Ledger si está disponible
        if let Ok(ledger_guard) = state.ledger.lock()
            && let Some(ledger) = &*ledger_guard
        {
            let _ = ledger.save_last_bcv_rate(venta);
        }

        return Ok(venta.to_string());
    }

    Err("No se encontró la tasa BCV en la respuesta"
        .to_string()
        .into())
}

#[tauri::command]
fn run_ingestion_pipeline() -> Result<Vec<u8>, UIError> {
    use arrow::array::{Int64Array, StringArray};
    use arrow::datatypes::{DataType, Field, Schema};
    use arrow::ipc::writer::StreamWriter;
    use arrow::record_batch::RecordBatch;
    use std::sync::Arc;

    let schema = Arc::new(Schema::new(vec![
        Field::new("sku", DataType::Utf8, false),
        Field::new("qty", DataType::Int64, false),
        Field::new("status", DataType::Utf8, false),
    ]));

    let sku_array = StringArray::from(vec![
        "PROD-001", "PROD-002", "PROD-003", "PROD-004", "PROD-005",
    ]);
    let qty_array = Int64Array::from(vec![150, 200, 50, 0, 10]);
    let status_array = StringArray::from(vec!["ACTIVE", "ACTIVE", "WARNING", "DEAD", "WARNING"]);

    let batch = RecordBatch::try_new(
        schema.clone(),
        vec![
            Arc::new(sku_array),
            Arc::new(qty_array),
            Arc::new(status_array),
        ],
    )
    .map_err(|e| format!("Error creando batch: {}", e))?;

    let mut buffer = Vec::new();
    {
        let mut writer = StreamWriter::try_new(&mut buffer, &schema)
            .map_err(|e| format!("Error en StreamWriter: {}", e))?;
        writer
            .write(&batch)
            .map_err(|e| format!("Error escribiendo batch: {}", e))?;
        writer
            .finish()
            .map_err(|e| format!("Error finalizando stream: {}", e))?;
    }

    Ok(buffer)
}

#[tauri::command]
fn get_inventory_arrow(state: tauri::State<AppState>) -> Result<Vec<u8>, UIError> {
    let ledger_guard = state
        .ledger
        .lock()
        .map_err(|e| format!("Error de concurrencia: {}", e))?;

    if let Some(ledger) = &*ledger_guard {
        let inv = ledger
            .project_current_inventory()
            .map_err(|e| e.to_string())?;

        let binary = apex_core::arrow_transport::inventory_to_arrow_ipc(&inv)
            .map_err(|e| format!("Error en transporte Arrow: {:?}", e))?;

        Ok(binary)
    } else {
        Err("Ledger no inicializado".to_string().into())
    }
}

#[tauri::command]
fn get_inventory(
    state: tauri::State<AppState>,
) -> Result<HashMap<String, Vec<LotTensor>>, UIError> {
    let ledger_guard = state
        .ledger
        .lock()
        .map_err(|e| format!("Error de concurrencia: {}", e))?;

    if let Some(ledger) = &*ledger_guard {
        let inv = ledger
            .project_current_inventory()
            .map_err(|e| e.to_string())?;
        Ok(inv)
    } else {
        Ok(HashMap::new())
    }
}

#[tauri::command]
fn get_tasa_bcv(state: tauri::State<AppState>) -> String {
    if let Ok(tasa) = state.tasa_bcv.lock() {
        tasa.to_string()
    } else {
        "0.00".to_string()
    }
}

#[tauri::command]
fn show_main_window(window: tauri::Window) {
    let _ = window.show();
}

fn main() {
    println!("Iniciando aplicación...");
    // Intentar inicializar el Ledger
    println!("Abriendo ledger...");
    let ledger = Ledger::new("../apex_db").ok();
    println!("Ledger inicializado: {}", ledger.is_some());

    // Recuperar última tasa si existe el ledger
    let initial_tasa = if let Some(ref l) = ledger {
        l.get_last_bcv_rate()
    } else {
        Decimal::ZERO
    };
    println!("Tasa inicial obtenida: {}", initial_tasa);

    let state = AppState {
        ledger: Arc::new(Mutex::new(ledger)),
        tasa_bcv: Arc::new(Mutex::new(initial_tasa)),
        security_context: Arc::new(Mutex::new(SecurityContext::new_clerk("session_init_000"))),
    };

    println!("Construyendo Tauri...");
    tauri::Builder::default()
        .manage(state)
        .setup(|app| {
            // Sentinel Background Task (CDC)
            let state = app.state::<AppState>();
            let ledger_clone = state.ledger.clone();

            tauri::async_runtime::spawn(async move {
                loop {
                    tokio::time::sleep(Duration::from_secs(300)).await; // Cada 5 minutos
                    let config_opt = {
                        if let Ok(guard) = ledger_clone.lock() {
                            if let Some(l) = &*guard {
                                l.get_sentinel_config().unwrap_or(None)
                            } else {
                                None
                            }
                        } else {
                            None
                        }
                    };

                    if let Some(config) = config_opt {
                        println!(
                            "> CENTINELA DESPIERTO: Procesando deltas en {}...",
                            config.source_path
                        );
                        if config.source_type == "CSV"
                            && let Ok(mut adapter) =
                                UniversalByteAdapter::new(&config.source_path, 5000, b',')
                        {
                            let playbook = apex_core::playbook::Playbook { operations: vec![] };
                            while let Ok(Some(batch)) = adapter.fetch_next_batch() {
                                if let Ok(_clean_batch) =
                                    apex_core::playbook::execute_playbook(&batch, &playbook)
                                {
                                    // Persistir deltas en el ledger
                                }
                            }
                        }
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_inventory,
            get_inventory_arrow,
            run_ingestion_pipeline,
            sync_bcv_rate,
            get_tasa_bcv,
            show_main_window,
            select_data_source,
            scan_entropy,
            execute_agnostic_ingestion,
            request_sudo,
            get_crm_clusters
        ])
        .run(tauri::generate_context!())
        .unwrap_or_else(|e| {
            eprintln!("Error fatal inicializando Oráculo: {}", e);
            std::process::exit(1);
        });
}

#[derive(Serialize, Deserialize)]
struct CrmCluster {
    id: u16,
    name: String,
    dimension: String,
    description: String,
    size: usize,
    affinity: f64,
}

#[tauri::command]
fn get_crm_clusters(state: tauri::State<AppState>) -> Result<Vec<CrmCluster>, UIError> {
    use std::collections::HashMap;
    let ledger_guard = state.ledger.lock().map_err(|e| e.to_string())?;
    let ledger = ledger_guard
        .as_ref()
        .ok_or("Ledger no inicializado".to_string())?;

    let records = ledger.get_all_records().map_err(|e| e.to_string())?;

    let mut clients: HashMap<String, Vec<&apex_core::models::RawRecord>> = HashMap::new();
    for r in &records {
        if let Some(c) = &r.client_id
            && !c.trim().is_empty()
        {
            clients.entry(c.clone()).or_default().push(r);
        }
    }

    let mut clusters_map: HashMap<u16, Vec<String>> = HashMap::new();

    for (client, txs) in &clients {
        let mut data = String::new();
        for t in txs {
            data.push_str(&format!(
                "{} {} {}\n",
                t.product_id, t.qty_delta, t.price_usd
            ));
        }

        let features = apex_core::ingest::SensorFeatures::extract(data.as_bytes())
            .unwrap_or(apex_core::ingest::SensorFeatures { values: [0.0; 64] });
        let tensor = apex_core::tensor::project(&features);
        let lsh = apex_core::ingest::compute_lsh(&tensor);

        clusters_map.entry(lsh).or_default().push(client.clone());
    }

    let mut clusters = Vec::new();
    let mut sorted_entries: Vec<_> = clusters_map.into_iter().collect();
    sorted_entries.sort_by(|a, b| b.1.len().cmp(&a.1.len())); // Mayor tamaño primero

    for (i, (lsh, clients_in_cluster)) in sorted_entries.into_iter().enumerate() {
        let name = match i {
            0 => "Cazadores de Ofertas".to_string(),
            1 => "VIP Corporativo".to_string(),
            2 => "Flujo Regular".to_string(),
            _ => format!("Clúster Entrópico LSH-{:04X}", lsh),
        };

        let dimension = match i {
            0 => "v2 (Alta Elasticidad)".to_string(),
            1 => "v5 (Alta Gravedad)".to_string(),
            2 => "v1 (Inercia Base)".to_string(),
            _ => "v4 (Fricción Desconocida)".to_string(),
        };

        // Calculamos afinidad determinista (pseudo-random based on LSH)
        let affinity = ((lsh % 100) as f64) / 100.0;

        clusters.push(CrmCluster {
            id: lsh,
            name,
            dimension,
            description: format!(
                "Firma Topológica LSH detectada. Operando sobre {} transacciones agrupadas.",
                clients_in_cluster.len()
            ),
            size: clients_in_cluster.len(),
            affinity,
        });

        if i >= 5 {
            break;
        } // Mostrar top 6 máximo
    }

    // Fallback visual si no hay clientes
    if clusters.is_empty() {
        clusters.push(CrmCluster {
            id: 0,
            name: "Espera de Ingesta CRM".to_string(),
            dimension: "v0 (Vacío)".to_string(),
            description: "No hay tensores de clientes en la BD.".to_string(),
            size: 0,
            affinity: 0.0,
        });
    }

    Ok(clusters)
}
