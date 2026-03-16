# APEX v1.0: Documento de Arquitectura y Estrategia (PRD Maestro)

## 1. Tesis del Problema y Oportunidad de Mercado (Visión B2B Enterprise)

**El Entorno:** Economías de alta entropía y depreciación asimétrica.
**La Ineficiencia Sistémica:** Para mitigar el riesgo inflacionario, el 99% de los negocios aplica una heurística defensiva arcaica: el "Forward Sintético" (calcular precios basados en una tasa de cambio futura arbitraria global, ej. usar 450 Bs cuando el Spot es 430 Bs).
* **Consecuencia:** Esta aplicación escalar estática genera subsidios cruzados masivos. Destruye la competitividad en bienes inelásticos (donde la demanda es hipersensible al precio) y descapitaliza al comerciante en bienes de baja rotación (donde la prima de riesgo se agota antes de la venta).
**La Solución:** Apex. Un motor de optimización matemática que sustituye la heurística estática por precios dinámicos vectorizados, permitiendo al cliente aniquilar a la competencia en productos ancla y maximizar márgenes en productos ciegos, sin riesgo de ruina.

---

## 2. Visión del Producto: "APEX"

**APEX** es un Sistema Cuantitativo de Soporte a Decisiones. Se acopla en modalidad "Read-Only" sobre bases de datos legacy ineficientes. Ingiere datos transaccionales, limpia la varianza, y procesa la información a través de tensores topológicos para devolver **Vectores Accionables**.

* **Cero Carga Cognitiva:** El cliente interactúa con directivas en lenguaje natural generadas por el modelo matemático (ej. "Ajustar precio de "Prodcuto" X a Y para mantener cobertura de liquidez").
* **Rigor en la Ingesta:** Apex obliga a una "Auditoría Cero". No asume la basura histórica del sistema legacy como verdad; exige un estado inicial limpio para inicializar los tensores.

---

## 3. Arquitectura Matemática (El Núcleo Cuantitativo)

### 3.1. Vectorización del Riesgo
El "Forward Sintético" del cliente asume una función de precio $P_{naive}(i) = C_{USD}(i) \cdot E_{hedge}$. 
Apex implementa un campo vectorial de precios óptimos $\vec{P}_{opt}$ que maximiza el volumen de flujo mientras impone una restricción de ruina cero:
$$P_{opt}^{(i)} = \arg\max_{p} \left[ \mathbb{E}[V_i(p)] \cdot \left( p \cdot (1-\mu_i) - C_{repo}^{(i)}(t+\tau_i) \right) \right]$$
Sujeto a la condición dura: $P_{opt}^{(i)} \ge P_{floor}^{(i)}$.

### 3.2. Ecuación de Precio de Supervivencia ($P_{floor}$)
El límite de quiebre algorítmico calculado mediante la proyección de reposición bajo volatilidad estocástica $\Phi$ y entropía antrópica $\mu$ (merma):
$$P_{floor} = \frac{C_{repo}(t) \cdot (1 + \Phi_{risk})^{\Delta t} + K_{fijo}}{1 - \mu_{friccion}}$$

### 3.3. Sumideros Topológicos de Capital ($H(t)$)
Mecanismo de detección de capital estancado mediante el cálculo de divergencia del flujo:
$$H_i(t) = \frac{\partial V_{sales}^{(i)}}{\partial t} \cdot \left( \frac{P_{actual}^{(i)} - C_{repo}^{(i)}}{C_{repo}^{(i)}} \right) \cdot \frac{1}{\pi_{inflacion}}$$
Cualquier resultado $\le 0$ exige la purga automática del activo a costo de liquidez para reasignación de capital.

---

## 4. Arquitectura de Software (Visión SWE Senior Rust)

Construido para operar como un proceso nativo desvinculado de la nube y tolerante a fallos de red.

### 4.1. El Stack Tecnológico
* **Core processing:** Rust. Optimizaciones SIMD para manipulación tensorial.
* **Estructuras Numéricas:** Tipos `Decimal` estrictos de punto fijo en `ndarray` contiguos en memoria caché (L1/L2) para evitar errores de coma flotante.
* **Storage Local Inmutable:** `SQLite` (WAL) y `Sled`. Arquitectura Event Sourcing (Append-Only Ledger) para garantizar auditoría forense y reconstrucción determinista de cualquier estado en el eje $t$.
* **Frontend:** Rust backend (`tauri`) con frontend HTML/Tailwind CSS + Vanilla JS (Arquitectura inactiva "Carga Cero", Zero Visual Load).

### 4.2. Depurador de Ingesta
* **Agnosticismo de Base de Datos:** Los Adaptadores (`driver_saint`, etc.) extraen deltas mediante polling.
* **Validación de Hashes:** Verificación criptográfica (`SHA-256`) contra mutaciones silenciosas en el RDBMS origen. Registros inconsistentes se desvían a logs de cuarentena para evitar la contaminación de la topología.

---

## 5. Go-To-Market & Modelo de Negocio (Scale-Up Institucional)

Apex no opera bajo un modelo SaaS masivo freemium, ni licencias de bajo costo. Opera bajo un esquema de **Rigurosidad Institucional**. Se comercializa la superioridad táctica y el determinismo matemático aplicable a cualquier sector.

* **El Posicionamiento:** El valor de Apex radica en su capacidad de adaptación agnóstica a cualquier vertical de retail, democratizando el rigor matemático de los fondos de inversión para el mercado minorista generalista.
* **Pricing B2B Enterprise:**
    * **Setup Fee (Derecho de Ingestión):** $3,000 USD. Incluye "Auditoría Cero", desarrollo y parametrización de drivers específicos para la base de datos legacy del cliente.
    * **Retainer Mensual (Licencia y Mantenimiento de Modelos):** $300 USD / mes. 
    * **Condición de Calidad (Zero Entropy Protocol):** El sistema exige rigor en la captura de datos. Si el cliente interrumpe las validaciones del inventario, el software alerta de divergencias matemáticas antes de inhabilitar las proyecciones.
* **Protección Legal y Técnica:**
    * SLAs comerciales y NDAs mutuos.
    * DRM por Hardware: Binario compilado y bloqueado criptográficamente contra huella física del servidor origen (`Motherboard UUID + CPU ID`). Validación de tokens RSA off-line.

---
**Nota Final de Ingeniería:** La superioridad del modelo reside en la ejecución fría de la matemática. El sistema carece de componentes estéticos innecesarios. Su salida es determinista y no está sujeta a la heurística falible del usuario, sino a la optimización estricta de la probabilidad de supervivencia del capital.