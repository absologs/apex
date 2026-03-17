# ESTADO DEL PROYECTO: APEX v1.0 (Auditoría Cero)
**Fecha:** 16 de Marzo, 2026
**Estado Actual:** Fase de Consolidación Arquitectónica e Integración de UI.

Este documento refleja el estado exacto, verificado empíricamente, del código fuente, la infraestructura y las decisiones arquitectónicas implementadas hasta la fecha.

---

## 1. COMPONENTES CONSOLIDADOS (El Núcleo Duro)

### 1.1 El Ledger Híbrido (Almacenamiento Inmutable)
El corazón de almacenamiento ha sido implementado bajo un modelo híbrido en `apex-core/src/ledger.rs`:
* **SQLite (WAL Mode):** Actúa exclusivamente como un índice forense rápido para búsquedas y consultas relacionales (guardando el `tx_id`, `product_id`, `sha256_hash` y `timestamp`).
* **Sled (Motor K/V):** Almacena el payload pesado completo (JSON) y maneja la persistencia de las variables globales del sistema.
* **Máquina de Estados & Snapshots $O(1)$:** El proyector financiero lee los deltas desde la última ejecución y guarda un Snapshot en *Sled* (serializado en `LATEST_SNAPSHOT`). Esto evita el recálculo infinito de toda la historia contable en cada arranque, solucionando la complejidad de tiempo $O(N)$.
* **Variable Mutadora Global:** La última Tasa BCV conocida se guarda persistentemente en el almacén de Sled y se carga automáticamente durante la inicialización de la app.

### 1.2 El Oráculo Cuantitativo y Tensores
* **Precisión Financiera:** Se abandonó el uso de flotantes estocásticos (`f32`/`f64`). Todas las estructuras tensoriales (`LotTensor`) operan con `rust_decimal`, garantizando determinismo algebraico.
* **LIFO Financiero:** El método `project_current_inventory` está configurado para descontar la salida de mercancía consumiendo los lotes más recientes, blindando al usuario contra los costos de reposición actuales (inflación) y marginando el capital más antiguo como rentabilidad retenida.
* **Proyección Tensorial Agnóstica:** Implementación de Locality-Sensitive Hashing (LSH) en `apex-core/src/tensor.rs`. Transmuta la estructura probabilística ($D=64$) de un conjunto de bytes a un espacio hiperplano determinista ($K=16$) usando una proyección de Johnson-Lindenstrauss sin algoritmos estocásticos ni entrenamiento.

### 1.3 Arquitectura Columnar Pura (Apache Arrow)
Todo el flujo de datos del núcleo opera bajo una arquitectura *Struct of Arrays* (SoA) utilizando `Apache Arrow`, garantizando un consumo de memoria constante $O(1)$ y rendimiento extremo:
* **Ingesta Directa:** El `CsvAdapter` lee archivos directamente hacia `RecordBatch` de Arrow, erradicando el uso de iteradores por filas (`HashMap`).
* **Motor de Limpieza (Playbook):** Las transformaciones de datos (Trim, Uppercase, Cast) se ejecutan de manera columnar pura, optimizadas por el compilador para aprovechar la vectorización (SIMD) del procesador. 
* **Transporte IPC Binario:** Se eliminó el cuello de botella de serialización JSON hacia el frontend. La UI en Javascript (Tauri) recibe el estado del inventario completo como un bloque binario `Uint8Array` de Arrow (`get_inventory_arrow`), permitiendo renderizar millones de registros sin presión sobre el Garbage Collector.
* **Determinismo Criptográfico:** La firma topológica (LSH, MinHash, HyperLogLog) utiliza implementaciones de `SipHash-1-3` con semillas fijas, asegurando una inmutabilidad matemática absoluta.

### 1.4 Ingesta Topológica Agóstica (Oráculo ETL)
Implementado en `apex-core/src/ingest.rs` y `apex-core/src/playbook.rs`:
* **Motor de Limpieza Determinista (AST/Playbook):** Arquitectura inmutable de transformaciones. Todo cambio (como normalizar textos, castear enteros con *fallbacks* matemáticos o rellenar vacíos) se ejecuta mediante un Árbol Sintáctico Abstracto (AST) puro (`TransformOp`), permitiendo que una misma "Receta" (*Playbook*) actúe sobre los datos origen produciendo siempre un estado matemáticamente idéntico y evitando las mutaciones locales (*In-place mutation*).
* **Pipeline Determinista (SensorFeatures):** Evaluación exhaustiva del comportamiento probabilístico del bloque (Numérico, Texto, Fecha) usando estimación matemática:
  - Firma `MinHash` (58 hashes) para cadenas, generada algorítmicamente mediante $FNV-1a$ con Semillas estáticas.
  - Estimador `HyperLogLog` (64 Bins, 6 bits) para inferir cardinalidad, optimizado bit a bit.
  - Erradicación de colapsos: Funciones puras que devuelven resultados vacíos controlados (`[0.0; 64]`) si el dataset colapsa.
* **Abstracción de Origen (`SourceAdapter`):** Se creó una interfaz que permite conectar cualquier fuente de datos (CSV, SQL) utilizando un sistema de lectura por iteradores para no saturar la memoria RAM. La primera implementación probada y funcional es el `CsvAdapter`.
* **Reconocimiento Heurístico de Columnas:** A través de expresiones regulares compiladas perezosamente (`LazyLock`), el motor detecta automáticamente qué columna es el SKU, Precio, Cantidad o Fecha.
* **Dead Letter Queue (Cuarentena):** Si una fila está corrupta no se detiene la ingesta masiva. Se descarta en una estructura aislada detallando la razón del fallo, asegurando que `Sled` solo reciba datos matemáticamente puros.
* **Agente Centinela (CDC Automático):** Se incorporó un demonio en segundo plano (Tokio task) que lee una configuración guardada (`SentinelConfig`) y extrae silenciosamente los deltas de información de la fuente original cada 5 minutos, garantizando un flujo continuo sin fricción para el usuario.

### 1.4 Microservicio de Dólar Nativo (`api_dolar`)
* **Independencia Tecnológica:** Se eliminó el proyecto legado `esjs-dolar-api` del stack principal.
* **Servidor Axum + Tokio:** Hemos levantado un microservicio asíncrono en Rust (`api_dolar/src/main.rs`) que realiza un *scrapping* directo a las fuentes locales usando la librería `scraper` en un proceso aislado.

---

## 2. ESTADO DE LA INTERFAZ DE USUARIO (`apex-ui`)

La transición de `egui` a una arquitectura **Tauri v2 + HTML/Tailwind CSS** ha sido completada con éxito.

### 2.1 Ecosistema de Comunicación (Tauri IPC)
* **Comandos Levantados:** El backend de Tauri ahora expone correctamente comandos IPC como `sync_bcv_rate`, `get_inventory` y `get_tasa_bcv`.
* **Manejo de Estado Concurrente:** El Ledger de la base de datos y la Tasa BCV están empaquetados en un `Arc<Mutex<AppState>>`, asegurando que la interfaz puede consultar la data concurrentemente sin colisiones de memoria (Data Races).
* **Solución de la "Ventana Invisible":** Se corrigió el problema crítico de lanzamiento al forzar la configuración de Tauri v2 (`withGlobalTauri: true`) y hacer la ventana visible por defecto (`"visible": true`).

### 2.2 Avances Visuales (Carga Cero y Zero-Copy)
* El diseño de "Terminal Táctica" en Modo Oscuro Estricto (`#0D0D0D`) y colores de acento en Verde Neón (`#ADFA1D`) ya está renderizado en el front.
* El enrutamiento básico mediante pestañas Javascript nativo (Resumen, War Room, El Radar, La Cadena, Ingesta, Zero-Copy) está operativo.
* La vista "Resumen" lee el inventario proyectado (`get_inventory`), calculando Ingreso Total multiplicando `cost_usd * current_quantity` en tiempo real.
* **Flujo de Ingesta ETL Integrado:** La pestaña de Ingesta cuenta con un Wizard funcional que permite seleccionar asincrónicamente el origen de datos, lanzar el "Oráculo de Mapeo" y mostrar anomalías en la estructura del archivo origen antes de ejecutar la transmutación hacia la base de datos `apex_db`.
* **Puente Zero-Copy (Arrow IPC):** Se implementó una vista dedicada ("Zero-Copy") que consume el pipeline columnar a través de un bus binario. El frontend utiliza Módulos ECMAScript (ESM) para cargar `apache-arrow` sin bundlers, mapeando el `Uint8Array` recibido desde Rust directamente a la memoria de la UI en tiempo $O(1)$, eliminando la presión sobre el Garbage Collector.

---

## 3. DEUDA TÉCNICA E INTEGRACIONES PENDIENTES (Roadmap Inmediato)

Aunque el ecosistema compila sin errores (Exit Code 0), restan las siguientes áreas de intervención:

### 3.1 Erradicación de Pánicos (Estándar Apollo 11) - **[COMPLETADO]**
* **Inmunidad Estructural:** Se purgaron el 100% de las instrucciones estocásticas que podían colapsar el sistema de ingesta (`.unwrap()` y `.expect()`). Todo control de flujo se hace mediante la captura inquebrantable de errores `Result<T, E>`.
* **Seguridad en Concurrencia:** Los bloqueos de memoria (`Mutex`) en el backend de Tauri ahora gestionan errores de envenenamiento de hilos sin colapsar el proceso principal, devolviendo alertas controladas a la interfaz.
* **Compilación de Oráculos:** Las expresiones regulares (`regex`) y selectores de scrapping HTML (`scraper`) se migrarón a constructores seguros como `LazyLock<Result<Regex, regex::Error>>` o `LazyLock<Option<Selector>>`, previniendo de forma determinista la invalidación de memoria por anomalías sintácticas en compilación de expresiones.

### 3.2 Desarrollo de Módulos de Combate
* **War Room (Completado):** El simulador de elasticidad ya está enlazado a los datos de inventario proyectado y es capaz de simular la exigencia de ventas (`∆V`) necesarias frente al Precio de Supervivencia (`P_floor`), bloqueando el comando si se perfora la frontera de ruina.
* **Sentinel CDC (Integrado):** Se implementó el Agente Centinela, un demonio en segundo plano (gestionado vía `tauri::async_runtime`) que utiliza las "Plantillas de Mapeo" persistidas en Sled para sincronizar automáticamente deltas de la base de datos origen cada 5 minutos sin intervención humana.
* **Radar & Cadena:** Son cascarones visuales actualmente. Faltan las integraciones funcionales de cálculo de divergencias de clientes y reposición de proveedores.