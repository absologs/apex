# ESTADO DEL PROYECTO: APEX v1.0 (Auditoría Cero)
**Fecha:** 28 de Junio, 2026
**Estado Actual:** Consolidación de Topología de 3 Nodos Planos, Motor POS Activo, y Despliegue Móvil Nativo (Tauri v2 Android).

Este documento refleja el estado exacto, verificado empíricamente, del código fuente, la infraestructura y las decisiones arquitectónicas implementadas hasta la fecha.

---

## 1. COMPONENTES CONSOLIDADOS (El Núcleo Duro)

### 1.1 El Ledger Híbrido (Almacenamiento Inmutable)
El corazón de almacenamiento ha sido implementado bajo un modelo híbrido en `apex-core/src/ledger.rs`:
* **SQLite (WAL Mode):** Actúa exclusivamente como un índice forense rápido para búsquedas y consultas relacionales (guardando el `tx_id`, `product_id`, `sha256_hash` y `timestamp`).
* **Sled (Motor K/V):** Almacena el payload pesado completo y maneja la persistencia de las variables globales del sistema.
* **Máquina de Estados & Snapshots $O(1)$:** El proyector financiero lee los deltas desde la última ejecución y guarda un Snapshot en *Sled*. Esto evita el recálculo infinito de toda la historia contable en cada arranque, solucionando la complejidad de tiempo $O(N)$.
* **API POS Activa (Verdad Absoluta):** APEX ya no es solo un oráculo pasivo. Mediante el endpoint `register_pos_transaction`, inyecta ventas y deltas directos en el motor Sled saltándose el ERP externo, gobernando el stock como fuente de verdad (Single Source of Truth).

### 1.2 Topología Ortogonal (3 Nodos Planos y Subnodos)
La arquitectura térmica ha sido simplificada eliminando `LotTensor` y `f32`/`f64`. Todo se proyecta en **3 Nodos Planos**:
* **NODO 1 - Producto:** Mapea `sku_id`, `costo_reposicion_esperado` (`C_repo`), `precio_actual`, y `velocidad_salida`.
  * **Subnodos:** `Categoria` (Fricción base) y `Variante` (Talla, Color).
* **NODO 2 - Infraestructura:** Mapea la capacidad espacial de los activos (Almacén).
  * **Subnodos:** `Estante` (Capacidad volumétrica máxima plana).
  * **Capital Humano (Nómina):** `NominaOperador` midiendo `costo_hora_usd` y velocidad de procesamiento (`inercia_operativa` o Tx/H).
* **NODO 3 - Logística Plana:** Modelado del flujo externo.
  * **Subnodos:** `Proveedor` (Probabilidad de cumplir Lead Time y días de crédito).

*Todo cálculo, proyección y clúster CRM (`VectorR5`) está anclado a `rust_decimal`, certificando un **Determinismo Algebraico** estricto sin desviación de coma flotante.*

### 1.3 Arquitectura Columnar Pura (Apache Arrow)
* Todo el flujo de datos del núcleo opera bajo una arquitectura *Struct of Arrays* (SoA) garantizando un consumo de memoria constante $O(1)$ y rendimiento extremo.
* **Transporte IPC Binario:** Se eliminó el cuello de botella de serialización JSON hacia el frontend. La UI en Javascript (Tauri) recibe el estado del inventario completo como un bloque binario `Uint8Array` de Arrow (`get_inventory_arrow`), permitiendo renderizar millones de registros sin Garbage Collection stress.

### 1.4 Oráculo Cuantitativo y Microservicios
* **Microservicio de Dólar Nativo (`api_dolar`):** Totalmente funcional e independiente. Escrito en Axum/Tokio haciendo *scrapping* directo a BCV y Paralelo. Está blindado con `rustls-tls`, eliminando la dependencia sistémica frágil a `openssl`.
* **Gráficos Zero-Bloat (`uPlot.js`):** Interfaz gráfica implementada mediante uPlot (Canvas 2D hiper-rápido) para inyectar cientos de miles de puntos vectoriales sin recargar la interfaz visual del sistema POS.

### 1.5 Anillo Cero de Confianza y Anti-Cracking
Se implementó una defensa termodinámica absoluta bajo la doctrina Local-First:
* **Arquitectura RBAC POSIX (`auth.rs`):** Anillos de privilegio topológicos (`APEX_ROOT`, `TACTICAL_OPERATOR`, `DATA_CLERK`).
* **Centinela Termodinámico (`sentinel.rs`):** Defensa anti-tampering y anti-ingeniería inversa que audita el sistema operativo previendo conexiones ptrace y hooking `LD_PRELOAD`.

### 1.6 Telemetría Determinista y Oráculo de Errores
* **Taxonomía Topológica (`error.rs`):** Diagnósticos operacionales guiados (Falla Termodinámica, Cinemática, Matemática, Seguridad).
* **Registro Térmico Silencioso (`telemetry.rs`):** Emisión de logs puramente locales bajo formato matemático estricto. (Política ZERO VISUAL LOAD).

### 1.7 Tolerancia Cero Absoluto (Auditoría Termodinámica)
* El núcleo base compila y cumple pruebas unitarias bajo estado Cero Advertencias (`clippy::pedantic`).
* **Anti-Pánico Garantizado:** Remoción sistemática de todos los `unwrap()` y `expect()`.

---

## 2. ESTADO DE LAS INTERFACES DE USUARIO (Tauri v2 Mobile)
La arquitectura transicionó de `egui` a **Tauri v2 (Android/Desktop) + HTML/Tailwind CSS**, consolidándose en dos binarios independientes:

### 2.1 Oráculo POS (`apex-ui`)
* El diseño en Modo Oscuro Estricto (`#0D0D0D`) y verde neón (`#ADFA1D`) respeta la regla Cero Carga Visual.
* Las métricas leen consistentemente a los nodos planos y establecen **C_REPO (LÍMITE)**.
* **Modal POS TX:** Ejecuta comandos IPC de escritura con validación RBAC (`register_pos_transaction`).
* **Microservicio Borde:** Expone los endpoints del Ledger por el puerto `4000` directamente en el dispositivo móvil.

### 2.2 Marketplace B2C (`marketplace-ui`)
* Arquitectura Desacoplada (Frontend-Only) apuntando por red al binario Edge (`apex-ui`).
* Enfoque puramente Retail ("Estilo Amazon"), con UX premium y textos breves orientados a conversión comercial. Sin mención técnica ni jerga financiera pesada para el usuario final.
* Compilado nativo con firma y build multiplataforma (Android APK) lograda con cero errores de dependencias C/C++ cross-compiladas (eliminando OpenSSL en favor de Rustls).

---

## 3. DEUDA TÉCNICA E INTEGRACIONES [RESUELTO]

### 3.1 Erradicación de Flotantes y Pánicos - **[COMPLETADO]**
* Inmunidad Estructural Absoluta. La lógica CRM fue migrada enteramente a `VectorR5` sin casts de `f64`.

### 3.2 Desarrollo de Módulos de Combate - **[COMPLETADO]**
* **War Room (Elasticidad y Bundling):** Acoplado y funcionando sin $P_{floor}$.
* **Sentinel CDC (Integrado):** El demonio de sincronización (Extracción de Entropía) opera limpiamente cada 5 minutos.

---

## 4. FASE v2.0 (Certificación Enterprise / DoD-GRADE)
### 4.1 Escudo contra la Entropía Física y Resiliencia [COMPLETADO]
* **Fuzzing Continuo & Property-Based Testing:** Blindaje contra inputs corruptos en memoria asegurando resiliencia extrema.
* **Replay Determinista y Resiliencia Eléctrica:** WAL config y FS flush ($O(1)$) asegurando supervivencia contra fallas eléctricas masivas.

### 4.2 Arquitectura Restante (NEXT STEPS - Próxima Sesión)
* **Interconexión en VPS:** Levantar ambos sistemas (APEX Edge Server y Marketplace) dentro de la misma infraestructura VPS para pruebas E2E y orquestación de red real.
* **Overhaul de la GUI del Marketplace:** Rediseño y reconstrucción profunda de la interfaz B2C para alcanzar estándares de experiencia de usuario de Retail (Amazon-like). *Nota: Existen directivas masivas de rediseño pendientes por el usuario.*
* **Mejoras Estructurales a APEX:** Refinamiento continuo del motor y adición de lógica de negocio pendiente.
* **Hardware Root of Trust (TPM):** Geofencing por hardware y aislamiento en RAM (Roadmap a futuro).
* **Sandboxing WASM:** Ejecución perimetral de extensiones Legacy (ERPs legacy) (Roadmap a futuro).
