# TODO APEX - Fase v2.0 (Certificación Enterprise / DoD-GRADE)

Habiendo alcanzado el 100% de la funcionalidad operativa empírica (incluyendo la cristalización persistente, LSH CRM, cadena predictiva y control riguroso de errores IPC), el sistema opera actualmente en un estado de 'alta resiliencia' (Panic-Free en Rust).

El objetivo de la Fase v2.0 es trascender la programación defensiva y llevar a APEX al nivel **'Irrompible' (Grado de Verificación Formal)**. 

La meta: Un sistema es 'irrompible' cuando el costo de encontrar una falla de lógica es superior al valor de los activos que protege. Se debe implementar Verificación Formal, Fuzzing y Seguridad Vinculada al Hardware para convertir el motor en un Acorazado Digital.

Aquí están los pilares de ingeniería para blindar el sistema contra fallos de lógica, corrupción de estado y ataques físicos:

### 1. Verificación Formal del Núcleo Matemático (TLA+)
El código en Rust es seguro en memoria, pero la lógica tensorial requiere garantías algebraicas contra fallos conceptuales y 'agujeros de gusano' estocásticos.
* **Qué falta:** 
  Utilizar TLA+ (Temporal Logic of Actions) para modelar los estados del motor de precios. La tesis central del Oráculo es la "Supervivencia del Capital". Se debe escribir una especificación formal en TLA+ que abstraiga el cálculo de la inecuación de valor esperado.
  **Aserción Obligatoria:** Modelar el estado del sistema bajo parámetros extremos combinados (Hiperinflación de 3 dígitos, Entropía/Merma > 50%, y Velocidad de Venta cercana a 0). El *Model Checker* (TLC) debe explorar exhaustivamente el árbol de estados para demostrar matemáticamente que existe un Invariante Absoluto: Bajo ninguna permutación finita el algoritmo permitirá que el "Precio de Supervivencia" ($P_{floor}$) caiga por debajo del "Costo de Reposición" ($C_{repo}$).

### 2. Property-Based Testing (PBT) con `proptest` [COMPLETADO]
Sustituir la dependencia exclusiva de unit tests deterministas por un bombardeo aleatorizado para encontrar casos de borde impredecibles.
* **Qué falta:** 
  Integrar el crate `proptest`. Definir invariantes estrictos (Ej. 'Independientemente de la base de datos de origen, el Ingestor Topológico siempre debe producir un vector dentro del espacio $\mathbb{R}^5$ con norma finita'). Garantizar el 'Agnosticismo' contra estructuras corruptas.

### 3. Fuzzing Continuo (Robustez del Ingestor) [COMPLETADO]
El ingestor (`EntropyScanner` / `UniversalByteAdapter`) es la superficie de ataque primaria al leer flujos de bytes crudos del exterior.
* **Qué falta:** 
  Implementar `cargo-fuzz` (libFuzzer) para someter al motor de ingesta a trillones de mutaciones de archivos malformados (SQLite, JSON, CSV, binarios). Eliminar cualquier posibilidad de fuga de memoria o comportamiento errático en el parser.

### 4. Replay Determinista y Resiliencia Eléctrica [COMPLETADO]
Asegurar consistencia eventual perfecta frente a cortes de energía (falla térmica del hardware) durante cálculos o cristalizaciones masivas.
* **Qué falta:** 
  Reforzar los invariantes de los logs WAL en SQLite y Sled. Proveer un sistema de reconstrucción desde cero (Replay determinista) que, ante un apagón violento a mitad de un `append_record`, audite los hashes SHA-256 en el reinicio y purgue los bloques incompletos, restaurando el estado inmutable exacto.

### 5. Hardware Root of Trust (TPM) e Integridad del Binario
Mitigación absoluta contra Insider Threats (fugas físicas vía USB o manipulación directa de la máquina).
* **Qué falta:** 
  Vincular la llave criptográfica de Sled y de la 'Cápsula de Inercia' a un módulo TPM (Trusted Platform Module) de la placa base (Geofencing por Hardware). Adicionalmente, el cargador de Tauri debe verificar el hash del binario de Rust al arrancar; cualquier mutación gatilla un bloqueo automático (Self-Destruct Sequence).

### 6. Aislamiento de Procesos (Sandboxing de Drivers WASM)
Preparación para la escalabilidad horizontal y el soporte de bases de datos cerradas (Legacy ERPs como SAP u Oracle).
* **Qué falta:** 
  Integrar el runtime `wasmtime` dentro de `apex-core`. Transformar la arquitectura del Agente Centinela para que admita *Drivers de Extracción* externos compilados en WebAssembly (`.wasm`).
  **Aislamiento Físico y de Memoria:** Garantizar que estos módulos de terceros operen en un entorno "Zero-Trust". El driver WASM debe estar estrictamente confinado: carecerá de permisos de red, de acceso a disco, y de acceso al espacio de memoria principal de Rust. Su única interfaz será recibir bytes opacos de la base de datos origen y devolver los datos purificados a la memoria intermedia cedida por APEX. Esto impedirá que fugas de memoria o ciclos infinitos en el código de terceros colapsen el motor termodinámico central.

---

## SIGUIENTES PASOS SUGERIDOS:
El "Escudo contra la Entropía Física" (PBT, Fuzzing y Resiliencia Eléctrica) ya se encuentra **completado**.

Para consolidar el dogma *DoD-GRADE*, el siguiente esfuerzo debe dirigirse a la **Verificación Formal (TLA+) (Punto 1)** para asegurar matemáticamente la invulnerabilidad de la lógica de negocio frente a la inflación extrema. Alternativamente, si el foco a corto plazo es la penetración de mercado y compatibilidad con sistemas cerrados, se deberá priorizar el **Sandboxing WASM (Punto 6)**.