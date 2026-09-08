# Arquitectura del Sistema DatioLabs

DatioLabs es un Motor de Analítica Dinámica e Ingeniería de Datos Local-First. Opera exclusivamente como una capa de Middleware de Solo-Lectura que ingiere, limpia y centraliza datos para descubrir inteligencia empresarial.

## Topología del Núcleo
El sistema está construido bajo un Diseño Orientado a Datos (DoD) estricto, utilizando una Arquitectura Orientada a Eventos (EDA) y CQRS.

1. **Módulo de Ingesta (CLI/API)**: Un worker independiente que ingiere datos asimétricos desde sistemas legacy, normaliza esquemas (fechas, UUIDs) y enruta la carga hacia las colas internas.
2. **DatioLabs Core (El Motor)**: Procesa los eventos utilizando una topología plana en un espacio métrico $\mathbb{R}^5$, mapeando los datos de forma contigua en memoria para saturar la caché del procesador (Struct of Arrays).
3. **Panel de Control (DatioLabs BI)**: Interfaz de escritorio nativa (Tauri) diseñada para consultar y visualizar métricas empresariales ortogonales sin sobrecarga visual.

## Integración Cloudflare Edge
- **Bus Servidor-a-Servidor (S2S)**: Cloudflare Queues para la ingesta asíncrona de eventos.
- **Transmisión Servidor-a-Cliente (S2C)**: Cloudflare Durable Objects + WebSockets para empujar las métricas calculadas a la UI en tiempo real.
- **Almacenamiento**: Cloudflare D1 (SQLite) operando como base de datos OLAP transaccional. KV para lecturas ultra rápidas.
