# Fundamentos Matemáticos de APEX (DoD-Grade)

Este documento compila de forma exhaustiva los modelos matemáticos y proyecciones algebraicas que fundamentan el motor de inferencia económica del sistema APEX, alineados estrictamente con su arquitectura de tres nodos planos.

---

## 1. Topología de Base: Espacio Métrico Vectorial $\mathbb{R}^5$

Se abandona la contabilidad escalar aislada. Toda entidad del sistema (como un Producto) se proyecta sobre un espacio métrico $\mathbb{R}^5$, formando un vector canónico $\vec{E}$:

$$
\vec{E} = \begin{bmatrix} v_1 \\ v_2 \\ v_3 \\ v_4 \\ v_5 \end{bmatrix} = \begin{bmatrix} Inercia \\ Elasticidad \\ Densidad \\ Fricción \\ Gravedad \end{bmatrix}
$$

Esta topología de cinco dimensiones permite operaciones SIMD nativas al abstraer el comportamiento financiero como desplazamientos en un espacio termodinámico continuo en lugar de simples contadores.

---

## 2. Reducción de Costos: Cálculo de Inercia y Ruptura Logística

El vector de inventario entra en estado de singularidad logística si el tiempo de propagación interseca de forma destructiva con la cobertura de inercia térmica (stock).

### Ecuación de Cobertura ($C$)
La inercia de cobertura en días se modela como el cociente de la masa estática sobre su derivada direccional (demanda):

$$
C = \frac{S_a}{v_s}
$$

Donde:
- $S_a$: `stock_actual` (Inercia estática física - Nodo de Infraestructura).
- $v_s$: `velocidad_salida` (Derivada direccional de demanda - Nodo de Producto).

### Condición Crítica de Ruptura (Alerta Logística)
El sistema genera un evento estocástico negativo de ruptura si el tiempo de retardo excede la cobertura inercial actual:

$$
L_t \ge C
$$

Donde $L_t$ representa el `lead_time_proveedor` extraído de la Logística Plana, operando como tensor de resistencia.

---

## 3. Liberación de Stock: Freno Termodinámico y Drenaje

Un activo (lote de SKU) exige una ruta de evacuación rápida hacia el Marketplace cuando su campo escalar de estancia (retención de capital en estante) entra en colisión directa con una grave desaceleración en el mercado local.

### Límite de Frontera Reactivo
Se establece la regla de intervención sistémica si confluyen de manera síncrona las siguientes dos barreras termodinámicas:
1. $v_s < v_{umb}$: La derivada de demanda (velocidad de salida actual) decae por debajo de la velocidad de umbral requerida para rentabilidad.
2. $\tau > \tau_{lim}$: El tiempo de estancia $\tau$ superó el límite energético máximo tolerable antes de incurrir en decaimiento radiactivo financiero.

**Resolución Algebraica:**
Se computa una transmutación determinista del `precio_actual` hacia el `costo_reposicion_esperado`, inyectando al SKU en una tubería de Marketplace con descuento de emergencia, forzando la recuperación absoluta del volumen de capital antes de su total congelamiento.

---

## 4. Correlación y Expansión Tensorial de Ticket

La frecuencia de co-ocurrencia transaccional genera una matriz de afinidad térmica entre pares de activos en el grafo del retail.

Si un producto en estado de entropía alta $A$ (estancado) y un producto activo $B$ (de altísima velocidad) cumplen la inecuación de proximidad térmica cruzada:

$$
\text{corr}(A, B) \ge \text{corr}_{umb}
$$

El motor termodinámico de APEX sintetizará un vector ortogonal transitorio (un "Combo" dinámico B2C/B2B), aprovechando el gradiente de liquidez del producto $B$ para succionar el flujo estancado del producto $A$, reduciendo drásticamente la fricción global del sistema y manteniendo a cero la necesidad de cálculos espaciales volumétricos.
