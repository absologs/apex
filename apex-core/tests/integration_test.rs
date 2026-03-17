use apex_core::ingest::UniversalIngester;
use apex_core::oracle::Oracle;
use rust_decimal::Decimal;
use std::collections::HashMap;

#[test]
fn test_oracle_survival_price_normal() {
    let price = Oracle::calcular_precio_supervivencia(
        Decimal::new(100, 0),
        Decimal::new(5, 2),
        Decimal::new(30, 0),
        Decimal::new(10, 0),
        Decimal::new(2, 2),
    )
    .unwrap();
    assert!(price > Decimal::ZERO);
}

#[test]
fn test_oracle_survival_price_singularidad() {
    let price = Oracle::calcular_precio_supervivencia(
        Decimal::new(100, 0),
        Decimal::new(5, 2),
        Decimal::new(30, 0),
        Decimal::new(10, 0),
        Decimal::new(100, 2),
    );
    assert!(price.is_none());
}

#[test]
fn test_salud_topologica_activa() {
    let health = Oracle::calcular_salud_topologica(
        Decimal::new(5, 0),
        Decimal::new(20, 0),
        Decimal::new(10, 0),
        Decimal::new(1, 2),
    )
    .unwrap();
    assert!(health > Decimal::ZERO);
}

#[test]
fn test_universal_ingester_schema_inference() {
    let headers = vec![
        "id_producto".to_string(),
        "cantidad".to_string(),
        "precio_venta".to_string(),
        "costo_compra".to_string(),
        "fecha".to_string(),
        "basura_legacy".to_string(),
    ];
    let schema = UniversalIngester::infer_schema(&headers);
    assert!(schema.product_id_col.is_some());
    assert!(schema.qty_col.is_some());
    assert!(schema.price_col.is_some());
    assert!(schema.cost_col.is_some());
    assert!(schema.date_col.is_some());
    assert_eq!(schema.unmapped_columns.len(), 1);
}

#[test]
fn test_universal_ingester_audit() {
    let headers = vec!["sku".to_string(), "qty".to_string(), "price".to_string()];
    let schema = UniversalIngester::infer_schema(&headers);

    let mut rec1 = HashMap::new();
    rec1.insert("sku".to_string(), "PROD-1".to_string());
    rec1.insert("qty".to_string(), "10".to_string());
    rec1.insert("price".to_string(), "100.50".to_string());

    let mut rec2 = HashMap::new();
    rec2.insert("sku".to_string(), "".to_string()); // Anomalía: SKU vacío
    rec2.insert("qty".to_string(), "10a".to_string()); // Anomalía: Qty no numérica
    rec2.insert("price".to_string(), "$100".to_string()); // Anomalía: Precio con $

    let report = UniversalIngester::audit_data_batch(&schema, &[rec1, rec2]);
    assert_eq!(report.anomalies_detected.len(), 3);
    assert!(!report.is_ready_for_ingestion);
}

#[test]
fn test_agnostic_ingestion_pipeline() {
    let data1 = b"sku_123\nsku_124\nsku_125\nsku_126\n";
    // Mismos datos, determinismo absoluto
    let data1_copy = b"sku_123\nsku_124\nsku_125\nsku_126\n";
    // Datos similares pero con una ligera variación
    let data2 = b"sku_123\nsku_124\nsku_125\nsku_999\n";
    // Datos completamente diferentes (números y distinta longitud)
    let data3 = b"10.5\n20.1\n15.0\n42.3\n100.0\n99.9\n";

    let hash1 = apex_core::ingest::ingest_column(data1).unwrap();
    let hash1_copy = apex_core::ingest::ingest_column(data1_copy).unwrap();
    let hash2 = apex_core::ingest::ingest_column(data2).unwrap();
    let hash3 = apex_core::ingest::ingest_column(data3).unwrap();

    // 1. Determinismo Absoluto (hashes bit a bit idénticos)
    assert_eq!(
        hash1, hash1_copy,
        "Determinismo falló: los hashes deben ser idénticos para el mismo input"
    );

    // 2. Tensores/Hashes cercanos para datos similares (Distancia de Hamming baja)
    let hamming_distance_sim = (hash1 ^ hash2).count_ones();
    let hamming_distance_diff = (hash1 ^ hash3).count_ones();

    println!("Hamming(data1, data2) = {}", hamming_distance_sim);
    println!("Hamming(data1, data3) = {}", hamming_distance_diff);

    // Debido a LSH, datos similares deberían tener menor o igual distancia que datos diferentes.
    assert!(
        hamming_distance_sim <= hamming_distance_diff,
        "La distancia topológica debe reflejar similitud semántica"
    );
}
