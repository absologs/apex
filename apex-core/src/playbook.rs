use arrow::array::{StringArray, as_string_array};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::record_batch::RecordBatch;
use arrow_cast::cast;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

pub type ColumnId = String;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum TransformOp {
    TrimWhitespace(ColumnId),
    Uppercase(ColumnId),
    CastToInteger(ColumnId),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Playbook {
    pub operations: Vec<TransformOp>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum TransformError {
    ColumnNotFound(String),
    ArrowError(String),
}

/// Motor de Ejecución Columnar (Diseño Indestructible)
/// Utiliza la potencia nativa de Rust sobre arrays de Arrow para garantizar
/// rendimiento máximo sin dependencia de kernels volátiles.
pub fn execute_playbook(
    batch: &RecordBatch,
    playbook: &Playbook,
) -> Result<RecordBatch, TransformError> {
    let mut columns = batch.columns().to_vec();
    let mut fields = batch.schema().fields().to_vec();

    for op in &playbook.operations {
        match op {
            TransformOp::TrimWhitespace(col_id) => {
                let idx = batch
                    .schema()
                    .index_of(col_id)
                    .map_err(|_| TransformError::ColumnNotFound(col_id.clone()))?;
                let array = as_string_array(&columns[idx]);

                // Transformación optimizada por el compilador (LLVM Auto-vectorization)
                let trimmed: StringArray = array.iter().map(|opt| opt.map(|s| s.trim())).collect();
                columns[idx] = Arc::new(trimmed);
            }
            TransformOp::Uppercase(col_id) => {
                let idx = batch
                    .schema()
                    .index_of(col_id)
                    .map_err(|_| TransformError::ColumnNotFound(col_id.clone()))?;
                let array = as_string_array(&columns[idx]);

                // Conversión de caso nativa rápida
                let upped: StringArray = array
                    .iter()
                    .map(|opt| opt.map(|s| s.to_uppercase()))
                    .collect();
                columns[idx] = Arc::new(upped);
            }
            TransformOp::CastToInteger(col_id) => {
                let idx = batch
                    .schema()
                    .index_of(col_id)
                    .map_err(|_| TransformError::ColumnNotFound(col_id.clone()))?;

                // Limpieza previa: Los números con espacios fallan en el cast nativo
                if *columns[idx].data_type() == DataType::Utf8 {
                    let array = as_string_array(&columns[idx]);
                    let trimmed: StringArray =
                        array.iter().map(|opt| opt.map(|s| s.trim())).collect();
                    columns[idx] = Arc::new(trimmed);
                }

                // El cast es una operación core estable en arrow-cast
                let casted = cast(&columns[idx], &DataType::Int64)
                    .map_err(|e| TransformError::ArrowError(e.to_string()))?;
                columns[idx] = casted;
                // Al castear, debemos actualizar el field en el esquema local
                fields[idx] = Arc::new(Field::new(col_id.as_str(), DataType::Int64, true));
            }
        }
    }

    let new_schema = Arc::new(Schema::new(fields));
    RecordBatch::try_new(new_schema, columns).map_err(|e| TransformError::ArrowError(e.to_string()))
}
