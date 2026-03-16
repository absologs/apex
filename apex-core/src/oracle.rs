use rust_decimal::Decimal;

/// El Oráculo - Motor de Cálculo Determinista
pub struct Oracle;

impl Oracle {
    /// Calcula el Precio de Supervivencia ($P_s$) para un lote o producto.
    /// P_s = (C_repo(t) * (1 + Phi_risk)^Delta_t + K_fijo) / (1 - mu_friccion)
    pub fn calcular_precio_supervivencia(
        c_repo: Decimal,       // Costo de reposición (instantáneo)
        phi_risk: Decimal,     // Volatilidad cambiaria / Riesgo
        delta_t_dias: Decimal, // Tiempo en inventario (Deterioro financiero)
        k_fijo: Decimal,       // Costos fijos atribuidos unitariamente
        mu_friccion: Decimal,  // Coeficiente de Entropía (Mermas/Robos)
    ) -> Option<Decimal> {
        let one = Decimal::ONE;

        if mu_friccion >= one {
            return None; // Singularidad matemática: La merma es del 100%, la reposición es imposible.
        }

        // Filtro Predictivo: Capitalización del riesgo usando math feature (Precisión exacta determinista)
        use rust_decimal::MathematicalOps;
        let risk_base = Decimal::ONE + phi_risk;
        let risk_multiplier = risk_base.powd(delta_t_dias);

        let numerador = (c_repo * risk_multiplier) + k_fijo;
        let denominador = one - mu_friccion;

        Some(numerador / denominador)
    }

    /// Calcula la Salud Topológica ($H(t)$) del activo.
    /// H(t) = (V_sales * Margin_real) / (T_held * pi_inflacion)
    pub fn calcular_salud_topologica(
        v_sales_velocity: Decimal,  // Unidades vendidas por día
        margin_real: Decimal,       // Margen absoluto en USD ($P_s$ - $C_repo$)
        t_held_dias: Decimal,       // Tiempo de retención estacionado
        pi_inflacion_rate: Decimal, // Inflación del periodo
    ) -> Option<Decimal> {
        if t_held_dias.is_zero() || pi_inflacion_rate.is_zero() {
            return None; // Evita división por cero en activos muy recientes (Aún no tienen masa inercial)
        }

        let numerador = v_sales_velocity * margin_real;
        let denominador = t_held_dias * pi_inflacion_rate;

        Some(numerador / denominador)
    }
}
