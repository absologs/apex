use arrow::array::{StringBuilder, Decimal128Builder};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::record_batch::RecordBatch;
use arrow::ipc::writer::StreamWriter;
use std::sync::Arc;
use std::collections::HashMap;
use crate::tensor::LotTensor;
use crate::playbook::TransformError;

/// Error específico de la capa de transporte Arrow
#[derive(Debug)]
pub enum ArrowError {
    SchemaMismatch,
    Internal(String),
    Transform(TransformError),
}

/// Definición canónica del esquema de APEX para transporte columnar.
/// Basado en la Variedad Topológica R^5.
pub fn get_apex_schema() -> Arc<Schema> {
    Arc::new(Schema::new(vec![
        Field::new("lote_id", DataType::Utf8, false),
        Field::new("product_id", DataType::Utf8, false),
        Field::new("q_actual", DataType::Decimal128(38, 28), false),
        Field::new("c_usd", DataType::Decimal128(38, 28), false),
        Field::new("fx_origen", DataType::Decimal128(38, 28), false),
        Field::new("epsilon_entropia", DataType::Decimal128(38, 28), false),
    ]))
}

/// Transmuta el inventario proyectado (Tensors) en un buffer binario Arrow IPC.
/// Diseñado para saturar la caché L1 del procesador mediante SoA (Struct of Arrays).
pub fn inventory_to_arrow_ipc(
    inventory: &HashMap<String, Vec<LotTensor>>,
) -> Result<Vec<u8>, ArrowError> {
    let schema = get_apex_schema();
    
    let mut lote_id_builder = StringBuilder::new();
    let mut product_id_builder = StringBuilder::new();
    let mut q_actual_builder = Decimal128Builder::new();
    let mut c_usd_builder = Decimal128Builder::new();
    let mut fx_origen_builder = Decimal128Builder::new();
    let mut entropy_builder = Decimal128Builder::new();

    for (product_id, lots) in inventory {
        for lot in lots {
            lote_id_builder.append_value(&lot.lote_id);
            product_id_builder.append_value(product_id);
            
            let to_i128 = |d: rust_decimal::Decimal| -> i128 {
                let mantissa = d.mantissa(); // i128 puro
                let scale = d.scale() as i32;
                let target_scale = 28;
                
                if target_scale >= scale {
                    mantissa * 10i128.pow((target_scale - scale) as u32)
                } else {
                    mantissa / 10i128.pow((scale - target_scale) as u32)
                }
            };

            q_actual_builder.append_value(to_i128(lot.q_actual));
            c_usd_builder.append_value(to_i128(lot.c_usd));
            fx_origen_builder.append_value(to_i128(lot.fx_origen));
            entropy_builder.append_value(to_i128(lot.epsilon_entropia));
        }
    }

    let batch = RecordBatch::try_new(
        schema.clone(),
        vec![
            Arc::new(lote_id_builder.finish()),
            Arc::new(product_id_builder.finish()),
            Arc::new(q_actual_builder.finish()),
            Arc::new(c_usd_builder.finish()),
            Arc::new(fx_origen_builder.finish()),
            Arc::new(entropy_builder.finish()),
        ],
    ).map_err(|e| ArrowError::Internal(e.to_string()))?;

    let mut buffer = Vec::new();
    {
        let mut writer = StreamWriter::try_new(&mut buffer, &schema)
            .map_err(|e: arrow::error::ArrowError| ArrowError::Internal(e.to_string()))?;
        writer.write(&batch)
            .map_err(|e: arrow::error::ArrowError| ArrowError::Internal(e.to_string()))?;
        writer.finish()
            .map_err(|e: arrow::error::ArrowError| ArrowError::Internal(e.to_string()))?;
    }

    Ok(buffer)
}
