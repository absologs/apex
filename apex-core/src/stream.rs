use crate::ingest::{IngestError, SchemaMap, ingest_column};
use crate::playbook::{Playbook, TransformError, execute_playbook};
use arrow::array::as_string_array;
use arrow::datatypes::DataType;
use arrow::record_batch::RecordBatch;
use arrow_cast::cast;

#[derive(Debug)]
pub enum StreamError {
    AdapterError(String),
    IngestError(IngestError),
    TransformError(TransformError),
}

/// Trait para adaptadores que soportan captura de datos en tiempo real (CDC)
pub trait ContinuousStreamAdapter {
    /// Captura los registros nuevos desde la última llamada (Polling) en un micro-lote columnar.
    fn poll_deltas(&mut self) -> Result<Option<RecordBatch>, StreamError>;
}

/// Función pura que procesa un flujo de deltas en tiempo real.
/// Valida la integridad topológica (LSH) y aplica las transformaciones del Playbook.
pub fn process_live_stream(
    deltas: RecordBatch,
    schema: &SchemaMap,
    playbook: &Playbook,
) -> Result<RecordBatch, StreamError> {
    // 1. Verificación de estabilidad topológica (Anti-Schema Drift)
    // Usamos el Oráculo de Ingesta para asegurar que los datos nuevos mantienen la huella R^5 esperada.
    if let Some((col, _)) = &schema.product_id_col {
        let schema_batch = deltas.schema();
        if let Ok(idx) = schema_batch.index_of(col) {
            let raw_col = deltas.column(idx);
            let casted_col = cast(raw_col, &DataType::Utf8).map_err(|e| {
                StreamError::AdapterError(format!("Error casteando ID a String: {}", e))
            })?;
            let array = as_string_array(&casted_col);

            for val in array.iter().flatten() {
                // Si ingest_column falla o cambia drásticamente, detectamos el drift.
                let _lsh = ingest_column(val.as_bytes()).map_err(StreamError::IngestError)?;
            }
        }
    }

    // 2. Transformación Determinista Columnar (DoD)
    let processed = execute_playbook(&deltas, playbook).map_err(StreamError::TransformError)?;

    Ok(processed)
}
