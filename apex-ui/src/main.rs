#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use apex_core::ledger::Ledger;
use apex_core::tensor::LotTensor;
use apex_core::ingest::{CsvAdapter, UniversalIngester, DataTopologyReport, SchemaMap, SourceAdapter};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::Manager;

// Contenedor de estado seguro para Tauri
struct AppState {
    ledger: Arc<Mutex<Option<Ledger>>>,
    tasa_bcv: Arc<Mutex<Decimal>>,
}

#[derive(Serialize, Deserialize)]
struct Cotizacion {
    nombre: String,
    venta: Option<Decimal>,
}

#[tauri::command]
async fn select_data_source() -> Result<Option<String>, String> {
    let file = rfd::AsyncFileDialog::new()
        .add_filter("Datos", &["csv", "json", "sqlite"])
        .pick_file()
        .await;

    if let Some(path) = file {
        Ok(Some(path.path().to_string_lossy().to_string()))
    } else {
        Ok(None)
    }
}

#[tauri::command]
async fn analyze_data_source(path: String) -> Result<DataTopologyReport, String> {
    let adapter = CsvAdapter::new(&path, 100)?; // Analizar solo las primeras 100 filas
    let schema = adapter.schema();
    let schema_map = UniversalIngester::infer_schema(&schema);
    
    // El reporte se construye basándose en el esquema inferido por Arrow
    Ok(DataTopologyReport {
        schema_inferred: schema_map,
        total_rows_analyzed: 100,
        anomalies_detected: vec![], // En la v1 columnar simplificamos auditoría
        is_ready_for_ingestion: true,
    })
}

#[tauri::command]
async fn execute_ingestion(
    _state: tauri::State<'_, AppState>,
    path: String,
    _schema: SchemaMap,
    _activate_sentinel: bool,
) -> Result<String, String> {
    let mut adapter = CsvAdapter::new(&path, 5000)?;
    let mut total_count = 0;

    // Playbook vacío por defecto en ingesta cruda (v1)
    let playbook = apex_core::playbook::Playbook { operations: vec![] };

    while let Some(batch) = adapter.fetch_next_batch()? {
        let clean_batch = apex_core::playbook::execute_playbook(&batch, &playbook)
            .map_err(|e| format!("Error en playbook: {:?}", e))?;
        
        total_count += clean_batch.num_rows();
        
        // Aquí se persistiría el RecordBatch binario en el Ledger (Sled)
        // Por ahora simulamos la carga exitosa
    }
    
    Ok(format!("Ingesta columnar completada. {} registros procesados vía Arrow.", total_count))
}

#[tauri::command]
async fn sync_bcv_rate(state: tauri::State<'_, AppState>) -> Result<String, String> {
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

    Err("No se encontró la tasa BCV en la respuesta".to_string())
}

#[tauri::command]
fn run_ingestion_pipeline() -> Result<Vec<u8>, String> {
    use arrow::array::{StringArray, Int64Array};
    use arrow::datatypes::{DataType, Field, Schema};
    use arrow::record_batch::RecordBatch;
    use arrow::ipc::writer::StreamWriter;
    use std::sync::Arc;

    let schema = Arc::new(Schema::new(vec![
        Field::new("sku", DataType::Utf8, false),
        Field::new("qty", DataType::Int64, false),
        Field::new("status", DataType::Utf8, false),
    ]));

    let sku_array = StringArray::from(vec!["PROD-001", "PROD-002", "PROD-003", "PROD-004", "PROD-005"]);
    let qty_array = Int64Array::from(vec![150, 200, 50, 0, 10]);
    let status_array = StringArray::from(vec!["ACTIVE", "ACTIVE", "WARNING", "DEAD", "WARNING"]);

    let batch = RecordBatch::try_new(
        schema.clone(),
        vec![
            Arc::new(sku_array),
            Arc::new(qty_array),
            Arc::new(status_array),
        ],
    ).map_err(|e| format!("Error creando batch: {}", e))?;

    let mut buffer = Vec::new();
    {
        let mut writer = StreamWriter::try_new(&mut buffer, &schema)
            .map_err(|e| format!("Error en StreamWriter: {}", e))?;
        writer.write(&batch)
            .map_err(|e| format!("Error escribiendo batch: {}", e))?;
        writer.finish()
            .map_err(|e| format!("Error finalizando stream: {}", e))?;
    }

    Ok(buffer)
}

#[tauri::command]
fn get_inventory_arrow(state: tauri::State<AppState>) -> Result<Vec<u8>, String> {
    let ledger_guard = state.ledger.lock().map_err(|e| format!("Error de concurrencia: {}", e))?;

    if let Some(ledger) = &*ledger_guard {
        let inv = ledger
            .project_current_inventory()
            .map_err(|e| e.to_string())?;
        
        let binary = apex_core::arrow_transport::inventory_to_arrow_ipc(&inv)
            .map_err(|e| format!("Error en transporte Arrow: {:?}", e))?;
        
        Ok(binary)
    } else {
        Err("Ledger no inicializado".to_string())
    }
}

#[tauri::command]
fn get_inventory(state: tauri::State<AppState>) -> Result<HashMap<String, Vec<LotTensor>>, String> {
    let ledger_guard = state.ledger.lock().map_err(|e| format!("Error de concurrencia: {}", e))?;

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
                        println!("> CENTINELA DESPIERTO: Procesando deltas en {}...", config.source_path);
                        if config.source_type == "CSV" {
                            if let Ok(mut adapter) = CsvAdapter::new(&config.source_path, 5000) {
                                let playbook = apex_core::playbook::Playbook { operations: vec![] };
                                while let Ok(Some(batch)) = adapter.fetch_next_batch() {
                                    if let Ok(_clean_batch) = apex_core::playbook::execute_playbook(&batch, &playbook) {
                                        // Persistir deltas en el ledger
                                    }
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
            analyze_data_source,
            execute_ingestion
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
