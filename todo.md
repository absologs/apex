# Plan Maestro y Lista de Tareas Pendientes (TODO) - DatioLabs Enterprise

Este documento consolida el estado y las tareas para llevar a producción el producto de datos empresarial / retail para Windows y su versión Demo interactiva en Cloudflare (`datiolabs.com/demo`).

---

## 1. Diseño Visual y Experiencia Nativa de Escritorio (UI/UX Clásica y Cuadriculada)
- [x] **Rediseño del Panel Móvil (`datiolabs-ui/panel.html`)**:
  - [x] Base clásica blanco/hueso (`#F4F3EF` / `#FFFFFF`) con bordes sólidos de 2px en tono pizarra (`#1E232A`).
  - [x] Botones mecánicos con micro-sombras sólidas y tipografía tabular legible.
  - [x] Barra de búsqueda rápida de productos en tiempo real con contador dinámico de stock y límites estrictos.
- [x] **Sensación Nativa de Escritorio en Desktop (`ui/src/`)**:
  - [x] Configuración de ventana Tauri 1280x850 con tema `Light` corporativo y límites estrictos (1024x700).
  - [x] Supresión de comportamientos web en `styles.css`: `user-select: none`, `overscroll-behavior: none` y bloqueo de arrastre de imágenes.
  - [x] Paleta visual unificada: blanco hueso `#F4F3EF`, tarjetas `#FFFFFF`, bordes `#1E232A`, cobalto `#2563EB`.
  - [x] Grilla de productos con indicadores de stock bajo, tipo de rubro y unidad de medida.
  - [x] Selector visual de variantes y campo de captura de número de serie con garantía en líneas de ticket.
  - [x] Blindaje de todos los campos de entrada de datos con `maxlength` físico exacto para prevenir desbordes de buffer.

---

## 2. Conectividad Móvil Directa P2P (Fuera de la Red Local)
- [x] **Emparejamiento WebRTC P2P Directo**:
  - [x] Modal interactivo de emparejamiento con código QR en navbar (`Conectar Móvil`).
  - [x] Comando `generar_qr_panel` acoplado a la IP de red y túnel P2P sin requerir abrir puertos en router.
  - [x] Acceso simultáneo desde navegador móvil vía URL directa y QR escaneable.

---

## 3. Demo Web Pública en Cloudflare (`datiolabs.com/demo`)
- [x] **Driver de Persistencia en Memoria / Mock Interactivo**:
  - [x] Capa `MockDemoStorage` en `ui/src/negocio/api.ts` que permite a usuarios web vender, crear productos, abrir cuentas y consultar KPIs sin backend nativo.
  - [x] Datos de demostración precargados (Panadería, Abasto, Licorería y Retail con series).
- [x] **Despliegue en Cloudflare Pages**:
  - [x] Proyecto `datiolabs-demo` creado y desplegado en Cloudflare con éxito.
  - [x] URL de producción activa: `https://datiolabs-demo.pages.dev`.

---

## 4. Endpoints y Conexión de Capacidades Retail (`datiolabs-core` -> `datiolabs-ui`)
- [x] **Exposición de Variantes, Series y Comisiones**:
  - [x] Sincronización de bits de rubro (`RUBRO_RETAIL`) y capacidades (`CAP_SERIE`, `CAP_VARIANTES`, `CAP_GARANTIA`, `CAP_COMISION`) entre core y UI.
  - [x] Captura y persistencia de serie y variante en cada línea de venta del carrito.
- [x] **Seguridad y Blindaje de Ingesta**:
  - [x] Configurado `DefaultBodyLimit` de 2MB en Axum para proteger la memoria contra cargas masivas.

---

## 5. Analítica Comercial para Usuario No Técnico y Gráficas Temporales
- [x] **Depuración de Residuos Teóricos**:
  - [x] Purgado `TensorR5`, `DataEvent` y `LabWorkspace` de `models.rs` y `ui/src/types.ts`.
  - [x] Implementado en `analytics.rs` el cálculo de métricas comprensibles de negocio (`MetricasPeriodo`: total USD/Bs, volumen de tickets y ticket promedio exacto).
- [x] **Rango Temporal y Visualización**:
  - [x] Implementado escaneo cronológico exacto en Sled (`consultar_ventas_rango` y `metricas_rango`).
  - [x] Selector interactivo de rango en el Panel del Dueño (`24H | 7D | 30D | 1A | TODO`).
  - [x] Motor de gráficos nativo SVG vectorial sin dependencias de red externas.

---

## 6. Integridad de Datos, Persistencia y Tasa Offline
- [x] **Sanitización del Core y Persistencia Criptográfica**:
  - [x] Formato binario de backup corregido con conteo exacto de registros y hashes SHA-256.
  - [x] Test de integridad `prop_backup_restore_integridad` habilitado y aprobado al 100%.
  - [x] Cero advertencias en `cargo clippy` y formato estricto en todo el workspace.
- [x] **Resiliencia Offline de la Tasa BCV**:
  - [x] Fallback automático a la última tasa persistida en Sled (`db.ultima_tasa()`) si no existe archivo de caché ni conexión a internet al arrancar.
- [x] **Catálogo Cerrado de Errores Tipados**:
  - [x] Control estricto documentado en `ERRORES.md` (`NE-XX`, `DB-XX`, `UI-XX`) sin volcados libres a disco.

---

## 7. Instalación y Activación por Clave de Licencia
- [x] **Pantalla de Licencia en el Asistente de Instalación (NSIS)**:
  - [x] Página personalizada interactiva en `installer.nsi` con diálogo `nsDialogs` para capturar la clave comercial antes de instalar.
  - [x] Validación obligatoria antes de proceder y almacenamiento seguro en el registro de Windows (`HKCU\Software\DatioLabs\LicenseKey`).
- [x] **Verificación en el Arranque del Ejecutable**:
  - [x] Eliminada la dependencia del archivo `serial.txt`.
  - [x] `DatioLabs.exe` consulta en tiempo de ejecución la clave autorizada en el registro de Windows antes de inicializar la aplicación.

---

## 8. Rigor de Dominio Legacy y Separación Estricta de Rubros
- [x] **Aislamiento Estricto de Cuentas Abiertas**:
  - [x] La funcionalidad de Cuentas Abiertas (mesas, comandas y consumos continuos) es exclusiva del rubro Licorería (`RUBRO_LICORERIA`).
  - [x] En Panadería y Abasto se oculta el botón `CUENTAS` del navbar y se elimina la tarjeta KPI de `Cuentas Abiertas` del Panel del Dueño, manteniendo la grilla de KPIs en 3 columnas limpias.
  - [x] Demos públicas desplegadas de forma independiente en `/licoreria` y `/panaderia` con persistencia aislada en LocalStorage.
- [x] **Ajustes de Dominio, Precios, Impuestos e Interfaz Solicitados**:
  - [x] **Estructura Financiera de Precios (Bruto vs Neto)**:
    - [x] Diferenciar explícitamente:
      - **Precio Bruto (Costo)**: Lo que le cuesta el producto al comerciante/empresario.
      - **Margen de Ganancia**: Porcentaje o monto agregado sobre el costo.
      - **Precio Neto**: Precio final visible al consumidor después de aplicar margen de ganancia e impuestos.
  - [x] **Gestión Configurable de Tasas de Impuestos**:
    - [x] Gestión de Tasas de Impuestos en el módulo INVENTARIO (Crear, Editar, Eliminar).
    - [x] Configuración inicial por defecto: 16% (General), 8% (Reducido) y 0% (Exento / Sin impuesto).
  - [x] **Control de Precisión y Truncado Numérico en Productos por Kilo**:
    - [x] Limitar físicamente los caracteres permitidos en inputs numéricos de peso (Kg).
    - [x] Corregir residuos de punto flotante (+14 decimales) redondeando a precisión estricta de 2 decimales (o 3 decimales para gramos).
    - [x] Acotar y truncar visualmente los nombres largos de productos en el ticket y la grilla para evitar deformaciones del layout.
  - [x] **Capacidad de Productos "Sin Control de Stock" (Servicios / Venta por Unidad Libre)**:
    - [x] Agregar casilla/opción al registrar producto para marcar "Sin control de stock" (útil para cigarrillos al detal, bolsas, servicios, hielo fraccionado).
    - [x] Excluir estos productos de alertas de inventario crítico y no decrementar stock numérico al vender.
  - [x] **Simplificación del Formulario de Registro de Producto (Sin Códigos Obligatorios)**:
    - [x] Eliminar la exigencia manual de SKU/Código en el formulario de alta.
    - [x] Registrar únicamente por **Nombre del Producto** (autogenerando internamente el identificador/SKU único de manera determinista).
  - [x] **Módulo Especializado e Independiente de INVENTARIO (Nueva GUI)**:
    - [x] Crear vista/pestaña dedicada `INVENTARIO` en la navegación (separando la administración de stock de la pantalla analítica del Panel).
    - [x] Diseñar GUI especializada con dos flujos claros y diferenciados:
      - **Añadir Producto**: Formulario de alta limpia (solo Nombre, Categoría, Precio Bruto/Costo, Margen de Ganancia, Tasa de Impuesto asociada, Stock inicial o flag "Sin control de stock").
      - **Añadir / Ajustar Stock**: Buscador interactivo por nombre de producto que permita ingresar directamente las unidades o kilos que ingresan (Entrada/Compra) o salen (Merma).
    - [x] **Gestión de Categorías**: Panel para crear, renombrar y eliminar categorías de productos (ej: Víveres, Licores, Embutidos, Panes).
    - [x] Integrar en esta misma sección de `INVENTARIO` la gestión de Tasas de Impuestos (16%, 8%, 0% y creación de personalizadas).
  - [x] **Analítica Avanzada de Ganancias y Métricas en el PANEL**:
    - [x] **Visualización Gráfica Circular / Pastel (Donut & Pie Charts)**:
      - [x] Sustituir las gráficas de barras tradicionales por diagramas circulares / de pastel vectoriales (SVG nativo o Chart.js con borde sólido neo-brutalista de 2px).
      - [x] Presentación de datos sólida y descriptiva: desglosar participación porcentual (%) exacta por producto/categoría, unidades vendidas, monto consolidado e ingresos relativos al lado del gráfico con etiquetas tabulares legibles.
    - [x] Filtro interactivo de métricas de rentabilidad en el Panel:
      - **Ganancia Bruta**: `Ingresos Totales - Costo de Mercancía Vendida (Precio Bruto)`.
      - **Ganancia Neta**: Ganancia tras deducir impuestos y costes comerciales.
      - **Ganancia Neta sin Impuesto**: Utilidad pura operativa de la empresa.
    - [x] Visualización dual en USD y en **Bolívares (Bs.)**:
      - El cálculo en Bs. se formula de manera histórica ponderada por la tasa BCV exacta a la que fue cerrada cada transacción individual, garantizando precisión contable sin distorsiones retroactivas por inflación o fluctuación cambiaria.
  - [x] **Evolución del Módulo de CUENTAS (Licorería / Cuentas Abiertas)**:
    - [x] **Abonos Parciales Durante la Apertura y Consumo**:
      - [x] Permitir registrar pagos anticipados / abonos parciales (en USD o Bs.) a una cuenta abierta en cualquier momento de su ciclo de vida.
      - [x] Reflejar en el detalle de la cuenta: `Total Consumido`, `Total Abonado` y `Saldo Pendiente por Liquidar`.
    - [x] **Buscador Rápido de Productos para Agregar Consumo**:
      - [x] Reemplazar la grilla estática o complementarla con un buscador predictivo en tiempo real para localizar productos inmediatamente por nombre sin tener que buscarlos visualmente uno por uno.
  - [x] **Determinismo y Congelamiento de Tasa durante la Venta (Invariante Antirace-Condition)**:
    - [x] **Regla de Bloqueo de Tasa en Caja**: Al añadir el primer producto al ticket, la tasa del BCV queda **congelada e inmutable** para esa transacción específica hasta su liquidación o cancelación.
    - [x] Si la tasa del sistema se actualiza automáticamente en segundo plano mientras el cajero está escaneando o cobrando, dicha actualización **no muta** el ticket en curso ni altera los precios en pantalla de esa venta abierta. La nueva tasa solo aplicará para el siguiente ticket en blanco.
  - [x] **Limpieza Visual del Navbar y Ajuste Espacial**:
    - [x] Eliminar el texto del nombre del negocio (`DatioLabs Licoreria/Panaderia`) del navbar; la barra debe quedar limpia sin esa etiqueta.
    - [x] Ajustar el espaciado (margen derecho o gap) entre el logo `DatioLabs.` y el primer botón (`PANEL`) para evitar que el punto quede pegado al botón.

---

## 9. Arquitectura de Seguridad Móvil, Licenciamiento, Respaldos y Escalabilidad Visual

- [x] **Robustez de Retícula para Cifras Masivas en Bolívares (Rango TODO / Inflación)**:
  - [x] Implementar formateador adaptativo con auto-escalado de fuente tipográfica (`clamp` / reducción dinámica de texto `text-2xl` a `text-lg`/`text-base` según longitud de caracteres).
  - [x] Contenedores KPI con protección `break-all` / `truncate` / tooltip con valor completo, evitando desbordamientos de celda o saltos que rompan la grilla cuando la cifra supere 9 o 12 dígitos.
  - [x] Notación abreviada inteligente (`Bs. 1.25M` o con separadores de millar garantizados sin desbordar el contenedor).

- [x] **Profundización y Enriquecimiento de Analytics en el Panel**:
  - [x] Gráficas circulares con selector de corte analítico:
    - Participación por Volumen (Unidades).
    - Participación por Facturación Bruta ($).
  - [x] Desglose de margen operativo global (35.0% global) y cálculo de ticket promedio ponderado.
  - [x] Indicadores de rotación y alertas de stock con código visual.

- [x] **Arquitectura y Seguridad de Conexión Móvil (Acceso Remoto del Dueño)**:
  - [x] **Flujo de Autenticación y Criptografía**:
    - Clave maestra/PIN definida durante la instalación o inicialización del sistema.
    - Generación de token de sesión firmado (JWT / HMAC SHA-256) con revocación manual.
  - [x] **Gestión de Dispositivos Conectados (Panel de Dispositivos)**:
    - Vista dedicada dentro de Conectar Móvil / Ajustes:
      - Nombre personalizado asignado al dispositivo al momento de conectarlo (ej. "iPhone 15 - Carlos", "Tablet Mostrador 1").
      - Dirección IP local/remota, fecha y hora del último acceso.
      - Estado (Activo / Sesión vigente).
      - Botón de revocación inmediata ("Desconectar").
  - [x] **Ingreso desde el Móvil**:
    - Al escanear el QR, el teléfono abre la interfaz optimizada (PWA / Web App local).
    - Solicita obligatoriamente la clave de seguridad definida al instalar.
    - Una vez autenticado, registra el dispositivo en la base local del servidor y mantiene el acceso seguro hasta caducidad o desconexión forzada.

- [x] **Modelo de Licenciamiento y Activación del Software**:
  - [x] Definición del esquema de licencias:
    - Licencia perpetua con soporte anual ligada al Hardware ID (Machine GUID de Windows / Firma de CPU).
    - Clave de licencia criptográfica offline validable deterministamente mediante firma Ed25519 sin requerir internet obligatorio.
    - Indicador de estado de licencia en el panel (Activa, Días restantes, Titular, Firma Hardware).

- [x] **Sistema de Respaldos (Backups) e Integridad Criptográfica**:
  - [x] Explicar e implementar la política de respaldos:
    - Generación de volcado snapshot en archivo comprimido con sello SHA-256.
    - Checksum SHA-256 embebido para verificar que la copia no ha sido corrompida ni adulterada externamente.
    - Exportación manual a pendrive/disco local (`+ CREAR COPIA`) con registro histórico de snapshots.
    - Mecanismo de restauración determinista con validación previa de integridad.

---

## 10. Empaquetado, Compilación Nativa y Distribución del Instalador Windows
- [ ] **Generación del Binario e Instalador Nativo Windows (`.exe` / NSIS)**:
  - Compilar el frontend y motor Rust con Tauri v2 en entorno Windows nativo (`x86_64-pc-windows-msvc`).
  - Generar el paquete NSIS: `DatioLabs_Retail_0.1.0_x64-setup.exe` mediante `datiolabs-ui/build-installer.bat`.
  - Calcular e incorporar checksum SHA-256 oficial del instalador.
- [ ] **Alojamiento y Distribución Segura**:
  - Servir la descarga del instalador desde el servidor o almacenamiento de objetos (R2 / GitHub Release).
  - Validar que el botón de descarga en `datiolabs.com/descargas` enlace al archivo binario verificado.

---

## 11. Auditoría, Rigor de Negocio y Correcciones Críticas de UX/UI

### 11.1 Integridad de Inventario y Validación Numérica Estricta
- [x] **Restricción de Enteros para Productos por Unidad (`un.`)**:
  - Prohibir cantidades decimales en productos cuya unidad sea `un.` (ej. no permitir agregar 0.1 de Coca-Cola).
  - Validar que solo los productos pesables (`kg`) o volumétricos (`ml`) admitan decimales.
- [x] **Eliminación Total de Venta por Stock Negativo y Consistencia en Reposición**:
  - Impedir que una venta se procese si la cantidad excede el stock disponible (a menos que tenga explícitamente activada la opción de "Venta Sin Stock / Servicio").
  - Corregir el cálculo de compra/reposición de stock para evitar estados incoherentes (ej. caso donde 0.1 + reposición terminó en 8.1).
- [x] **Unificación de Formato de Unidades en Toda la UI**:
  - Normalizar el texto de unidades a minúsculas (`un.`, `kg`, `ml`) en todas las vistas (Caja, Inventario, Catálogo) para evitar inconsistencias visuales (ej. `10 UN` frente a `4 un.`).

### 11.2 Gestión de Inventario y UX
- [x] **Operación de Eliminar Producto en Inventario**:
  - Incorporar la acción de eliminar producto junto a las opciones de `+ ENTRADA` y `- MERMA`.
- [x] **Eliminación de Textos Técnicos / Poco Amigables**:
  - Quitar el mensaje *"mostrando primeros resultados con paginación fluida"* y sustituirlo por una barra de estado o contador limpio y profesional.
- [x] **Fijación de Layout en Reposición de Stock**:
  - Bloquear las dimensiones del layout de las tarjetas y botones al presionar añadir stock para que no se deformen ni escalen los 3 botones de acción rompiendo la cuadrícula.

### 11.3 Registro de Productos y Fórmulas Financieras Bidireccionales
- [x] **Formulario de Registro de Productos Agnóstico**:
  - Limpiar los placeholders y ejemplos para que no mezclen rubros (licorería con panadería). Usar ejemplos neutrales y profesionales.
- [x] **Recálculo Bidireccional de Precios y Margen**:
  - Sincronizar bidireccionalmente el margen y el precio final: si el usuario muta el Precio Neto Final, recalcular automáticamente el Margen de Ganancia porcentual resultante (y viceversa).
- [x] **Alertas y Validaciones Estrictas en Formulario**:
  - Incorporar mensajes informativos y de validación claros cuando se ingresen valores inconsistentes, negativos o nulos antes de intentar enviar al motor Rust.

### 11.4 Panel del Dueño, Analítica y Presentación Gerencial
- [x] **Jerarquía Visual de Monedas en Ventas Totales**:
  - Reordenar la tarjeta de Ventas Totales: mostrar **Dólares ($) arriba en tamaño principal** y **Bolívares (Bs.) abajo como contraparte**.
- [x] **Estabilidad del Layout de Botones Temporales (`24H | 7D | 30D | 1A | TODO`)**:
  - Fijar el tamaño tipográfico y las dimensiones de los botones de rango temporal para que al seleccionar `7D` (u otro rango) los botones mantengan dimensiones bloqueadas sin alterar el ancho del contenedor.
- [x] **Sustitución por Pie Chart Macizo sin Desbordamiento Central**:
  - Reemplazar el gráfico donut con texto central por un **Pie Chart (gráfico de torta completo)** para evitar que números grandes de ventas quiebren o desborden el círculo central.
- [x] **Enmascaramiento de Clave de Licencia**:
  - Formatear la clave de licencia en el panel como: `0000XXXXXXXX0000` (ocultando el centro y mostrando únicamente los bloques inicial y final de ceros).
- [x] **Directorio Local Estricto para Respaldos**:
  - Establecer que los respaldos `.datio` se generen físicamente dentro del subdirectorio `Respaldos/` en la ruta de instalación del software, organizados con formato cronológico `NOMBRE-FECHA-HORA.datio`.
- [x] **Elevación de Rigor en Analítica y Métricas Gerenciales (Ciencia de Datos No Técnica)**:
  - Sustituir subtítulos genéricos como *"Participación Comercial"* por nomenclaturas ejecutivas (ej. *"Análisis de Concentración de Ingresos y Matriz ABC de Demanda"*).
  - Rediseñar las métricas operativas con indicadores de rigor analítico (ej. Índice de rotación de activos, dispersión de ticket promedio, concentración Pareto 80/20) explicados de forma intuitiva para empresarios no técnicos.
- [x] **Módulo de Histórico de Ventas y Clasificación de Transacciones**:
  - Incorporar un historial cronológico detallado de transacciones con fecha, hora, monto, cajero y clasificación explícita del canal: **VENTA DIRECTA** o **CONSUMO EN CUENTA**.
- [x] **Claridad Conceptual de KPIs Financieros en Tarjetas**:
  - Explicar y desglosar inequívocamente la diferencia en la UI entre:
    - **VENTAS TOTALES**: Facturación bruta cobrada en caja.
    - **GANANCIA BRUTA**: Ventas menos costo de adquisición/reposición de la mercancía.
    - **GANANCIA NETA**: Utilidad operativa final descontando impuestos y márgenes de merma.
    - **INVENTARIO TOTAL**: Valor monetario total del stock físico actualmente en depósito a precio de costo.

### 11.5 Blindaje Físico de Inputs y Guía Operativa Maestra (Playbook ABC)
- [x] **Límite Estricto de Caracteres (`maxlength`) en Todos los Inputs**:
  - Auditar y fijar límites físicos infranqueables en cada campo de texto, número, búsqueda, PIN, nombre y contraseña del sistema para garantizar protección contra entradas desmesuradas y respetar el determinismo de memoria.
- [x] **Módulo GUÍA (Playbook Operativo ABC para Clientes No Técnicos)**:
  - Crear una vista interactiva y accesible (`GUÍA`) con explicaciones directas, paso a paso y en lenguaje natural sin perder el rigor técnico de DatioLabs:
    1. **Ingesta y Catálogo**: Cómo dar de alta productos, asignarles unidades (`un.`, `kg`, `ml`), costos e impuestos.
    2. **Categorías y Clasificación**: Cómo organizar el stock para acelerar la venta.
    3. **Operación de Caja y Cuentas**: Venta directa frente a consumo abierto, abonos parciales y cobro en Bs. con tasa auditada.
    4. **Control de Inventario**: Cómo registrar entradas por compra, salidas por merma y eliminar artículos.
    5. **Seguridad y Acceso**: Clave maestra del dueño, cómo cambiarla y cómo proteger el panel frente a empleados.
    6. **Conexión Móvil P2P**: Cómo vincular el teléfono del dueño mediante QR para ver el negocio en tiempo real.
    7. **Respaldos Criptográficos (`.datio`)**: Dónde se guardan (carpeta `Respaldos/`), cómo trasladarlos a un pendrive y cómo reinstalar el negocio sin perder nada.
    8. **Lectura e Interpretación de Gráficos y Analítica Gerencial**: Cómo leer el Pie Chart de participación, qué significa la concentración de ventas, el margen comercial global, el índice de rotación y las alertas de reposición sin requerir conocimientos estadísticos.
### 11.6 Rigor Determinista Equivalente a Rust en la Capa Frontend (TypeScript/DOM)
- [x] **Invariante de Cero Estados Ambiguos en Frontend**:
  - Ninguna operación visual o de cálculo en el cliente puede generar `NaN`, `undefined`, valores negativos en inventario o divisiones por cero.
- [x] **Validación Estricta de Tipos y Rangos Previo al Despacho**:
  - Tipado cerrado y validación en tiempo de entrada en cada formulario:
    - Precios: `> 0.00` con 2 decimales exactos.
    - Stocks por unidad (`un.`): enteros no negativos `[0, 99999]`.
    - Stocks pesables/volumétricos (`kg`, `ml`): números racionales positivos normalizados.
    - Rechazo inmediato con alerta determinista ante caracteres inválidos o entradas fuera de rango antes de llamar a la API.
- [x] **Consistencia Matemática Simétrica entre Backend y Frontend**:
  - Toda operación de cálculo financiero (impuestos, márgenes brutos, márgenes netos, tasas congeladas y conversión a Bs.) en el frontend debe reflejar de forma idéntica la aritmética de punto fijo de `rust_decimal` del core.

---

## 12. Gestión de Productos por Caja y Despiece Atómico a Unidades

- [x] **Definición y Modelado de Producto por Caja**:
  - [x] Incorporar selector/casilla opcional en el formulario de alta de producto: `¿Viene por caja / bulto?` (configurable por el usuario).
  - [x] Captura de `unidadesPorCaja` (entero positivo estrictamente mayor a 1, ej: 10 unidades por caja de Ron Santa Teresa).
  - [x] Capacidad de definir la cantidad inicial ingresada en cajas al crear el producto, convirtiendo de forma determinista el stock total a unidades base (`stock_unidades = cajas * unidades_por_caja`).
- [x] **Edición y Reconfiguración de Producto**:
  - [x] Permitir modificar el parámetro `unidadesPorCaja` y el estado de empaque desde la vista de edición de producto en Inventario.
  - [x] Validación de consistencia para recalcular y preservar la equivalencia de existencias sin generar descuadres en el inventario físico.
- [x] **Visualización Dual de Existencias (Cajas + Unidades Sueltas)**:
  - [x] Mostrar en las tarjetas de inventario y catálogo el desglose simultáneo: `X cajas y Y unidades` (ej: `2 cajas y 4 unidades` calculado como `floor(stock / unidadesPorCaja)` y `stock % unidadesPorCaja`).
  - [x] Mantener visible el total consolidado de unidades base para evitar ambigüedades operativas.
- [x] **Venta y Descuento Atómico en Caja**:
  - [x] Registrar las ventas en caja a nivel de unidades individuales o fraccionadas.
  - [x] Descontar el stock atómicamente por unidad en cada transacción (`stock -= unidades_vendidas`), reflejando de inmediato la reducción proporcional en el contador de cajas y unidades restantes.

---

## 13. Arquitectura de Jornada Laboral (Apertura, Cierre, Operadores y Auditoría Operativa)

- [x] **Gestión de Operadores / Cajeros**:
  - [x] Módulo en el Panel del Dueño para crear, editar, listar y deshabilitar nombres de operadores comerciales (ej: María, Andrea, Carlos).
  - [x] Selector de operador activo al iniciar turno o relevar caja durante la jornada sin forzar cierre de la jornada global.
- [x] **Apertura y Cierre de Jornada Operativa**:
  - [x] Modelo de `JornadaLaboral` con soporte explícito inter-día (cruces de medianoche para turnos nocturnos, ej: de 12:20 PM a 04:30 AM del día siguiente).
  - [x] Control de estado de jornada (Abierta / Cerrada) con registro de marca temporal UNIX de inicio y fin.
  - [x] Persistencia y sellado atómico con checksum SHA-256 en Sled al momento del cierre.
- [x] **Reporte Integral de la Jornada ("La Película de la Operación")**:
  - [x] Sustituir métricas genéricas de reloj en el panel por el informe consolidado de la ventana de jornada:
    - **Total Ventas e Ingresos**: Desglose exacto en USD y Bs. por método de pago.
    - **Desglose de Vuelto**: Montos totales de vuelto entregado (`PAGADO`) vs excedentes retenidos (`RETENIDO`).
    - **Trazabilidad por Operador**: Ventas, tickets y franja horaria trabajada por cada cajero en el turno.
    - **Movimientos de Stock en el Turno**: Entradas por reposición (`+ COMPRA`), salidas por venta y mermas (`- MERMA`).
    - **Modificaciones de Precios**: Registro de alteraciones en precios o márgenes ocurridas durante la jornada.
    - **Cuentas y Deudas**: Deudas abiertas, consumos anotados y saldos liquidados en la jornada.
    - **Tasas BCV Utilizadas**: Tasas pactadas o del día bajo las cuales se facturó.
    - **Dispositivos y Conexiones**: Registro de terminales conectadas en esa ventana.

---

## 14. Jerarquía de Métodos de Pago y Privacidad de Inventario

- [x] **Jerarquía Estricta de Métodos de Pago**:
  - [x] Bloque superior (Bolívares - mayor frecuencia de uso):
    1. `PUNTOD.VENTA`
    2. `BIOPAGO`
    3. `PAGO MOVIL`
    4. `TRANSF.BS.`
    5. `BS.EFEC.`
  - [x] Bloque inferior (Divisas):
    - `DOL.CASH`
    - `ZELLE`
    - `BINAN.USDT`
- [x] **Privacidad de Inventario Configurable al Instalar**:
  - [x] Incorporar en el wizard de instalación la opción de visibilidad de inventario:
    - **Solo Dueño (Bloqueado con Clave)**: La pestaña de Inventario y las cantidades de stock quedan restringidas; los cajeros solo ven si hay o no disponibilidad sin conocer el valor monetario ni las existencias globales.
    - **Visibilidad Abierta**: Acceso estándar para negocios familiares o unipersonales.

---

## 15. Corrección de Recálculo Inmediato de Totales al Agregar Productos

- [x] **Recálculo Reactivo al Añadir Productos en Modal de Cobro (Caja y Cuentas)**:
  - [x] Corregir la persistencia y refresco del total a pagar cuando el cajero presiona "AGREGAR MÁS PRODUCTOS (VOLVER A CAJA/CUENTA)" y suma nuevos ítems.
  - [x] Actualizar automáticamente el monto total exigido en pantalla (USD y Bs. a la tasa congelada), recalculando en tiempo real la cobertura frente a los métodos de pago ya ingresados en borrador, eliminando la necesidad de que el operador haga cálculos manuales.

---

## 16. Actualización de la GUÍA Operativa Maestra (Playbook ABC)

- [x] **Incorporación de Nuevos Flujos en la Vista GUÍA**:
  - [x] Paso a paso de **Jornadas Laborales**: cómo abrir jornada, cómo relevar operadores durante el día y cómo emitir el cierre final.
  - [x] Explicación de **Despiece de Cajas a Unidades**: cómo registrar productos por caja y cómo el sistema descuenta por unidad vendida.
  - [x] Guía de **Cobro Multimétodo y Vuelto**: cómo registrar pagos combinados (Punto + Efectivo + Zelle) y cómo se marca el vuelto pagado vs retenido.
  - [x] Consulta y lectura del **Reporte de Jornada**: interpretación de la auditoría de caja sin tecnicismos contables.

---

## 17. Configuración de Umbrales de Salud del Stock (Semáforo Personalizado)

- [x] **Módulo de Salud del Stock en el Panel del Dueño**:
  - [x] Controles numéricos configurables por el dueño para definir los límites exactos de existencias:
    - **Stock Rojo (Crítico / Quiebre Inminente)**: Límite inferior de unidades (ej: menor o igual a 5 un.).
    - **Stock Amarillo (Alerta / Reposición Sugerida)**: Rango de advertencia preventiva (ej: entre 6 y 15 un.).
    - **Stock Verde (Saludable / Abastecido)**: Existencias óptimas (ej: mayor a 15 un.).
  - [x] Persistencia local de estos umbrales en la configuración del negocio.
  - [x] Aplicación reactiva de estos colores e indicadores visuales en las grillas de Caja, Inventario y el Semáforo de Reposición del Panel.

---

## 18. Claves de Licencia por Rubro y Cobertura Transversal de Negocio

- [x] **Esquema Cerrado de Claves de Licencia por Rubro**:
  - [x] **Licorería**: `0000888811110000` (Activa Cuentas Abiertas, Consumos Continuos, Abonos y Despiece de Cajas).
  - [x] **Panadería**: `0000888822220000` (Activa Lotes FEFO, Vencimientos y Productos Pesables).
  - [x] **Retail**: `0000888833330000` (Activa Series, Variantes, Garantías y Comisiones).
  - [x] Validación determinista de la clave ingresada durante la instalación y en el arranque del sistema, verificando correspondencia con el rubro configurado.
  - [x] Enmascaramiento visual en el Panel del Dueño respetando la máscara: `0000XXXXXXXX0000`.
- [x] **Cobertura Transversal en los 3 Tipos de Negocio**:
  - [x] Asegurar que las capacidades de **Jornadas Laborales**, **Control de Operadores**, **Despiece de Cajas/Unidades**, **Multimétodo con Vuelto Pagado/Retenido**, **Privacidad de Inventario** y **Semáforo de Salud del Stock** apliquen de manera homogénea y limpia tanto a Licorería, Panadería como a Retail.

---

## 19. Filosofía de Software 100% Agnóstico y Universalización de Cuentas / Deudas

- [x] **Interfaz y Vocabulario 100% Agnóstico**:
  - [x] Erradicar en todo el frontend textos, placeholders, ejemplos o etiquetas específicos de un rubro concreto (cero menciones a "bultos de licor", "cajas de harina", marcas específicas o jerga sectorial).
  - [x] Terminología universal, técnica y limpia en formularios y tablas: `Empaque / Caja`, `Unidades por Empaque`, `Artículo`, `Categoría`, `Proveedor`.
- [x] **Universalización de CUENTAS para Panadería y Retail (Gestión de Deudas Comerciales)**:
  - [x] Habilitar el módulo `CUENTAS` en el navbar tanto para **Panadería** como para **Retail**, restringido estrictamente a la modalidad **Deudas / Crédito Comercial a Clientes**.
  - [x] La modalidad de "Consumo Abierto en Mesa / Local" permanece exclusiva de Licorería, mientras que Panadería y Retail disponen de la gestión de créditos, abonos parciales y liquidación de deudas comerciales pendientes.

---

## 20. Conectividad Móvil P2P Soberana, Local-First y Descentralizada (Sin Servidores Propios)

- [x] **Independencia Total de Infraestructura Externa (Licencia Perpetua Inmortal)**:
  - [x] Cero dependencias de servidores propietarios, dominios intermedios (`datiolabs.com`) o servicios en la nube de pago para el enlace entre PC y teléfono móvil. El sistema debe operar indefinidamente sin costes recurrentes ni riesgo de obsolescencia si un servidor central desaparece.
- [x] **Direccionamiento Criptográfico por Clave Pública (Public-Key Addressing)**:
  - [x] El terminal de caja genera un par de claves asimétricas Ed25519 en su base de datos local Sled.
  - [x] La "dirección" del negocio no es un dominio ni una IP fija, sino la identidad criptográfica de la máquina.
- [x] **Descubrimiento y Apertura Autónoma de NAT (NAT Traversal Puro)**:
  - [x] **Dentro del WiFi / LAN**: Descubrimiento dinámico de servicio local vía mDNS (`.local`) para tolerar cambios de IP por DHCP sin re-escanear el QR.
  - [x] **Fuera del Negocio (Datos Móviles 4G/5G)**: Negociación de enlace directo mediante Hole Punching UDP con servidores STUN públicos estándar de la IETF (Cloudflare `stun.cloudflare.com:3478` y Google `stun.l.google.com:19302`).
  - [x] Apertura automática de puerto temporal mediante protocolos estándar de router (UPnP / NAT-PMP).
- [x] **Canal Cifrado de Punto a Punto (DTLS / WebRTC DataChannel)**:
  - [x] Tráfico de datos transmitido exclusivamente entre el teléfono del dueño y el binario de la PC, encriptado de extremo a extremo sin intermediarios.
  - [x] Reconexión automática transparente (ICE Restart) ante saltos de red o cambios de IP pública/privada en el dispositivo móvil o en la computadora de la caja.
