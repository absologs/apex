use arrow::record_batch::RecordBatch;
use arrow::array::{Array, StringArray, Int64Array, as_string_array, as_primitive_array};
use arrow::compute::kernels::cast::cast;
use arrow::datatypes::DataType;
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

/// Motor de Ejecución Columnar Puro (O(1) Memory Mapping / SIMD)
pub fn execute_playbook(
    batch: &RecordBatch,
    playbook: &Playbook,
) -> Result<RecordBatch, TransformError> {
    let mut columns = batch.columns().to_vec();
    let schema = batch.schema();

    for op in &playbook.operations {
        match op {
            TransformOp::TrimWhitespace(col_id) => {
                let idx = schema.index_of(col_id).map_err(|_| TransformError::ColumnNotFound(col_id.clone()))?;
                let array = as_string_array(&columns[idx]);
                let trimmed: StringArray = array.iter().map(|opt| opt.map(|s| s.trim())).collect();
                columns[idx] = Arc::new(trimmed);
            }
            TransformOp::Uppercase(col_id) => {
                let idx = schema.index_of(col_id).map_err(|_| TransformError::ColumnNotFound(col_id.clone()))?;
                let array = as_string_array(&columns[idx]);
                let upped: StringArray = array.iter().map(|opt| opt.map(|s| s.to_uppercase())).collect();
                columns[idx] = Arc::new(upped);
            }
            TransformOp::CastToInteger(col_id) => {
                let idx = schema.index_of(col_id).map_err(|_| TransformError::ColumnNotFound(col_id.clone()))?;
                let casted = cast(&columns[idx], &DataType::Int64)
                    .map_err(|e| TransformError::ArrowError(e.to_string()))?;
                columns[idx] = casted;
            }
        }
    }

    RecordBatch::try_new(schema, columns)
        .map_err(|e| TransformError::ArrowError(e.to_string()))
}
