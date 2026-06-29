use crate::nodes::{Infraestructura, Logistica, Producto};
use rust_decimal::Decimal;

#[derive(Debug, Clone, PartialEq)]
pub enum EngineError {
    MathError,
}

#[derive(Debug, Clone, PartialEq)]
pub enum AccionEngine {
    MoverAMarketplace {
        sku_id: String,
        precio_descuento: Decimal,
    },
    AlertaQuiebreStock {
        sku_id: String,
    },
    SugerenciaCombo {
        sku_principal: String,
        sku_correlacionado: String,
    },
}

pub trait MotorInterseccion {
    /// Evalúa la liberación de stock hacia el Marketplace
    fn evaluar_liberacion_stock(
        producto: &Producto,
        infraestructura: &Infraestructura,
        umbral_velocidad: Decimal,
        limite_estancia: u32,
    ) -> Result<Option<AccionEngine>, EngineError>;

    /// Evalúa la reducción de costos y posibles quiebres de stock
    fn evaluar_reduccion_costos(
        producto: &Producto,
        infraestructura: &Infraestructura,
        logistica: &Logistica,
    ) -> Result<Option<AccionEngine>, EngineError>;

    /// Evalúa oportunidades de combos dinámicos basados en correlación
    fn evaluar_correlacion(
        producto_a: &Producto,
        producto_b: &Producto,
        umbral_correlacion: Decimal,
        correlacion_actual: Decimal,
    ) -> Result<Option<AccionEngine>, EngineError>;
}

pub struct MotorApex;

impl MotorInterseccion for MotorApex {
    fn evaluar_liberacion_stock(
        producto: &Producto,
        infraestructura: &Infraestructura,
        umbral_velocidad: Decimal,
        limite_estancia: u32,
    ) -> Result<Option<AccionEngine>, EngineError> {
        if producto.velocidad_salida < umbral_velocidad
            && infraestructura.tiempo_estancia > limite_estancia
        {
            Ok(Some(AccionEngine::MoverAMarketplace {
                sku_id: producto.sku_id.clone(),
                precio_descuento: producto.costo_reposicion_esperado,
            }))
        } else {
            Ok(None)
        }
    }

    fn evaluar_reduccion_costos(
        producto: &Producto,
        infraestructura: &Infraestructura,
        logistica: &Logistica,
    ) -> Result<Option<AccionEngine>, EngineError> {
        if producto.velocidad_salida > Decimal::ZERO {
            let stock_dec = Decimal::from(infraestructura.stock_actual);
            let dias_cobertura = stock_dec
                .checked_div(producto.velocidad_salida)
                .ok_or(EngineError::MathError)?;

            let lead_time_dec = Decimal::from(logistica.lead_time_proveedor);

            if lead_time_dec >= dias_cobertura {
                return Ok(Some(AccionEngine::AlertaQuiebreStock {
                    sku_id: producto.sku_id.clone(),
                }));
            }
        }
        Ok(None)
    }

    fn evaluar_correlacion(
        producto_a: &Producto,
        producto_b: &Producto,
        umbral_correlacion: Decimal,
        correlacion_actual: Decimal,
    ) -> Result<Option<AccionEngine>, EngineError> {
        if correlacion_actual >= umbral_correlacion {
            Ok(Some(AccionEngine::SugerenciaCombo {
                sku_principal: producto_a.sku_id.clone(),
                sku_correlacionado: producto_b.sku_id.clone(),
            }))
        } else {
            Ok(None)
        }
    }
}
