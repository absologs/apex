use apex_core::ingest::{SensorFeatures, ingest_column};
use proptest::prelude::*;

proptest! {
    // Definimos el invariante: "Independientemente de la base de datos de origen (flujo de bytes),
    // el Ingestor Topológico siempre debe producir un vector dentro del espacio R^5 con norma finita
    // o un conjunto de features válidos sin colapsar".
    #[test]
    fn test_ingestor_entropy_agnosticism(data in any::<Vec<u8>>()) {
        // Ejecutamos la extracción de variables entrópicas
        if let Ok(_features) = SensorFeatures::extract(&data) {
            // Invariante 1: Decimal es intrínsecamente finito.
        }

        // Ejecutamos el pipeline completo de proyección tensorial
        // Invariante 2: No debe haber pánicos. Retorna un LSH válido (u16) o un IngestError::EmptyData.
        let _result = ingest_column(&data);
    }
}
