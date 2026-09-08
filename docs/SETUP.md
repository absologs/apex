# DatioLabs: Instalación y Despliegue

Este documento detalla los requisitos estrictos para compilar y desplegar DatioLabs de manera local y en la red Edge.

## 1. Requisitos del Sistema
- **Rust Toolchain**: Compilador estable instalado vía `rustup`.
- **Node.js**: Entorno LTS (18.x o superior).
- **Cloudflare Wrangler**: Instalado globalmente mediante `npm install -g wrangler` para gestionar despliegues Edge.
- **Tauri CLI**: Requerido para compilar la interfaz de escritorio (`cargo install tauri-cli --version "^2.0.0" --locked`).
- **Herramientas C/C++**: `build-essential` (Linux) o el equivalente del sistema para la compilación base.

## 2. Flujo de Compilación
1. **API / Backend**: Se compila apuntando a WebAssembly utilizando `worker-build --release` y se despliega mediante `wrangler deploy`.
2. **Cliente de Escritorio**: Se construyen los assets del frontend (`npm run build`) y luego se empaqueta el binario final utilizando `cargo tauri build`.
3. **CLI Local (Ingesta)**: Se compila de forma nativa ingresando al directorio `datiolabs-driver-csv` y ejecutando `cargo build --release`.
