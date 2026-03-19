# TODO APEX - Fase v2.0 (Certificación Enterprise / DoD-GRADE)

Habiendo alcanzado el 100% de la funcionalidad operativa empírica (incluyendo la cristalización persistente, LSH CRM, cadena predictiva y control riguroso de errores IPC), el sistema opera actualmente en un estado de 'alta resiliencia' (Panic-Free en Rust).

El objetivo de la Fase v2.0 es trascender la programación defensiva y llevar a APEX al nivel **'Irrompible' (Grado de Verificación Formal)**. 

La meta: Un sistema es 'irrompible' cuando el costo de encontrar una falla de lógica es superior al valor de los activos que protege. Se debe implementar Verificación Formal, Fuzzing y Seguridad Vinculada al Hardware para convertir el motor en un Acorazado Digital.

Aquí están los pilares de ingeniería para blindar el sistema contra fallos de lógica, corrupción de estado y ataques físicos:

### 1. Verificación Formal del Núcleo Matemático (TLA+)
El código en Rust es seguro en memoria, pero la lógica tensorial requiere garantías algebraicas contra fallos conceptuales y 'agujeros de gusano' estocásticos.
* **Qué falta:** 
  Utilizar TLA+ (Temporal Logic of Actions) para modelar los estados del motor de precios y probar matemáticamente que, bajo cualquier combinación de inflación, volatilidad y entrada de datos, el sistema nunca podrá alcanzar un estado de 'ruina' ($P_{floor} < C_{repo}$).

### 2. Property-Based Testing (PBT) con `proptest`
Sustituir la dependencia exclusiva de unit tests deterministas por un bombardeo aleatorizado para encontrar casos de borde impredecibles.
* **Qué falta:** 
  Integrar el crate `proptest`. Definir invariantes estrictos (Ej. 'Independientemente de la base de datos de origen, el Ingestor Topológico siempre debe producir un vector dentro del espacio $\mathbb{R}^5$ con norma finita'). Garantizar el 'Agnosticismo' contra estructuras corruptas.

### 3. Fuzzing Continuo (Robustez del Ingestor)
El ingestor (`EntropyScanner` / `UniversalByteAdapter`) es la superficie de ataque primaria al leer flujos de bytes crudos del exterior.
* **Qué falta:** 
  Implementar `cargo-fuzz` (libFuzzer) para someter al motor de ingesta a trillones de mutaciones de archivos malformados (SQLite, JSON, CSV, binarios). Eliminar cualquier posibilidad de fuga de memoria o comportamiento errático en el parser.

### 4. Replay Determinista y Resiliencia Eléctrica
Asegurar consistencia eventual perfecta frente a cortes de energía (falla térmica del hardware) durante cálculos o cristalizaciones masivas.
* **Qué falta:** 
  Reforzar los invariantes de los logs WAL en SQLite y Sled. Proveer un sistema de reconstrucción desde cero (Replay determinista) que, ante un apagón violento a mitad de un `append_record`, audite los hashes SHA-256 en el reinicio y purgue los bloques incompletos, restaurando el estado inmutable exacto.

### 5. Hardware Root of Trust (TPM) e Integridad del Binario
Mitigación absoluta contra Insider Threats (fugas físicas vía USB o manipulación directa de la máquina).
* **Qué falta:** 
  Vincular la llave criptográfica de Sled y de la 'Cápsula de Inercia' a un módulo TPM (Trusted Platform Module) de la placa base (Geofencing por Hardware). Adicionalmente, el cargador de Tauri debe verificar el hash del binario de Rust al arrancar; cualquier mutación gatilla un bloqueo automático (Self-Destruct Sequence).

### 6. Aislamiento de Procesos (Sandboxing de Drivers WASM)
Preparación para la escalabilidad horizontal y el soporte de formatos opacos (Legacy ERPs).
* **Qué falta:** 
  Ejecutar procesos de ingesta pesados o 'drivers' de terceros en hilos con privilegios restringidos usando WebAssembly (`wasmtime`). Esto asegurará que, si un driver inyectado colapsa o entra en un loop infinito, la falla quede contenida en un *sandbox* sin acceso a la memoria RAM de APEX o las llaves criptográficas principales.

---

## PRIORIDAD SUGERIDA: EL ESCUDO CONTRA LA ENTROPÍA FÍSICA
Comenzar obligatoriamente por el **Fuzzing Continuo (Punto 3)** y el **Replay Determinista (Punto 4)**. 

En entornos no controlados, la hostilidad principal proviene de la entropía de los datos inyectados por los Data Clerks y de las fallas de suministro eléctrico. Asegurar que ni los archivos basura ni los apagones abruptos pueden corromper el Ledger es el paso fundacional antes de escalar hacia las matemáticas teóricas (TLA+) y el hardware especializado (TPM).
