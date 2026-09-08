# [CONSTITUCIÓN DEL CÓDIGO DatioLabs Enterprise & Retail Data Product]
Este archivo establece las leyes fundamentales de diseño y calidad de software para este repositorio y documenta el contexto maestro del proyecto. El agente actuará como el garante determinista de estas reglas.

## 0. CONTEXTO MAESTRO DEL PROYECTO (DatioLabs: Enterprise Resource Data Product)
- **Naturaleza**: DatioLabs es un sistema determinista de gestión de recursos empresariales y producto de datos (Data Product) de alto rendimiento, diseñado para retail, gestión de inventario atómico, auditoría criptográfica y control comercial.
- **Distribución Objetivo**: Exclusivo para entorno Windows (aplicación de escritorio local) y despliegue de demostración web 100% funcional e idéntico vía Cloudflare (`datiolabs.com/demo`).
- **Arquitectura Basada en Datos**: Modela capacidades modulares por rubro (Abasto, Panadería FEFO, Licorería/Cuentas abiertas, Retail/Series y Variantes), manteniendo estructuras de datos contiguas y libres de estados ambiguos.

## 1. DIRECTIVAS DE INTERACCIÓN DEL AGENTE
- **IDIOMA ESTRICTO**: Toda comunicación y respuesta debe ser exclusivamente en español.
- **CERO CARGA VISUAL**: Estrictamente prohibido el uso de emojis o caracteres pictográficos en cualquier contexto, documento, comentario de código o respuesta.
- **OUTPUT DETERMINISTA (SIN OPEN/MID/END)**: Prohibido estructurar respuestas con introducciones, nudos explicativos o conclusiones vacías. Comunicación 100% técnica y precisa.
- **CERO EMOCIONALIDAD**: Comunicación técnica institucional. Enfoque directo en estado del sistema y mutaciones de código.

## 2. INVARIANTES GLOBALES DE NÚCLEO
- **MEMORY_SAFETY_ABSOLUTE**: Cero bloques `unsafe` en el código Rust de la aplicación.
- **ISOLACIÓN DEL NÚCLEO (Local-First)**: `datiolabs-core` opera en aislamiento total sin dependencias de red pesadas ni llamadas externas estocásticas.
- **DETERMINISMO FINANCIERO**: Toda magnitud monetaria y de stock debe utilizar precisión decimal exacta (`rust_decimal`). Prohibido el uso de coma flotante (`f32`/`f64`) para dinero e inventarios.
- **INMUTABILIDAD Y RESPALDOS CRIPTOGRÁFICOS**: Las transacciones, movimientos y copias de seguridad se respaldan en Sled acopladas con checksums SHA-256 para prevenir alteraciones y garantizar integridad transaccional.
- **CATÁLOGO CERRADO DE ERRORES**: El control de flujo maneja errores explícitos mediante `Result<T, E>` y variantes documentadas en `ERRORES.md`.

## 3. JURISDICCIÓN Y AMBIENTE
- **SISTEMA OPERATIVO TARGET**: Windows (binario principal) y WebAssembly / Servidor Web ligero para despliegue público en Cloudflare.
- **SUBSISTEMAS**: `datiolabs-core` (motor de dominio y persistencia), `datiolabs-driver-csv` (ingesta/exportación), `datiolabs-ui` (servidor axum / panel web y frontend desktop).

## 4. BUCLE DE VALIDACIÓN EMPÍRICO
- Cualquier refactorización o cambio de código en el núcleo debe cumplir con:
  1. `cargo clippy -p <crate> --all-targets -- -D warnings` (Cero advertencias).
  2. `cargo test -p <crate>` (Tests unitarios y tests basados en propiedades limpios).
  3. `cargo fmt -- --check` (Consistencia y formato estricto).