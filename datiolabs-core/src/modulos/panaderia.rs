use crate::capacidades::{ErrorNegocio, validar_vigencia};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

/// Lote de horneado: unidad de trazabilidad perecedera de la panaderia.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Lote {
    pub id: String,
    pub sku: String,
    pub horneado_unix: i64,
    #[serde(with = "rust_decimal::serde::str")]
    pub cantidad_inicial: Decimal,
    #[serde(with = "rust_decimal::serde::str")]
    pub disponible: Decimal,
    pub caduce_unix: i64,
}

/// Libro de lotes en topologia Struct-of-Arrays: columnas contiguas para el
/// barrido FEFO sin desreferenciacion por fila.
#[derive(Debug, Clone, Default)]
pub struct LibroLotes {
    ids: Vec<String>,
    skus: Vec<String>,
    disponibles: Vec<Decimal>,
    caduces_unix: Vec<i64>,
}

impl LibroLotes {
    pub fn nuevo() -> Self {
        Self::default()
    }

    pub fn insertar(&mut self, lote: Lote) {
        self.ids.push(lote.id);
        self.skus.push(lote.sku);
        self.disponibles.push(lote.disponible);
        self.caduces_unix.push(lote.caduce_unix);
    }

    pub fn len(&self) -> usize {
        self.ids.len()
    }

    pub fn is_empty(&self) -> bool {
        self.ids.is_empty()
    }

    /// First-Expired-First-Out: primer lote vigente con stock para el sku.
    /// Barrido de columna pura, cero allocaciones.
    pub fn lote_fefo(&self, sku: &str, ahora_unix: i64) -> Option<usize> {
        let mut elegido = None;
        for idx in 0..self.ids.len() {
            if !self.skus[idx].eq(sku) || self.disponibles[idx] <= Decimal::ZERO {
                continue;
            }
            if self.caduces_unix[idx] <= ahora_unix {
                continue;
            }
            match elegido {
                Some(actual) if self.caduces_unix[actual] <= self.caduces_unix[idx] => {}
                _ => elegido = Some(idx),
            }
        }
        elegido
    }

    pub fn disponible(&self, idx: usize) -> Decimal {
        self.disponibles[idx]
    }

    pub fn id(&self, idx: usize) -> &str {
        &self.ids[idx]
    }

    pub fn par_disponible_por_id(&self, id: &str) -> Option<(String, Decimal)> {
        self.ids
            .iter()
            .position(|i| i == id)
            .map(|idx| (self.ids[idx].clone(), self.disponibles[idx]))
    }

    /// Descuento FEFO multi-lote. Devuelve los lotes tocados para auditoria.
    pub fn descontar_fefo(
        &mut self,
        sku: &str,
        mut cantidad: Decimal,
        ahora_unix: i64,
    ) -> Result<Vec<(String, Decimal)>, ErrorNegocio> {
        let mut tocados = Vec::new();
        while cantidad > Decimal::ZERO {
            let idx = self
                .lote_fefo(sku, ahora_unix)
                .ok_or(ErrorNegocio::StockInsuficiente {
                    disponible: Decimal::ZERO,
                    solicitado: cantidad,
                })?;
            validar_vigencia(self.caduces_unix[idx], ahora_unix)?;
            let toma = cantidad.min(self.disponibles[idx]);
            self.disponibles[idx] -= toma;
            cantidad -= toma;
            tocados.push((self.ids[idx].clone(), toma));
        }
        Ok(tocados)
    }

    /// Merma: retiro perecedero sin contraprestacion de venta.
    pub fn registrar_merma(
        &mut self,
        lote_id: &str,
        cantidad: Decimal,
    ) -> Result<Decimal, ErrorNegocio> {
        let idx = self
            .ids
            .iter()
            .position(|i| i == lote_id)
            .ok_or(ErrorNegocio::ProductoInexistente)?;
        if cantidad <= Decimal::ZERO || self.disponibles[idx] < cantidad {
            return Err(ErrorNegocio::StockInsuficiente {
                disponible: self.disponibles[idx],
                solicitado: cantidad,
            });
        }
        self.disponibles[idx] -= cantidad;
        Ok(self.disponibles[idx])
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rust_decimal_macros::dec;

    fn libro() -> LibroLotes {
        let mut l = LibroLotes::nuevo();
        l.insertar(Lote {
            id: "L1".into(),
            sku: "PAN".into(),
            horneado_unix: 100,
            cantidad_inicial: dec!(10),
            disponible: dec!(10),
            caduce_unix: 300,
        });
        l.insertar(Lote {
            id: "L2".into(),
            sku: "PAN".into(),
            horneado_unix: 150,
            cantidad_inicial: dec!(8),
            disponible: dec!(8),
            caduce_unix: 200,
        });
        l
    }

    #[test]
    fn fefo_elige_vencimiento_mas_proximo_y_vigente() {
        let l = libro();
        assert_eq!(l.lote_fefo("PAN", 150), Some(1));
        assert_eq!(l.lote_fefo("PAN", 199), Some(1));
        assert_eq!(l.lote_fefo("PAN", 200), Some(0));
        assert_eq!(l.lote_fefo("PAN", 300), None);
    }

    #[test]
    fn descuento_multi_lote_en_orden_fefo() {
        let mut l = libro();
        let tocados = l.descontar_fefo("PAN", dec!(9), 150).unwrap();
        assert_eq!(tocados.len(), 2);
        assert_eq!(tocados[0], ("L2".to_string(), dec!(8)));
        assert_eq!(tocados[1], ("L1".to_string(), dec!(1)));
        assert_eq!(l.disponible(1), Decimal::ZERO);
        assert_eq!(l.disponible(0), dec!(9));
    }

    #[test]
    fn merma_resta_del_lote_indicado() {
        let mut l = libro();
        let restante = l.registrar_merma("L1", dec!(4)).unwrap();
        assert_eq!(restante, dec!(6));
        assert!(l.registrar_merma("LX", dec!(1)).is_err());
        assert!(l.registrar_merma("L1", dec!(99)).is_err());
    }
}
