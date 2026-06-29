use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

/// Base Canónica Vectorial en R^5
/// Representa [Inercia, Elasticidad, Densidad, Fricción, Gravedad]
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct VectorR5 {
    pub inercia: Decimal,
    pub elasticidad: Decimal,
    pub densidad: Decimal,
    pub friccion: Decimal,
    pub gravedad: Decimal,
}

impl Default for VectorR5 {
    fn default() -> Self {
        Self::new()
    }
}

impl VectorR5 {
    pub fn new() -> Self {
        Self {
            inercia: Decimal::ZERO,
            elasticidad: Decimal::ZERO,
            densidad: Decimal::ZERO,
            friccion: Decimal::ZERO,
            gravedad: Decimal::ZERO,
        }
    }

    /// Retorna el vector como un arreglo estático para iteraciones eficientes
    pub fn as_array(&self) -> [Decimal; 5] {
        [
            self.inercia,
            self.elasticidad,
            self.densidad,
            self.friccion,
            self.gravedad,
        ]
    }
}
