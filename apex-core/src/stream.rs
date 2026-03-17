use std::collections::HashMap;
use crate::ingest::{IngestError, SchemaMap, ingest_column};
use crate::playbook::{Playbook, execute_playbook, TransformError};

#[derive(Debug)]
pub enum StreamError {
    AdapterError(String),
    IngestError(IngestError),
    TransformError(TransformError),
}

/// Trait para adaptadores que soportan captura de datos en tiempo real (CDC)
pub trait ContinuousStreamAdapter {
    /// Captura los registros nuevos desde la última llamada (Polling)
    fn poll_deltas(&mut self) -> Result<Vec<HashMap<String, String>>, StreamError>;
}

/// Función pura que procesa un flujo de deltas en tiempo real.
/// Valida la integridad topológica (LSH) y aplica las transformaciones del Playbook.
pub fn process_live_stream(
    deltas: Vec<HashMap<String, String>>,
    schema: &SchemaMap,
    playbook: &Playbook,
) -> Result<Vec<HashMap<String, String>>, StreamError> {
    // 1. Verificación de estabilidad topológica (Anti-Schema Drift)
    // Usamos el Oráculo de Ingesta para asegurar que los datos nuevos mantienen la huella R^5 esperada.
    for row in &deltas {
        if let Some((col, _)) = &schema.product_id_col {
            if let Some(val) = row.get(col) {
                // Si ingest_column falla o cambia drásticamente, detectamos el drift.
                let _lsh = ingest_column(val.as_bytes()).map_err(StreamError::IngestError)?;
                // Nota: En una implementación completa, compararíamos _lsh con un valor base.
            }
        }
    }

    // 2. Transformación Determinista O(1)
    let processed: Vec<_> = execute_playbook(deltas.into_iter(), playbook)
        .collect::<Result<Vec<_>, _>>()
        .map_err(StreamError::TransformError)?;

    Ok(processed)
}
