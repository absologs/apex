# APEX v1.0: Arquitectura, Matemática Tensorial y Trade-Offs
**Fecha:** 8 de Marzo, 2026
**Ubicación Objetivo:** Venezuela (Entorno de Alta Entropía Bimonetaria)
**Roles Documentados:** Product Manager, SWE Senior (Rust), Quant Finance Consultant, Data Engineer

---

## 1. TESIS FUNDAMENTAL (El "Alpha" del Proyecto)
**Apex** es un motor de Inferencia Económica y Optimización Dinámica de Precios (Dynamic Pricing) Local-First.

**El Diagnóstico Objetivo:** El mercado mitiga la hiperinflación mediante la creación de un "Forward Sintético" empírico (calcular toda la tienda con una tasa de cambio artificialmente alta). Esta aproximación escalar global es topológicamente ineficiente: protege el margen teórico, pero aniquila la velocidad del flujo de caja en bienes inelásticos y subestima el riesgo temporal en bienes de baja rotación. 

**La Premisa Computacional:** Apex sustituye esta heurística escalar global por un cálculo termodinámico descentralizado basado en Nodos Planos ortogonales. El objetivo es maximizar la velocidad de extracción de liquidez del mercado ($v_s$) sin cruzar la frontera de ruina dictada por el estancamiento volumétrico y el costo de reposición local.

---

## 2. ARQUITECTURA MATEMÁTICA (Motor de Eventos de Intersección)

El sistema abandona cálculos escalares complejos a favor de un Diseño Orientado a Datos puro y una topología termodinámica plana, desacoplada en tres subdominios ortogonales: Producto (Activo), Infraestructura (Inercia) y Logística Plana (Propagación del tiempo).

### 2.1. Base Canónica Vectorial ($\mathbb{R}^5$)
Cada entidad base se proyecta algebraicamente sobre un espacio métrico $\mathbb{R}^5$ para permitir una vectorización SIMD agresiva de los componentes de negocio:
$$ \vec{E} = [v_1, v_2, v_3, v_4, v_5] = [\text{Inercia}, \text{Elasticidad}, \text{Densidad}, \text{Fricción}, \text{Gravedad}] $$

### 2.2. Drenaje Inercial y Freno Termodinámico (Marketplace)
La viabilidad del inventario se determina interceptando su velocidad vectorial con el desgaste de estancia $\tau$. Si $\tau > \tau_{lim}$ pero a la vez $v_s < v_{umb}$, la salud de flujo cruza a negativo. La heurística de rescate mueve automáticamente el SKU a un Marketplace (B2C/B2B), colapsando el precio actual ($P_{actual}$) estrictamente hasta el suelo crítico del costo de reposición esperado ($C_{repo}$), deteniendo así la sangría entrópica.

### 2.3. Divergencia Topológica y Ruptura Logística
El capital del sistema es protegido calculando una cobertura inercial instantánea: $C = \frac{S_a}{v_s}$ (Stock contra derivada de demanda). Si el tiempo de propagación externa (Lead Time) quiebra este escudo de cobertura ($L_t \ge C$), se dispara inmediatamente un pulso de alerta sistémica por quiebre de stock, mutando los umbrales de expansión y sugiriendo desaceleración.

---

## 3. ANÁLISIS DE TRADE-OFFS (Ingeniería de la Realidad)

La arquitectura acepta concesiones estructurales para garantizar la viabilidad computacional en hardware obsoleto y entornos no controlados.

1.  **Tres Nodos Planos vs. Volumetría Física:** El sistema repudia totalmente calcular volúmenes ($m^3$) o pesos físicos. Se asume topología nula en espacio para liberar caché en microprocesadores anticuados y delegar la carga al Data-Oriented Design (DoD).
2.  **Abstracción Financiera:** Se ignora la identidad física del lote. Se asume un motor asíncrono de Solo-Lectura sobre el sistema transaccional local, priorizando el descubrimiento del costo de reposición marginal por encima del cálculo exhaustivo (y usualmente defectuoso) de un LIFO/FIFO manual contable.
3.  **Economía Sumergida vs. Conservación de Masa:** La evasión o sustracción de caja rompe la ley de conservación. Este sistema delega toda esa fricción al término de inercia y fricción en $\mathbb{R}^5$. Se sacrifica la exactitud del balance contable exacto a favor de la supervivencia del flujo de caja.

---

## 4. INGENIERÍA DE DATOS Y PIPELINE (Rust + Tauri)

Arquitectura de ingesta de datos en estado de aislamiento (Read-Only Sentinel).

1.  **Arquitectura Edge Drivers:** Micro-binarios desacoplados (`driver-csv`) extraen deltas temporales del legacy y emiten estructuras serializadas en Rust al Core.
2.  **Alineación Termodinámica (Data-Oriented Design):** Las matrices se ubican de forma contigua para maximizar L1 Cache hit-rates. Prohibido el `branching` innecesario o recolección asíncrona inútil (Zero `tokio` in Core).
3.  **Low-Cost Compute:** Ejecución estricta con `rust_decimal` para exactitud monetaria de tipo algebraico. `cargo clippy` con advertencias como error para asegurar robustez extrema en terminales inestables.

---

## 5. SÍNTESIS DE LA INTERFAZ DE USUARIO (Zero Visual Load)

La interfaz gráfica (UI) ofusca el 100% de la arquitectura estocástica. Construida sobre Tauri, HTML, Tailwind CSS y Vanilla JS, entrega una experiencia inmersiva bloqueada en modo oscuro estricto con el precepto "Inteligencia Aumentada, Carga Cero".

* **Dashboard Ortogonal:** Paneles sin gráficos hiperbólicos. Proyección de flujos basados en los 3 Nodos Planos (Producto, Logística, Infraestructura).
* **Marketplace Integrado:** Permite a clientes (B2B, B2C) atacar dinámicamente las anomalías de inercia inyectando capital líquido en base al RBAC (Control de Acceso Basado en Roles).