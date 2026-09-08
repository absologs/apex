# Catálogo de Errores - DatioLabs Retail

## Clasificación por Capa

### Capa 1: Núcleo de Negocio (`datiolabs-core/src/capacidades.rs`)
**ErrorNegocio** — Reglas de dominio puro, sin I/O

| Código | Variante | Campos | HTTP | Recuperable | Descripción |
|--------|----------|--------|------|-------------|-------------|
| NE-01 | `ProductoInexistente` | — | 404 | Sí | SKU no existe en catálogo |
| NE-02 | `StockInsuficiente` | `disponible: Decimal`, `solicitado: Decimal` | 409 | Sí | Intento de vender más de lo disponible |
| NE-03 | `CantidadNoUnitaria` | `Decimal` | 400 | Sí | Fracción en producto unitario |
| NE-04 | `EdadNoVerificada` | — | 403 | No | Venta alcohol sin verificación +18 |
| NE-05 | `LoteVencido` | `caduco_unix: i64` | 409 | No | Producto perecedero expirado |
| NE-06 | `SkuDuplicado` | `String` | 409 | No | Alta de SKU ya existente |
| NE-07 | `CapacidadInactiva` | `u8` (bits) | 403 | No | Rubro no habilita la capacidad requerida |
| NE-08 | `YaInicializado` | — | 409 | No | Wizard ejecutado dos veces |
| NE-09 | `NoInicializado` | — | 400 | Sí | Operación antes del wizard |
| NE-10 | `CuentaInvalida` | `String` (ID) | 404 | No | Cuenta abierta no existe o cerrada |
| NE-11 | `PagoInsuficiente` | `requerido: Decimal`, `recibido: Decimal` | 402 | Sí | Cobro menor al total |

---

### Capa 2: Persistencia (`datiolabs-core/src/db.rs`)
**DbError** — Fallos de almacenamiento, envuelve ErrorNegocio

| Código | Variante | Origen | HTTP | Recuperable | Descripción |
|--------|----------|--------|------|-------------|-------------|
| DB-01 | `Almacenamiento` | `sled::Error` | 500 | Reintentar | Corrupción sled, disco lleno, permisos |
| DB-02 | `Serializacion` | `bincode::Error` | 500 | No | Schema mismatch, datos corruptos |
| DB-03 | `Negocio` | `ErrorNegocio` | Ver NE-XX | Ver NE-XX | Re-export de reglas de negocio |
| DB-04 | `Io` | `std::io::Error` | 500 | Reintentar | Fallo FS en backup/import |

---

### Capa 3: Interfaz Tauri (`datiolabs-ui/src/error.rs`)
**UIError** — Contrato hacia frontend (JSON)

| Código | Origen | Campos | Descripción |
|--------|--------|--------|-------------|
| UI-01 | `String` genérico | `message`, `diagnosis` | Fallback legacy |
| UI-02 | `reqwest::Error` | red/HTTP | Scraper BCV, red caída |
| UI-03 | `DbError` | almacenamiento | Incluye NE-XX y DB-XX |
| UI-04 | `ErrorNegocio` | regla de negocio | Validaciones de dominio |

**Convención**: `message` = técnico, `diagnosis` = humano para UI

---

## Matriz de Conversión

```
ErrorNegocio (NE-XX)
    ↑ From
DbError::Negocio (DB-03)
    ↑ From
UIError (UI-03)
    → JSON { message, diagnosis }
```

---

## Códigos HTTP Recomendados

| Rango | Uso |
|-------|-----|
| 400 | NE-03, NE-06, NE-09, DB-02 |
| 403 | NE-04, NE-07 |
| 404 | NE-01, NE-10 |
| 409 | NE-02, NE-05, NE-06, NE-08 |
| 402 | NE-11 |
| 500 | DB-01, DB-03(wrapped), DB-04, UI-02 |

---

## Estrategia de Recuperación

| Tipo | Acción |
|------|--------|
| **Validación (4xx)** | Mostrar mensaje al usuario, no reintentar |
| **Conflicto (409)** | Refrescar estado (stock, cuenta), reintentar con datos frescos |
| **Transitorio (5xx, Io)** | Backoff exponencial 1s→2s→4s, máx 3 intentos |
| **Corrupción (DB-02)** | Requerir restore desde backup |
| **NoInicializado (NE-09)** | Redirigir a wizard |

---

## Auditoría (orden de aparición en código)

1. NE-01 ProductoInexistente
2. NE-02 StockInsuficiente
3. NE-03 CantidadNoUnitaria
4. NE-04 EdadNoVerificada
5. NE-05 LoteVencido
6. NE-06 SkuDuplicado
7. NE-07 CapacidadInactiva
8. NE-08 YaInicializado
9. NE-09 NoInicializado
10. NE-10 CuentaInvalida
11. NE-11 PagoInsuficiente
12. DB-01 Almacenamiento
13. DB-02 Serializacion
14. DB-03 Negocio (wrap)
15. DB-04 Io
16. UI-01 String genérico
17. UI-02 reqwest::Error
18. UI-03 DbError
19. UI-04 ErrorNegocio