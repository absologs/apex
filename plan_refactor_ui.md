# Plan de Refactorización de Interfaces (APEX y Marketplace)

## 1. Correcciones Globales de Comportamiento Nativo (Tauri v2 / HTML)
- [x] Modificar la etiqueta `<meta name="viewport">` en ambas aplicaciones para bloquear el zoom (`maximum-scale=1.0, user-scalable=no`).
- [x] Inyectar reglas CSS para ocultar las barras de desplazamiento (scrollbars) en ambas aplicaciones.
- [x] Ajustar el encuadre (padding superior) para respetar el área segura (Status Bar) del dispositivo móvil.

## 2. Refactorización del Oráculo / Motor Core (`apex-ui`)
- [x] Rediseñar la cabecera / barra superior para incluir el precio oficial del dólar (ahora inicializa automáticamente).
- [x] Simplificar la verbosidad compleja del texto y métricas, manteniendo el tono matemático pero legible.
- [x] **PIVOT:** Aplicar diseño premium estilo "Fusion" (Dark mode elegante `#101114`, bordes redondeados, tipografía `Inter`, acento naranja `#F26430`).
- [x] Eliminar todos los placeholders presentes en el HTML/JS y **PURGAR TODO EL DISEÑO HEREDADO** (Se eliminaron las vistas obsoletas cuadriculadas y el modo "POS").
- [x] **Responsividad:** Implementar un layout verdaderamente adaptativo (Sidebar colapsable en móvil, `flex-col` a `md:flex-row`).

## 3. Refactorización del ImportVCB B2C (`marketplace-ui`)
- [x] Adoptar un diseño Premium B2C: tipografía clara, fondos limpios, tarjetas de producto grandes y botones directos orientados a conversión.
- [x] Integrar el precio oficial del dólar en la cabecera (ahora sincronizado vía API).
- [x] Asegurar que el scroll vertical fluido se mantenga (sin barras visibles) y el comportamiento sea estrictamente móvil.
- [x] Eliminar cualquier placeholder de texto o imagen y **PURGAR APARIENCIA GENÉRICA** (Navbar pulida, diseño de tarjetas Premium, espaciado cohesivo).
- [x] **Responsividad:** Menú hamburguesa funcional, Hero banner elástico, Grid asimétrico que no colisiona en pantallas pequeñas.

## 4. Verificación y Compilación
- [x] Auditar el código bajo los estándares estrictos del repositorio (`cargo clippy` validado exitosamente sin advertencias en las últimas implementaciones).
- [x] Validar que la compilación de Tauri sea exitosa.
- [x] Bloqueo de compilación: No compilar nuevamente los APKs hasta recibir confirmación explícita (ESTADO ACTUAL: ESPERANDO APROBACIÓN).

## 5. Correcciones de Identidad y Sincronización API (Nuevos Requerimientos)
- [x] **Identidad Corporativa:** Purgar nombres genéricos. Renombrar la interfaz principal exclusivamente a **APEX** y el marketplace a **ImportVCB** en todo el código base y configuración interna (`tauri.conf.json`).
- [x] **API Dólar Real:** Reemplazar los valores "mock/dummy" en ambos proyectos por una conexión HTTP real a la API oficial (PyDolarVenezuela) manejando fallos con un fallback limpio.
