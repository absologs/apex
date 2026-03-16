# APEX v1.0: Arquitectura, Matemática Tensorial y Trade-Offs
**Fecha:** 8 de Marzo, 2026
**Ubicación Objetivo:** El Tigre, Venezuela (Entorno de Alta Entropía Bimonetaria)
**Roles Documentados:** Product Manager, SWE Senior (Rust), Quant Finance Consultant

---

## 1. TESIS FUNDAMENTAL (El "Alpha" del Proyecto)
**Apex** es un motor de Inferencia Económica y Optimización Dinámica de Precios (Dynamic Pricing) Local-First.

**El Diagnóstico Objetivo:** El mercado mitiga la hiperinflación mediante la creación de un "Forward Sintético" empírico (calcular toda la tienda con una tasa de cambio artificialmente alta). Esta aproximación escalar global es topológicamente ineficiente: protege el margen teórico, pero aniquila la velocidad del flujo de caja en bienes inelásticos y subestima el riesgo temporal en bienes de baja rotación. 

**La Premisa Computacional:** Apex sustituye esta heurística escalar global por un cálculo tensorial discreto a nivel de SKU. El objetivo es maximizar la velocidad de extracción de liquidez del mercado ($V_{sales}$) sin cruzar la frontera estocástica de ruina (descapitalización por costo de reposición + entropía).

---

## 2. ARQUITECTURA MATEMÁTICA (El Motor Tensorial y Topológico)

La empresa se modela como una variedad topológica discreta $\mathcal{M}$. El estado de cada activo (lote) no es un escalar contable, sino un tensor de esfuerzo-energía financiera $T_{\mu\nu}$, sujeto a la curvatura dictada por un tensor métrico del mercado $g_{\mu\nu}$ (inflación, volatilidad cambiaria).

### 2.1. El Tensor de Lote Discreto ($T_{i,L}$)
Para el producto $i$ y el lote $L$, el estado de densidad y flujo de capital se define como:
$$T_{i,L} = \begin{bmatrix} Q_{inicial} & Q_{actual} \\ FX_{origen} & FX_{actual} \\ C_{USD} & C_{BS} \\ \Delta t_{estancia} & \epsilon_{entropia} \end{bmatrix}$$
Cualquier fluctuación antrópica (robo/merma, $\epsilon$) en un lote obsoleto altera asimétricamente la presión de reposición del subconjunto restante.

### 2.2. Problema de Optimización del Límite Inferior ($P_s$)
El "Precio de Supervivencia" no es un margen porcentual fijo. Es la solución a un problema de optimización con restricciones (Boundary Condition) en un proceso de salto-difusión. El límite inferior inquebrantable $P_{floor}^{(i)}$ para el producto $i$ en el instante $t$ se define rigurosamente como:
$$P_{floor}^{(i)}(t) = \inf \left\{ p \in \mathbb{R}^+ \mid \mathbb{E}^{\mathbb{Q}} \left[ \frac{p \cdot (1 - \mu_i)}{C_{repo}^{(i)}(t + \tau)} \right] \ge 1 + \mathcal{R} \right\}$$
Donde:
* $\mathbb{E}^{\mathbb{Q}}$: Valor esperado bajo la medida neutral al riesgo.
* $\tau$: Tiempo esperado de liquidación del inventario (inverso de la velocidad de venta).
* $C_{repo}^{(i)}(t+\tau)$: Costo de reposición estocástico en el tiempo de recompra.
* $\mu_i$: Coeficiente de fricción antrópica (merma) inferido algorítmicamente.
* $\mathcal{R}$: Prima de riesgo base del negocio operativo.

### 2.3. Divergencia Topológica del Activo (Salud de Liquidez $H$)
Se abandona el ROI estático. Se mide la divergencia del campo vectorial del capital $\nabla \cdot \vec{J}_c$. Operativamente, la salud $H(t)$ se calcula como:
$$H_i(t) = \frac{\partial V_{sales}^{(i)}}{\partial t} \cdot \left( \frac{P_{actual}^{(i)} - C_{repo}^{(i)}}{C_{repo}^{(i)}} \right) \cdot \frac{1}{\pi_{inflacion}}$$
Si $H_i(t) \le 0$, la derivada del flujo de caja real es negativa. El activo es un sumidero de liquidez. Acción estrictamente determinista: Liquidación al valor $P_{floor}$.

---

## 3. ANÁLISIS DE TRADE-OFFS (Ingeniería de la Realidad)

La arquitectura acepta concesiones estructurales para garantizar la viabilidad computacional en hardware obsoleto y entornos no controlados.

1.  **Abstracción Financiera vs. Logística Física:** Se ignora la identidad física del lote (Picking). Se asume una cola de prioridad basada en optimización de margen (LIFO financiero). Sacrificio de trazabilidad operativa por precisión algorítmica de rentabilidad.
2.  **Discretización vs. Continuidad Tensorial:** El cálculo diferencial falla ante matrices dispersas (Sparse Data de ventas de retail). Se implementa un Filtro de Kalman Financiero para actualizar el estado del sistema mediante pasos discretos predictivos.
3.  **Fricción de Adopción vs. Integridad del Oráculo:** Se prohíbe la integración automatizada sin una "Auditoría Cero" manual. Se sacrifica la velocidad de cierre de ventas B2B para evitar la ingestión de datos corruptos que inhabilitarían el modelo matemático.
4.  **Economía Sumergida vs. Conservación de Masa:** La evasión o sustracción de caja rompe la ley de conservación del tensor. El modelo infiere esta discrepancia como $\mu_i$ (Entropía) y encarece silenciosamente $P_{floor}$. Se sacrifica la exactitud del balance contable a favor de la supervivencia del flujo de caja libre.
5.  **Volumen de Mercado vs. Rigor (Scale-up Model):** Se sacrifica el Mercado Total Direccionable (TAM) de software masivo freemium. El software no se vende a cualquiera; se exige un protocolo de adopción (Auditoría Cero). Esto minimiza el costo de soporte técnico por mala utilización y maximiza el LTV (Life-Time Value) por cliente mediante un alto rigor institucional aplicable a cualquier negocio.

---

## 4. INGENIERÍA DE DATOS Y PIPELINE (Rust + Tauri)

Arquitectura de ingesta de datos en estado de aislamiento (Read-Only Sentinel).

1.  **Arquitectura Edge Drivers:** Micro-binarios desacoplados (`driver_origin.exe`) extraen deltas temporales del legacy y emiten JSON estandarizado al Core.
2.  **Hashing Inmutable de Estado:** Integridad criptográfica mediante `SHA-256` por transacción. Las mutaciones ex-post en el legacy origen son categorizadas como violaciones de entropía.
3.  **Válvula de Cuarentena:** Vectores irracionales (`Costo <= 0`, o incoherencias temporales) son truncados del cálculo tensorial. El Oráculo ensancha el Corredor de Supervivencia asumiendo varianza infinita sobre el nodo ciego.
4.  **Low-Cost Compute:** Ejecución en Rust utilizando `mmap` y SIMD vectorization. Consumo de RAM restringido a <20MB para un procesamiento de 10,000 SKUs.

---

## 5. SÍNTESIS DE LA INTERFAZ DE USUARIO (Zero Visual Load)

La interfaz gráfica (UI) ofusca el 100% de la arquitectura estocástica. Construida sobre Tauri, HTML, Tailwind CSS y Vanilla JS, entrega una experiencia inmersiva "Premium Bento Box" bloqueada en modo oscuro estricto. Transforma métricas contables en directivas quirúrgicas de Data-Driven Decision Making (DDMM).

* **Defensa de Margen (Dashboard):** Paneles de alto contraste muestran la salud de liquidez ($H(t)$) e ingresos totales.
* **Maniobra Táctica (War Room):** Simulador de elasticidad con proyección de "Riesgo de Ruina" y recibos tipo "Contrato Inteligente" con alineación matemática estricta ($P_{floor}$).
* **Ingesta Cero:** Bloqueo operativo ("Estado 0") hasta que no se valide criptográficamente la inyección de la base de datos legacy, protegiendo al Oráculo de entropía.