# DatioLabs: Hoja de Ruta (Roadmap)

## Estado Actual
- El motor central de inferencia en Rust (con topología Struct-of-Arrays) se encuentra implementado.
- La infraestructura Edge (Cloudflare D1, Queues, Durable Objects) está operativa apuntando al dominio `datiolabs.com`.

## Tareas Pendientes
1. **Aislamiento Local-First**: Finalizar el acoplamiento directo a base de datos embebidas (SQLite WAL / Sled) para garantizar la ejecución Off-Grid sin latencia de red.
2. **Seguridad Zero Trust**: Implementar validaciones criptográficas JWT y políticas CORS estrictas en todos los endpoints expuestos de la API.
3. **Consolidación de Interfaz UI**: Finalizar la construcción del Dashboard de Escritorio en Tauri asegurando el cumplimiento de la regla de Carga Cero (Solo HTML/Tailwind/Vanilla JS, sin frameworks SPA pesados).
4. **Gobernanza CI/CD**: Configurar flujos automatizados de GitHub Actions para requerir `cargo clippy`, `cargo fmt` y `cargo test` antes de cualquier integración en la rama `main`.
