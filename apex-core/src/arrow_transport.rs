use crate::nodes::{Infraestructura, Producto};
use crate::playbook::TransformError;
use arrow::array::{Decimal128Builder, StringBuilder, UInt32Builder};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::ipc::writer::StreamWriter;
use arrow::record_batch::RecordBatch;
use std::collections::HashMap;
use std::sync::Arc;

#[derive(Debug)]
pub enum ArrowError {
    SchemaMismatch,
    Internal(String),
    Transform(TransformError),
}

pub fn get_apex_schema() -> Arc<Schema> {
    Arc::new(Schema::new(vec![
        Field::new("sku_id", DataType::Utf8, false),
        Field::new("costo_reposicion", DataType::Decimal128(38, 28), false),
        Field::new("precio_actual", DataType::Decimal128(38, 28), false),
        Field::new("velocidad_salida", DataType::Decimal128(38, 28), false),
        Field::new("stock_actual", DataType::UInt32, false),
        Field::new("tiempo_estancia", DataType::UInt32, false),
    ]))
}

pub fn inventory_to_arrow_ipc(
    inventory: &HashMap<String, (Producto, Infraestructura)>,
) -> Result<Vec<u8>, ArrowError> {
    let schema = get_apex_schema();

    let mut sku_builder = StringBuilder::new();
    let mut costo_builder = Decimal128Builder::new();
    let mut precio_builder = Decimal128Builder::new();
    let mut velocidad_builder = Decimal128Builder::new();
    let mut stock_builder = UInt32Builder::new();
    let mut estancia_builder = UInt32Builder::new();

    for (sku, (prod, infra)) in inventory {
        sku_builder.append_value(sku);

        let to_i128 = |d: rust_decimal::Decimal| -> i128 {
            let mantissa = d.mantissa();
            let scale = d.scale() as i32;
            let target_scale = 28;

            if target_scale >= scale {
                mantissa * 10i128.pow((target_scale - scale) as u32)
            } else {
                mantissa / 10i128.pow((scale - target_scale) as u32)
            }
        };

        costo_builder.append_value(to_i128(prod.costo_reposicion_esperado));
        precio_builder.append_value(to_i128(prod.precio_actual));
        velocidad_builder.append_value(to_i128(prod.velocidad_salida));
        stock_builder.append_value(infra.stock_actual);
        estancia_builder.append_value(infra.tiempo_estancia);
    }

    let batch = RecordBatch::try_new(
        schema.clone(),
        vec![
            Arc::new(sku_builder.finish()),
            Arc::new(costo_builder.finish()),
            Arc::new(precio_builder.finish()),
            Arc::new(velocidad_builder.finish()),
            Arc::new(stock_builder.finish()),
            Arc::new(estancia_builder.finish()),
        ],
    )
    .map_err(|e| ArrowError::Internal(e.to_string()))?;

    let mut buffer = Vec::new();
    {
        let mut writer = StreamWriter::try_new(&mut buffer, &schema)
            .map_err(|e| ArrowError::Internal(e.to_string()))?;
        writer
            .write(&batch)
            .map_err(|e| ArrowError::Internal(e.to_string()))?;
        writer
            .finish()
            .map_err(|e| ArrowError::Internal(e.to_string()))?;
    }

    Ok(buffer)
}
