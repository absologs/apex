use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

// --- NODO 1: PRODUCTO ---
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Producto {
    pub sku_id: String,
    pub costo_reposicion_esperado: Decimal,
    pub precio_actual: Decimal,
    pub velocidad_salida: Decimal,
    pub cluster_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Categoria {
    pub categoria_id: String,
    pub nombre: String,
    pub friccion_base: Decimal, // Resistencia natural a la venta
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Variante {
    pub sku_id: String,
    pub atributo: String, // ej. "Talla", "Color"
    pub valor: String,
}

// --- NODO 2: INFRAESTRUCTURA ---
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Infraestructura {
    pub ubicacion_id: String,
    pub sku_id: String,
    pub tiempo_estancia: u32,
    pub stock_actual: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Estante {
    pub pasillo: String,
    pub seccion: String,
    pub densidad_maxima: u32, // Capacidad volumétrica plana
}

// --- NODO 3: LOGÍSTICA ---
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Logistica {
    pub sku_id: String,
    pub lead_time_proveedor: u32,
    pub tiempo_traslado_interno: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Proveedor {
    pub proveedor_id: String,
    pub confiabilidad_entrega: Decimal, // Escala 0.0 - 1.0 (Probabilidad de cumplir Lead Time)
    pub dias_credito: u32,
}

// --- NUEVO NODO: NÓMINA (Capital Humano) ---
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NominaOperador {
    pub operador_id: String,
    pub rol_tactico: String, // ej. "Cajero", "Almacenista"
    pub costo_hora_usd: Decimal,
    pub inercia_operativa: Decimal, // Tx por Hora (Velocidad de procesamiento)
}
