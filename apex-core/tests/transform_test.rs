use apex_core::playbook::{DataFrameView, Playbook, TransformOp, execute_playbook};
use std::collections::HashMap;

#[test]
fn test_deterministic_transform_pipeline() {
    // 1. Construir un set de datos altamente entrópico (sucio) en memoria
    let mut row1 = HashMap::new();
    row1.insert("sku".to_string(), "  prod-001  ".to_string());
    row1.insert("qty".to_string(), " 10".to_string());
    row1.insert("category".to_string(), "".to_string()); // Vacío

    let mut row2 = HashMap::new();
    row2.insert("sku".to_string(), "prod-002".to_string());
    row2.insert("qty".to_string(), "texto_invalido".to_string()); // Corrupto
    // "category" está completamente ausente en esta fila

    let raw_data = DataFrameView {
        rows: vec![row1, row2],
    };

    // 2. Definir la Receta (Playbook) AST
    let playbook = Playbook {
        operations: vec![
            TransformOp::TrimWhitespace("sku".to_string()),
            TransformOp::Uppercase("sku".to_string()),
            TransformOp::CastToInteger {
                col: "qty".to_string(),
                fallback: 0,
            },
            TransformOp::FillNull {
                col: "category".to_string(),
                default_value: "GENERAL".to_string(),
            },
            TransformOp::MergeColumns {
                col_a: "sku".to_string(),
                col_b: "category".to_string(),
                separator: "_".to_string(),
                target: "composite_id".to_string(),
            },
        ],
    };

    // 3. Primer Pase (Simulando Ingesta)
    let clean_data_1 = execute_playbook(&raw_data, &playbook).expect("El motor no debe colapsar");

    // Verificación Empírica de Comportamiento Determínistico
    let r1 = &clean_data_1.rows[0];
    assert_eq!(r1.get("sku").unwrap(), "PROD-001");
    assert_eq!(
        r1.get("qty").unwrap(),
        "10",
        "Debe parsear ignorando espacios"
    );
    assert_eq!(r1.get("category").unwrap(), "GENERAL", "Debe llenar vacíos");
    assert_eq!(r1.get("composite_id").unwrap(), "PROD-001_GENERAL");

    let r2 = &clean_data_1.rows[1];
    assert_eq!(r2.get("sku").unwrap(), "PROD-002");
    assert_eq!(
        r2.get("qty").unwrap(),
        "0",
        "Corrupción de tipo debe caer en fallback determinista (0)"
    );
    assert_eq!(
        r2.get("category").unwrap(),
        "GENERAL",
        "Debe llenar ausentes (null)"
    );
    assert_eq!(r2.get("composite_id").unwrap(), "PROD-002_GENERAL");

    // 4. Segundo Pase ("Time-Travel" reproduciendo exactamente el mismo estado)
    let clean_data_2 = execute_playbook(&raw_data, &playbook).expect("El motor no debe colapsar");

    // 5. Corroborar Invariante Fundamental: Determinismo Absoluto
    assert_eq!(
        clean_data_1, clean_data_2,
        "ERROR CRÍTICO: La transformación no fue estrictamente reproducible (falló comprobación Time-Travel)"
    );
}
