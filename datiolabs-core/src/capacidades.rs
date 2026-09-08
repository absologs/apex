use rust_decimal::Decimal;
use thiserror::Error;

pub const RUBRO_ABASTO: u16 = 1 << 0;
pub const RUBRO_PANADERIA: u16 = 1 << 1;
pub const RUBRO_LICORERIA: u16 = 1 << 2;
pub const RUBRO_RETAIL: u16 = 1 << 3;

pub const CAP_UNITARIA: u16 = 1 << 0;
pub const CAP_PESABLE: u16 = 1 << 1;
pub const CAP_PERECEDERO: u16 = 1 << 2;
pub const CAP_CUENTA_ABIERTA: u16 = 1 << 3;
pub const CAP_SERIE: u16 = 1 << 4;
pub const CAP_VARIANTES: u16 = 1 << 5;
pub const CAP_GARANTIA: u16 = 1 << 6;
pub const CAP_COMISION: u16 = 1 << 7;

#[derive(Debug, Error, PartialEq)]
pub enum ErrorNegocio {
    #[error("producto inexistente en el catalogo")]
    ProductoInexistente,
    #[error("stock insuficiente: disponible {disponible}, solicitado {solicitado}")]
    StockInsuficiente {
        disponible: Decimal,
        solicitado: Decimal,
    },
    #[error("cantidad invalida para producto de venta unitaria: {0}")]
    CantidadNoUnitaria(Decimal),
    #[error("lote vencido: caduco en unix {caduco_unix}")]
    LoteVencido { caduco_unix: i64 },
    #[error("sku duplicado en el catalogo: {0}")]
    SkuDuplicado(String),
    #[error("capacidad no activa en la configuracion del negocio: bits solicitados {0:#010b}")]
    CapacidadInactiva(u16),
    #[error("el negocio ya esta inicializado")]
    YaInicializado,
    #[error("el negocio no ha sido inicializado")]
    NoInicializado,
    #[error("cuenta abierta inexistente o ya cerrada: {0}")]
    CuentaInvalida(String),
    #[error("pago insuficiente: requerido {requerido}, recibido {recibido}")]
    PagoInsuficiente {
        requerido: Decimal,
        recibido: Decimal,
    },
}

/// Deduplicacion por OR de bits: si dos rubros comparten una capacidad,
/// el resultado colapsa a un unico bit sin multiplicar registros.
pub const fn capacidades_de_rubros(rubros: u16) -> u16 {
    let mut caps = CAP_UNITARIA;
    if rubros & RUBRO_ABASTO != 0 {
        caps |= CAP_PESABLE;
    }
    if rubros & RUBRO_PANADERIA != 0 {
        caps |= CAP_PESABLE | CAP_PERECEDERO;
    }
    if rubros & RUBRO_LICORERIA != 0 {
        caps |= CAP_CUENTA_ABIERTA;
    }
    if rubros & RUBRO_RETAIL != 0 {
        caps |= CAP_SERIE | CAP_VARIANTES | CAP_GARANTIA | CAP_COMISION;
    }
    caps
}

pub const fn rubros_activos(rubros: u16) -> bool {
    rubros != 0
        && (rubros & !(RUBRO_ABASTO | RUBRO_PANADERIA | RUBRO_LICORERIA | RUBRO_RETAIL)) == 0
}

/// Validacion pura de una linea de venta contra las capacidades del producto.
/// `cantidad_disponible` proviene del indice SoA del catalogo; cero allocaciones.
pub fn validar_linea(
    capacidades: u16,
    cantidad: Decimal,
    stock_disponible: Decimal,
) -> Result<(), ErrorNegocio> {
    if cantidad <= Decimal::ZERO {
        return Err(ErrorNegocio::CantidadNoUnitaria(cantidad));
    }
    let es_unitaria = capacidades & CAP_PESABLE == 0;
    if es_unitaria && cantidad.fract() != Decimal::ZERO {
        return Err(ErrorNegocio::CantidadNoUnitaria(cantidad));
    }
    if stock_disponible < cantidad {
        return Err(ErrorNegocio::StockInsuficiente {
            disponible: stock_disponible,
            solicitado: cantidad,
        });
    }
    Ok(())
}

/// Verificacion de vigencia para productos perecederos gobernados por lote.
pub fn validar_vigencia(caduce_unix: i64, ahora_unix: i64) -> Result<(), ErrorNegocio> {
    if ahora_unix >= caduce_unix {
        return Err(ErrorNegocio::LoteVencido {
            caduco_unix: caduce_unix,
        });
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use rust_decimal_macros::dec;

    #[test]
    fn union_deduplica_capacidades_compartidas() {
        assert_eq!(
            capacidades_de_rubros(RUBRO_ABASTO),
            CAP_UNITARIA | CAP_PESABLE
        );
        let ambos = capacidades_de_rubros(RUBRO_ABASTO | RUBRO_PANADERIA);
        assert_eq!(ambos.count_ones(), 3);
        assert_eq!(ambos & CAP_PESABLE, CAP_PESABLE);
        let todos = capacidades_de_rubros(RUBRO_ABASTO | RUBRO_PANADERIA | RUBRO_LICORERIA);
        assert_eq!(todos.count_ones(), 4);
    }

    #[test]
    fn rubros_validos_solo_con_bits_conocidos() {
        assert!(rubros_activos(RUBRO_LICORERIA));
        assert!(rubros_activos(RUBRO_ABASTO | RUBRO_PANADERIA));
        assert!(!rubros_activos(0));
        assert!(!rubros_activos(0b1000_0000));
    }

    #[test]
    fn linea_unitaria_rechaza_fracciones_y_falta_stock() {
        let caps = CAP_UNITARIA;
        assert!(validar_linea(caps, dec!(3), dec!(10)).is_ok());
        assert_eq!(
            validar_linea(caps, dec!(1.5), dec!(10)),
            Err(ErrorNegocio::CantidadNoUnitaria(dec!(1.5)))
        );
        assert_eq!(
            validar_linea(caps, dec!(11), dec!(10)),
            Err(ErrorNegocio::StockInsuficiente {
                disponible: dec!(10),
                solicitado: dec!(11)
            })
        );
    }

    #[test]
    fn pesable_admite_fracciones() {
        assert!(validar_linea(CAP_PESABLE, dec!(0.750), dec!(5)).is_ok());
        assert!(validar_linea(CAP_UNITARIA, dec!(0), dec!(5)).is_err());
    }

    #[test]
    fn vigencia_bloquea_en_y_despues_del_limite() {
        assert!(validar_vigencia(2000, 1999).is_ok());
        assert_eq!(
            validar_vigencia(2000, 2000),
            Err(ErrorNegocio::LoteVencido { caduco_unix: 2000 })
        );
    }
}
