use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

/// Estructuras de Datos Orientadas a Datos (SoA - Struct of Arrays)
/// Diseñado para coalescencia de memoria y saturación de Cache L1 en bucles SIMD.

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct MarketplaceInventorySoA {
    pub item_ids: Vec<String>,
    pub base_prices: Vec<Decimal>,
    pub available_stocks: Vec<Decimal>,
    // Proyección R^5 descompuesta para vectorización contigua
    pub r5_inercia: Vec<Decimal>,
    pub r5_elasticidad: Vec<Decimal>,
    pub r5_densidad: Vec<Decimal>,
    pub r5_friccion: Vec<Decimal>,
    pub r5_gravedad: Vec<Decimal>,
}

impl MarketplaceInventorySoA {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn push_item(&mut self, id: String, price: Decimal, stock: Decimal, r5: [Decimal; 5]) {
        self.item_ids.push(id);
        self.base_prices.push(price);
        self.available_stocks.push(stock);
        self.r5_inercia.push(r5[0]);
        self.r5_elasticidad.push(r5[1]);
        self.r5_densidad.push(r5[2]);
        self.r5_friccion.push(r5[3]);
        self.r5_gravedad.push(r5[4]);
    }
}

/// Estado termodinámico de las transacciones (SoA)
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct MarketplaceTransactionsSoA {
    pub tx_ids: Vec<String>,
    pub customer_ids: Vec<String>,
    pub item_ids: Vec<String>,
    pub quantities: Vec<Decimal>,
    pub total_amounts: Vec<Decimal>,
    pub dispatch_margins_hours: Vec<u8>, // 0 a 48 horas
    pub is_layaway: Vec<bool>,           // Sistema de apartado
    pub sha256_signatures: Vec<String>,  // Inmutabilidad criptográfica (Regla GEMINI)
}

impl MarketplaceTransactionsSoA {
    pub fn new() -> Self {
        Self::default()
    }

    #[allow(clippy::too_many_arguments)]
    pub fn record_transaction(
        &mut self,
        tx_id: String,
        customer_id: String,
        item_id: String,
        qty: Decimal,
        amount: Decimal,
        dispatch: u8,
        layaway: bool,
        signature: String,
    ) -> Result<(), String> {
        if dispatch > 48 {
            return Err("Margen de despacho excede 48 horas permitidas.".into());
        }

        self.tx_ids.push(tx_id);
        self.customer_ids.push(customer_id);
        self.item_ids.push(item_id);
        self.quantities.push(qty);
        self.total_amounts.push(amount);
        self.dispatch_margins_hours.push(dispatch);
        self.is_layaway.push(layaway);
        self.sha256_signatures.push(signature);

        Ok(())
    }
}
