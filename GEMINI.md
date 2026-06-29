# [CONSTITUCIÓN DEL CÓDIGO APEX (DoD-GRADE)]
Este archivo establece las leyes fundamentales de termodinámica de software para este repositorio y documenta el contexto maestro del proyecto para prevenir pérdida de alineación algorítmica. Gemini CLI actuará como el garante determinista de estas reglas.

## 0. CONTEXTO MAESTRO DEL PROYECTO (APEX)
- **Naturaleza**: APEX es un motor determinista de eventos, análisis de riesgo y simulación financiera para Retail de alta frecuencia.
- **Acoplamiento**: Opera de forma asíncrona (Read-Only) frente a ERPs fiscales. No reemplaza el POS; ingiere datos, mapea la realidad y expone APIs.
- **Topología**: Se basa en 3 nodos planos y ortogonales (Producto, Infraestructura, Logística Plana). No existe complejidad espacial ni volumétrica (no se mapean m3 ni pesos físicos).
- **El Mercado**: Alimenta un Marketplace tripartito (Web, iOS, Android) con control de roles (Admin, B2C, B2B) y precios dinámicos basados en velocidad de salida, tiempo de estancia y correlación térmica.
- **Simulación (Sandbox)**: La arquitectura permite clonación en memoria (Read-Replica) para análisis What-If (ej: alterar costo de reposición global), retornando deltas financieros proyectados sin mutar el entorno de producción.

## 1. DIRECTIVAS DE INTERACCIÓN DEL AGENTE
- **IDIOMA ESTRICTO**: Toda comunicación y respuesta generada por Gemini CLI debe ser exclusivamente en español.
- **CERO CARGA VISUAL**: Estrictamente prohibido el uso de emojis o caracteres pictográficos en cualquier contexto, documento, comentario de código o respuesta. La comunicación debe mantener un rigor matemático e institucional.

## 2. INVARIANTES GLOBALES DE NÚCLEO
- **MEMORY_SAFETY_ABSOLUTE**: Bajo ninguna circunstancia introducir bloques `unsafe` en Rust. Si una librería externa requiere `unsafe`, rechazarla y buscar una alternativa segura.
- **ZERO_NETWORK_CALLS**: El módulo `core` opera en aislamiento total (Local-First). Prohibido introducir crates de red como `reqwest` o runtimes asíncronos pesados como `tokio` en la lógica de negocio.
- **ALGEBRAIC_DETERMINISM**: Toda salida debe ser matemáticamente predecible. Prohibido el uso de tipos flotantes nativos (`f32`, `f64`) para la topología financiera; uso obligatorio de estructuras de precisión exacta como `rust_decimal`.
- **CRYPTOGRAPHIC_IMMUTABILITY**: Todas las transacciones persistidas en el modelo híbrido (SQLite WAL + Sled) deben acoplarse con firmas SHA-256 por evento para prevenir corrupción estocástica y asegurar auditoría forense.

## 3. JURISDICCIÓN DE HERRAMIENTAS CLI
- **ISOLATE_SUBSYSTEMS**: Limitar las búsquedas territoriales a los dominios específicos: `apex-core`, `apex-ui`, `apex-driver-csv` y `apex_db_kv`. No saturar el contexto con escaneos globales innecesarios.
- **MATH_BEFORE_CODE**: Antes de mutar el código para algoritmos de cálculo tensorial, proyecciones ($P_{floor}$, $H(t)$) o vectorización, el agente DEBE documentar el álgebra lineal y el cálculo diferencial subyacente en su bloque de análisis.

## 4. TERMODINÁMICA Y ARQUITECTURA
- **TOPOLOGÍA**: Diseño Orientado a Datos (Rust DoD). Privilegiar matrices contiguas en memoria y transiciones de AoS a SoA para saturar la Cache L1 del procesador.
- **EJECUCIÓN**: Favorecer vectorización SIMD nativa y operaciones a nivel de bits (bitwise). Suprimir el branching (if/else) en los loops críticos del motor de inferencia.
- **INTEGRIDAD DE FLUJO**: El control de flujo estocástico se maneja vía sistema de tipos: `Result<T, E>` es mandatorio. El uso de `unwrap()` o `expect()` equivale a una falla crítica de arquitectura.
- **BASE CANÓNICA VECTORIAL**: Toda entidad del sistema se proyecta sobre un espacio métrico $\mathbb{R}^5$ con el vector $\vec{E} = [v_1, v_2, v_3, v_4, v_5]$ correspondiente a Inercia, Elasticidad, Densidad, Fricción y Gravedad.

## 5. BUCLE DE VALIDACIÓN (EL ORÁCULO EMPÍRICO)
- El ciclo de refactorización o adición de código NO TERMINA hasta que el agente haya validado empíricamente los siguientes axiomas con código de salida cero (Exit Code 0):
  1. `cargo clippy --all-targets --all-features -- -D warnings` (Tolerancia Cero a advertencias termodinámicas).
  2. `cargo test --release` (Verificación estricta de la matemática tensorial en entorno de producción).
  3. `cargo fmt -- --check` (Integridad estructural del formato del código).
- Si la validación falla, Gemini CLI mutará el código en silencio iterativamente hasta compilar un estado ortogonal y perfecto.
- **SÍNTESIS UI**: Cualquier mutación en `apex-ui` o interfaces visuales debe respetar la arquitectura basada en Tauri (HTML/Tailwind CSS + Vanilla JS) y el principio de "Inteligencia Aumentada, Carga Cero", compilando sin excepciones.