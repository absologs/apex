use apex_core::playbook::{Playbook, TransformOp, execute_playbook};
use arrow::array::Array;
use arrow::array::{StringArray, as_primitive_array, as_string_array};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::record_batch::RecordBatch;
use std::sync::Arc;

#[test]
fn test_deterministic_transform_pipeline() {
    // 1. Construir un RecordBatch altamente entrópico (sucio)
    let schema = Arc::new(Schema::new(vec![
        Field::new("sku", DataType::Utf8, false),
        Field::new("qty", DataType::Utf8, true), // Debe ser true porque el cast generará nulls
        Field::new("category", DataType::Utf8, true),
    ]));

    let sku_array = StringArray::from(vec!["  prod-001  ", "prod-002"]);
    let qty_array = StringArray::from(vec![" 10", "texto_invalido"]);
    let cat_array = StringArray::from(vec![Some(""), None]);

    let raw_batch = RecordBatch::try_new(
        schema.clone(),
        vec![
            Arc::new(sku_array),
            Arc::new(qty_array),
            Arc::new(cat_array),
        ],
    )
    .unwrap();

    // 2. Definir la Receta (Playbook) AST
    let playbook = Playbook {
        operations: vec![
            TransformOp::TrimWhitespace("sku".to_string()),
            TransformOp::Uppercase("sku".to_string()),
            TransformOp::CastToInteger("qty".to_string()),
        ],
    };

    // 3. Primer Pase (Simulando Ingesta)
    let clean_batch_1 = execute_playbook(&raw_batch, &playbook).expect("El motor no debe colapsar");

    // Verificación Empírica de Comportamiento Determínistico
    let sku_res = as_string_array(clean_batch_1.column(0));
    assert_eq!(sku_res.value(0), "PROD-001");
    assert_eq!(sku_res.value(1), "PROD-002");

    let qty_res = as_primitive_array::<arrow::datatypes::Int64Type>(clean_batch_1.column(1));
    assert_eq!(qty_res.value(0), 10);
    assert!(
        qty_res.is_null(1),
        "Error de casteo debe resultar en null según kernel de Arrow"
    );

    // 4. Segundo Pase ("Time-Travel")
    let clean_batch_2 = execute_playbook(&raw_batch, &playbook).expect("El motor no debe colapsar");

    // 5. Corroborar Invariante Fundamental: Determinismo Absoluto
    assert_eq!(
        clean_batch_1, clean_batch_2,
        "ERROR CRÍTICO: La transformación no fue estrictamente reproducible"
    );
}

#[test]
fn test_large_stream_memory_efficiency_conceptual() {
    // Construimos un lote "grande" (100k filas) para validar que el motor columnar es eficiente
    let num_rows = 100_000;
    let schema = Arc::new(Schema::new(vec![Field::new("sku", DataType::Utf8, false)]));

    let skus: Vec<String> = (0..num_rows).map(|i| format!(" prod-{:06} ", i)).collect();
    let sku_array = StringArray::from(skus);

    let batch = RecordBatch::try_new(schema.clone(), vec![Arc::new(sku_array)]).unwrap();

    let playbook = Playbook {
        operations: vec![
            TransformOp::TrimWhitespace("sku".to_string()),
            TransformOp::Uppercase("sku".to_string()),
        ],
    };

    // El procesamiento es por columnas, saturando la caché
    let clean_batch = execute_playbook(&batch, &playbook).unwrap();

    let res = as_string_array(clean_batch.column(0));
    assert_eq!(res.value(0), "PROD-000000");
    assert_eq!(res.len(), num_rows);
}
