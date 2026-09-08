# ESTADO DEL SISTEMA (Apex / DatioLabs Retail)

Ultima actualizacion: 2026-08-25 (Fase 1 + Fase 2 + Fase 3 implementadas y validadas en Linux; pendiente build Windows)

## OBJETIVO DEL PROYECTO
Transformar DatioLabs en un sistema de gestion retail local-first para Windows, operable por personal de caja sin experiencia tecnica. Rubros soportados como modulos activables e independientes: ABASTO, PANADERIA, LICORERIA (1, 2 o los 3 simultaneos).

## DIRECTIVAS CONFIRMADAS POR EL NEGOCIO
1. **Plataforma**: Windows exclusivo (sin Mac/Linux). Empaquetado NSIS.
2. **Arranque en blanco**: sin ingesta inicial ni seeds. Primera ejecucion = asistente de configuracion. `datiolabs-driver-csv` fuera del camino critico.
3. **Modularidad**: capacidades compartidas implementadas una sola vez en core (union deduplicada al activar varios rubros).
4. **Anclaje de precios**: TODOS los precios autoritativos en USD. El bolivar es derivado (`bs = usd * tasa_bcv`) y nunca se persiste como precio fuente.
5. **Tasa BCV**: scrapper embebido en la app Tauri, refresco horario, cache offline con ultimo valor valido. Cada ticket persiste la tasa del dia como evento firmado SHA-256.
6. **Cuenta abierta** (licoreria, consumo en sitio): cada linea bloquea la tasa vigente al momento del consumo; stock se descuenta al agregar cada consumo; cierre posterior suma lineas con tasas heterogeneas.
7. **Cromatica**: numero en bolivares + porcentaje coloreado segun direccion del movimiento cambiario (verde sube / rojo baja), con implicacion contable sobre valor real del inventario.
8. **GUI dual**: prioridad critica la vista de caja para la cajera (botones grandes, busqueda simple, vuelto automatico, aviso de edad en alcohol). El dashboard se CONSERVA como panel del dueno del negocio: ventas, inventario critico, fluctuacion BCV e impacto contable, cuentas abiertas activas. Separacion por rol con clave: la cajera no ve el panel ni la configuracion.

## TABLA DE CAPACIDADES (fuente de verdad para Fase 2)
| Capacidad | Abasto | Panaderia | Licoreria |
|---|---|---|---|
| Venta unitaria / carrito / vuelto | Si | Si | Si |
| Venta por peso (kg) | Si | Si | No |
| Lotes horneado + caducidad | No | Si | No |
| Merma perecedero | Opcional | Si | No |
| Grado alcoholico + volumen envase | No | No | Si |
| Interbloqueo edad en venta | No | No | Si |
| Caja/unidad mayorista | Si | No | Si |
| Cuenta abierta (mesa/cliente) | No | No | Si |

## FASES
- [x] **Fase 1 - Scrapper BCV**: COMPLETADA Y VALIDADA
- [x] **Fase 2 - Nucleo vanilla**: COMPLETADA Y VALIDADA. `capacidades.rs` (bitmasks RUBRO_*/CAP_*, dedup por OR, validaciones puras), `modulos/{abasto,panaderia,licoreria}.rs` (lotes FEFO con merma, cierre de cuenta con tasa bloqueada por linea), models.rs (Producto, Catalogo SoA columnar, LineasVenta SoA, Venta con tasa_del_dia, MovimientoStock firmado, ConfigNegocio), db.rs 100% Result sin unwrap (arboles: tasas/productos/ventas/movimientos/lotes/config).
- [x] **Fase 3 - GUI dual**: COMPLETADA Y VALIDADA (tsc). Wizard inicial (nombre, rubros multiples, PIN dueno opcional) -> arranque en blanco real. Vista CAJA por defecto: busqueda grande con ENTER rapido, grilla de productos con precio Bs dominante, carrito, modal de cobro con vuelto calculado en vivo verde/rojo, interbloqueo +18 para alcohol, cuentas abiertas tipo chip con cierre liquidado por lineas. PANEL DEL DUENO tras PIN: KPIs 24h, top productos (Chart.js), inventario critico, alta de productos, entradas/mermas.
- [ ] **Fase 4 - Empaquetado**: build NSIS en Windows (`cargo tauri build`), iconos, instalador. UNICA TAREA PENDIENTE.

## FLUJO OPERATIVO IMPLEMENTADO
1. Primer arranque: wizard guarda ConfigNegocio (rubros activan capacidades por union OR deduplicada).
2. Dueno registra productos en su panel (precio USD autoritativo; Bs siempre derivado de tasa BCV vigente).
3. Cajera vende: total Bs = suma(usd * tasa actual); ticket persiste tasa_del_dia firmada SHA-256.
4. Licoreria: cuenta abierta por mesa/cliente; cada consumo congela su propia tasa; stock se descuenta al agregar; cierre consolida tasas heterogeneas.
5. Panaderia: lotes con horneado/caducidad; venta FEFO automatica; merma por lote.
6. Panel: KPIs 24h, criticos (stock<=5), top ventas, valor inventario USD/Bs.

## FASE 1 - DETALLE DE LO IMPLEMENTADO
- `datiolabs-core/src/models.rs`: struct `EventoTasaBcv` (Decimal con serde-str para compatibilidad bincode, timestamp unix, fuente, firma).
- `datiolabs-core/src/db.rs`: `DbError` (thiserror), `insertar_tasa()` firma SHA-256 antes de persistir, `ultimas_tasas()` orden cronologico descendente, arbol sled "tasas_bcv".
- `datiolabs-ui/src/tasa_bcv.rs`: ServicioTasa (scraping bcv.org.ve div.recuadrotsmc -> USD -> strong, coma->punto), reqwest rustls con danger_accept_invalid_certs (el portal BCV sirve cadena TLS incompleta: VERIFICADO), cache JSON offline, refresco horario, calculo fluctuacion % + DireccionTasa {Subio/Bajo/Estable}.
- `datiolabs-ui/src/lib.rs`: comandos Tauri `obtener_tasa_bcv` y `forzar_actualizacion_tasa`; loop horario arranca en setup(); api_get_inventory corregido (llamaba db.get_all_products() inexistente).
- `ui/src/tasa/BcvWidget.ts`: indicador en navbar (valor Bs/USD + % verde/rojo/gris), boton refresco manual, sondeo 5 min via __TAURI__.core.invoke.
- `tauri.conf.json`: bundle targets ["nsis"].
- Correcciones clippy preexistentes: impl Default para AnalyticsEngine, allow dead_code en EntropyGenerator.base_lambda.

## VALIDACION EJECUTADA (exit code 0)
- `cargo fmt --all -- --check`
- `cargo clippy -p datiolabs-core -p datiolabs-driver-csv --all-targets --all-features -- -D warnings`
- `cargo test --release`: 18 pruebas core (capacidades, FEFO multi-lote, cierre cuentas, config unica, stock atomico, firmas deterministas) + driver
- Scrape EN VIVO contra bcv.org.ve: 5/5 (crate espejo /tmp/opencode/tasa_check)
- Frontend: `tsc && vite build` estricto sin errores

## LIMITACIONES CONOCIDAS v1
1. Compilacion integral de `datiolabs-ui` pendiente en Windows (sin mingw/webkit aqui). Ejecutar `cargo tauri build` en el PC destino.
2. Merma con lote: si el SKU no existe, el descuento del lote ya quedo aplicado (ventana minima de inconsistencia; auditable por movimientos).
3. Umbral de inventario critico fijo en 5 (futura config por producto).
4. "Ventas 24h" usa ventana rodante de 24h, no dia calendario.
5. Archivos BI legacy de ui/src (WorkspaceView etc.) siguen compilando pero no se usan; eliminar en limpieza futura.
6. El scrapper requiere certificado BCV aceptado inseguro (cadena TLS incompleta del portal): verificado y acoplado.

## ENTORNO DE DESARROLLO
- rustc/cargo 1.97.1, target adicional x86_64-pc-windows-gnu instalado
- Node 20.20.2 (nodesource), node_modules presentes en ui/
- Disco: particion raiz 30G con ~9G libres. NO tocar proyectos fuera del workspace (nodex, agy).

## PROXIMO PASO
1. Compilar en Windows destino: `cargo tauri build` (valida el crate datiolabs-ui completo y genera instalador NSIS). Requisitos: Rust stable + Node 20 + WebView2.
2. Si el build falla, revisar en orden: dependencias de datiolabs-ui (Cargo.toml con scraper 0.25, sha2, uuid), comandos registrados en generate_handler, tipos camelCase del contrato DTO frontend/backend.
3. Limpieza opcional: eliminar ui/src/{views,viewmodels,models} legacy del dashboard BI mock.
4. Mejoras v1.x documentadas en LIMITACIONES CONOCIDAS.

## ESTADO DEL ARBOL GIT (critico)
Los cambios de Fases 1-3 NO estan commiteados: ~14 archivos modificados + nuevos directorios (capacidades.rs, modulos/, tasa_bcv.rs, ui/src/negocio/, ui/src/tasa/, ESTADO.md) sobre la base commit `747a351`. Hacer commit cuanto antes para evitar otra perdida como la ocurrida el 2026-08-25.
