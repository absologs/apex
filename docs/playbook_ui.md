# APEX v1.0: Playbook de Interfaz y Flujos de Usuario (El "Loop Adictivo")

## 0. Filosofía de "Terminal Táctica" (Reglas Estrictas)
El diseño visual de APEX debe comportarse como un HUD Militar (Palantir-style). Esto exige restricciones de compilador:
- **Ausencia Absoluta de Luz:** Fondo `#0D0D0D`, paneles en `#0A0A0C`. Prohibido el uso de blancos para fondos.
- **Geometría Cruda:** Uso de `rounded-none`, ausencia total de sombras (`box-shadow`), favoreciendo bordes semitransparentes (`border-white/10`).
- **Acento Quirúrgico:** Un único color de alerta e indicación de salud: **Verde Neón** (`#ADFA1D`).
- **El Peligro (Dosis de Realidad):** La estética nunca puede opacar la funcionalidad.
  - *Legibilidad del Eje Y:* El minimalismo extremo puede ocultar escalas. Si no se puede distinguir entre un volumen de 10k o 100k de un vistazo, la herramienta falla en su propósito operativo.
  - *Densidad de Ruido:* Prefijos estéticos como "SYS.ID" otorgan atmósfera, pero no deben competir en contraste ni en peso visual con las métricas vitales de negocio.

## 1. Filosofía de Navegación Circular
El software no es un destino estático (una tabla que se consulta y se cierra), sino un motor de acción continua. El usuario debe verse atrapado en un *loop* táctico: **Diagnosticar -> Simular -> Actuar -> Verificar**.

### El Loop Principal (El Corazón de Apex):
1. **La Puerta de Entrada (Resumen):** El usuario abre la app. No ve un inventario aburrido, ve un "mapa de calor" de su capital. Detecta una alerta roja ("Capital Estancado" en *Cemento*).
2. **El Salto Táctico (Transición al War Room):** Desde la advertencia roja, un botón de "Resolver" no lo lleva a un formulario de edición, lo transporta instantáneamente al *War Room* con el SKU ya seleccionado y cargado en el simulador.
3. **La Maniobra (Simulación de Elasticidad o Bundling):** Juega con el deslizador. Descubre que bajando un 15% el precio solo debe vender 4 unidades más para compensar. Alternativamente, arrastra el SKU a un paquete con un producto héroe.
4. **La Acción (Ejecución):** Presiona "Validar Maniobra" o "Imprimir Etiquetas". El sistema confirma el blindaje del margen.
5. **El Retorno Triunfal:** El sistema lo devuelve al Resumen o le sugiere atacar la siguiente alerta roja. El cerebro recibe la dosis de dopamina por haber "rescatado" dólares que estaban muertos.

---

## 2. Definición de Módulos y Estados Visuales

### Módulo A: Resumen (Dashboard de Ingreso)
- **Objetivo:** Auditoría visual de la salud de liquidez ($H(t)$).
- **Interacción Clave:** 
  - Fila en Verde (Sano): Solo muestra un botón "Ver Rendimiento".
  - Fila en Ámbar (Alerta): Muestra sugerencia "Ajustar al Mínimo de Quiebre ($P_{floor}$)".
  - Fila en Rojo (Estancado): Muestra un botón urgente "Rescatar Capital" (Lleva al *War Room*).

### Módulo B: El War Room (Simulador de Elasticidad)
- **Objetivo:** Jugar con el futuro sin riesgo de ruina.
- **Interacción Clave:** 
  - Slider de Descuento: Desplaza un gráfico de barras interactivo.
  - El "Semáforo Vivo": El texto muta a medida que el slider se mueve. Pasa de "Seguro" a "Advertencia: Financiando al cliente" si perfora el $P_{floor}$.
  - Botón de Acción: "Fijar Precio y Generar Reporte de Promoción".

### Módulo C: Bundling (Creador de Combos Drag & Drop)
- **Objetivo:** Empaquetar capital estancado con alta rotación.
- **Interacción Clave:** 
  - Área de Staging (Dropzone): Arrastrar un producto de la columna "Héroes" y otro de "Anclas" a una zona central.
  - Calculadora Instantánea: Al soltar, la UI desglosa el costo de la caja conjunta y el margen resultante protegido.
  - Botón de Acción: "Imprimir Etiqueta del Combo".

### Módulo D: Radar de Clientes (Marketing de Precisión)
- **Objetivo:** Convertir el inventario muerto en ventas directas por WhatsApp.
- **Interacción Clave:** 
  - Tras generar una oferta en el *War Room* o *Bundling*, el sistema le pregunta: "¿A quién se lo ofrecemos?".
  - Selecciona un clúster ("Cazadores de Ofertas").
  - Botón de Acción: "Copiar Mensaje y Enviar".

---

## 3. La Agenda de Desarrollo de la GUI (To-Do de Refinamiento Extremo)

Para lograr el software "absoluto y adictivo", debemos implementar las siguientes piezas críticas en nuestro stack (Tauri + Tailwind + Vanilla JS):

1. **Flujos Enlazados (State Management):** Actualmente las pestañas están aisladas. Un clic en el panel de "Resumen" en un producto estancado debe inyectar el estado (`selected_sku`) y hacer *auto-switch* al tab del *War Room* utilizando eventos del DOM o el estado de Tauri.
2. **Micro-interacciones y Feedback Visual:** El deslizador del War Room debe estar atado a barras de progreso visuales reales fluidas, utilizando Tailwind y transiciones CSS para mutar suavemente (easing) del verde al rojo.
3. **Integración Gráfica 2D:** Requerimos mostrar la **Curva de Degradación Temporal** del producto utilizando bibliotecas ligeras de Vanilla JS (ej. ECharts o Chart.js). Ver esa curva de dinero caer es lo que genera el "miedo" y la urgencia de venta en el usuario.
4. **Layout Drag & Drop Real:** El sistema de combos debe abandonar las listas clickeables y convertirse en paneles físicos donde el usuario "arrastra" un héroe y lo suelta sobre el ancla usando el API HTML5 nativa de Drag & Drop interconectada con Tauri.
5. **Pop-ups Transaccionales (Modal de Retorno):** Al "Validar una Maniobra", lanzar un panel flotante (Modal en Tailwind) de celebración limpia ("Dólares rescatados") y un botón para volver al inventario y buscar la siguiente alerta.