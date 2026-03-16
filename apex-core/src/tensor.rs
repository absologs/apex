use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

/// $T_{i,L}$ - Tensor de Lote
/// Representa el estado inmutable y topológico de un lote específico.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LotTensor {
    pub lote_id: String,
    pub product_id: String, // Identificador del Producto (SKU)

    pub q_inicial: Decimal, // Cantidad original
    pub q_actual: Decimal,  // Cantidad remanente real

    pub fx_origen: Decimal, // Tipo de cambio al momento de compra
    pub fx_actual: Decimal, // Tipo de cambio al momento de valuación

    pub c_usd: Decimal, // Costo original en Moneda Dura
    pub c_bs: Decimal,  // Costo original en Moneda Local

    pub delta_tiempo_dias: Decimal, // Días transcurridos desde ingreso
    pub epsilon_entropia: Decimal,  // Fricción inferida (robos, mermas detectadas en este lote)
}

impl LotTensor {
    /// Crea un nuevo Tensor que mantiene su identidad aislada.
    pub fn new(
        lote_id: String,
        product_id: String,
        q_inicial: Decimal,
        fx_origen: Decimal,
        c_usd: Decimal,
    ) -> Self {
        Self {
            lote_id,
            product_id,
            q_inicial,
            q_actual: q_inicial,
            fx_origen,
            fx_actual: fx_origen,
            c_usd,
            c_bs: c_usd * fx_origen,
            delta_tiempo_dias: Decimal::ZERO,
            epsilon_entropia: Decimal::ZERO,
        }
    }
}
