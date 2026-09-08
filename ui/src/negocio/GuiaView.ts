export class GuiaView {
    private contenedor: HTMLElement;

    constructor(contenedor: HTMLElement) {
        this.contenedor = contenedor;
    }

    render(): void {
        this.contenedor.innerHTML = `
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black font-heading">Playbook Operativo ABC</h2>
                <p class="text-brand-text font-body text-xs sm:text-sm">Manual de procedimientos comerciales, directrices de uso y lectura analítica de DatioLabs</p>
            </div>
            <span class="bg-brand-black text-white px-3 py-1.5 rounded font-black font-heading text-xs uppercase tracking-wider">
                DOCUMENTACIÓN OFICIAL
            </span>
        </div>

        <!-- Tarjetas Resumen de los 5 Módulos Usables del Sistema -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            <div class="border-2 border-brand-black rounded-lg bg-amber-50 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-amber-900 uppercase">MÓDULO 01</span>
                <h4 class="font-heading font-black text-base mt-0.5">CAJA</h4>
                <p class="text-xs text-gray-700 mt-1">Cobro directo multimétodo (TRANSF.BS., DOL.CASH, BS.EFEC., ZELLE, BINAN.USDT, BIOPAGO, PUNTOD.VENTA, PAGO MOVIL), tasas dinámicas en divisas y pagos mixtos.</p>
            </div>
            <div class="border-2 border-brand-black rounded-lg bg-yellow-50 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-yellow-900 uppercase">MÓDULO 02</span>
                <h4 class="font-heading font-black text-base mt-0.5">CUENTAS</h4>
                <p class="text-xs text-gray-700 mt-1">Comandas en local y Deudas Abiertas por cliente, abonos libres acumulables y cobro multimétodo a tasa libre.</p>
            </div>
            <div class="border-2 border-brand-black rounded-lg bg-blue-50 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-blue-900 uppercase">MÓDULO 03</span>
                <h4 class="font-heading font-black text-base mt-0.5">VENTAS</h4>
                <p class="text-xs text-gray-700 mt-1">Historial de jornadas operativas con buscador en tiempo real, balance consolidado por turno y exportacion CSV individual por jornada.</p>
            </div>
            <div class="border-2 border-brand-black rounded-lg bg-emerald-50 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-emerald-900 uppercase">MÓDULO 04</span>
                <h4 class="font-heading font-black text-base mt-0.5">INVENTARIO</h4>
                <p class="text-xs text-gray-700 mt-1">Catálogo por categorías, conteo en un., fórmulas de margen, reposición (+ENTRADA), reducción y mermas.</p>
            </div>
            <div class="border-2 border-brand-black rounded-lg bg-slate-100 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-gray-800 uppercase">MÓDULO 05</span>
                <h4 class="font-heading font-black text-base mt-0.5">PANEL</h4>
                <p class="text-xs text-gray-700 mt-1">Diagnostico financiero por fechas, jornada activa con operadores multicajero, gestion de empleados (alta/edicion/baja) y configuracion de metodos de pago.</p>
            </div>
        </div>

        <div class="space-y-6">
            <!-- Módulo 1: CAJA -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">1</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo CAJA: Facturación Directa, Métodos de Pago y Tasa Blindada</h3>
                        <p class="text-xs text-gray-500 font-bold">Cobro multimétodo determinista sin descalce cambiario ni ventas con stock negativo</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Bloqueo de Tasa Oficial</strong>
                        Al abrir el ticket, la tasa oficial BCV se congela exclusivamente para esa operación. Las fluctuaciones externas no alteran el valor en Bolívares acordado.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Métodos de Pago y Cobro Mixto</strong>
                        Soporte nativo para métodos en Dólares (DOL.CASH, ZELLE, BINAN.USDT con tasas dinámicas editables al cobrar/abonar) y en Bolívares (TRANSF.BS., BS.EFEC., BIOPAGO, PUNTOD.VENTA, PAGO MOVIL), además de creación de métodos propios definidos en USD o Bs. Permite pagos mixtos multimétodo.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Protección y Vuelto Exacto</strong>
                        Calcula simultáneamente el balance en USD y Bs. Valida que el pago cubra el total requerido, emite vuelto al centavo e impide vender por encima del stock disponible.
                    </div>
                </div>
            </div>

            <!-- Módulo 2: CUENTAS -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">2</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo CUENTAS: Cuentas Activas en Local y Deudas Abiertas</h3>
                        <p class="text-xs text-gray-500 font-bold">Comandas para mesas y deudas comerciales a crédito con descuento de stock y liquidación a tasa libre</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Cuentas en Local vs. Deudas Comerciales</strong>
                        Permite dos modalidades: Cuentas Activas (mesas o barras liquidadas a la tasa del día) y Deudas Abiertas (crédito a clientes de confianza que permanecen abiertas por días descontando existencias físicas de almacén al instante).
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Abonos Libres y Saldo a Favor</strong>
                        El operador puede registrar abonos en Bs. o USD con tasas dinámicas por método (ej. USDT pactado a tasa superior a BCV acreditando el excedente a favor del cliente). Si el abono supera lo consumido, el saldo a favor resultante se liquida o se consolida como ganancia.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Liquidación a Tasa Libre</strong>
                        Las deudas abiertas no se atan rígidamente al BCV histórico: al cobrar, el dueño puede fijar libremente la tasa acordada con el cliente o cargar la tasa oficial del día con un solo clic.
                    </div>
                </div>
            </div>

            <!-- Módulo 3: VENTAS -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">3</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo VENTAS: Historial de Jornadas Operativas</h3>
                        <p class="text-xs text-gray-500 font-bold">Balance por turno, desglose de metodos de pago y exportacion CSV individual por jornada</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Acceso con Clave y Paginación</strong>
                        Protegido administrativamente con el PIN del dueño. Lista de jornadas acotada a 20 registros por página para navegación inmediata sin sobrecargar memoria ni degradar rendimiento.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Buscador en Tiempo Real</strong>
                        Filtra jornadas por ID, nombre de operador o cajero, fecha de apertura o cierre. El estado de expansión de cada jornada se preserva al filtrar.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Detalle por Jornada</strong>
                        Al expandir: operadores del turno, vuelto pagado y retenido, deudas liquidadas, entradas de stock, mermas, tasa de apertura y desglose de ingresos por método de pago.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Exportación CSV</strong>
                        Cada jornada tiene un botón CSV que descarga un archivo con encabezado completo del turno (operadores, totales, vueltos, SHA-256) y tabla de tickets con métodos de pago desglosados.
                    </div>
                </div>
            </div>

            <!-- Módulo 4: INVENTARIO -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">4</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo INVENTARIO: Catálogo por Categorías, Decimales y Movimientos</h3>
                        <p class="text-xs text-gray-500 font-bold">Agrupación por rubros, conteo exacto en un., fórmulas de margen, entradas, reducción y mermas</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Agrupación por Categorías</strong>
                        El inventario clasifica los artículos en pestañas por rubro, mostrando el conteo exacto de productos en cada categoría para facilitar auditorías físicas rápidas.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">+ ENTRADA (Reposición)</strong>
                        Aumenta las existencias en almacén producto de compras a distribuidores o producción interna, recalculando márgenes si cambia el costo.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">- REDUCIR (Ajuste Físico)</strong>
                        Rebaja existencias por corrección física de conteo o traslados entre sucursales sin imputarlo contablemente como merma o pérdida de capital.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">- MERMA (Deterioro)</strong>
                        Descuenta artículos vencidos, dañados o rotos, quedando registrado en la auditoría como merma física del negocio.
                    </div>
                </div>
            </div>

            <!-- Módulo 5: PANEL -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">5</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo PANEL: Diagnostico Financiero, Jornada y Configuracion</h3>
                        <p class="text-xs text-gray-500 font-bold">KPIs por rango de fechas, gestion de jornada multicajero, empleados y metodos de pago</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-body leading-relaxed text-gray-700 mb-4">
                    <div class="border border-brand-black rounded p-3 bg-amber-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">1. Ventas Totales en Rango</strong>
                        Ingresos brutos liquidados durante el período auditado (24h, 7D, 30D, 1A o rango exacto con fecha y hora).
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-emerald-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">2. Ganancia Bruta y Neta</strong>
                        Margen comercial directo descontando costo de compra (COGS) y utilidad líquida tras descontar impuestos.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-blue-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">3. Capital en Categorías</strong>
                        Desglose en tiempo real de cuánto dinero en bruto a precio de venta está inmovilizado en cada categoría del negocio.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-100">
                        <strong class="text-brand-black block font-heading font-black mb-1">4. Deudas Abiertas y PDF</strong>
                        Monitoreo del saldo por cobrar en deudas comerciales y generación de informe PDF con el período exacto y tabla de deudores.
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-slate-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">5. Jornada Activa y Multicajero</strong>
                        Muestra el estado de la jornada en curso, los cajeros activos simultaneamente (multicajero), el balance parcial del turno y los tickets emitidos. El dueno puede abrir, cerrar o asignar operadores al turno desde esta pantalla.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-slate-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">6. Gestion de Empleados</strong>
                        Registro de operadores con alta, edicion de nombre y baja. Los cambios de nombre se propagan automaticamente a la jornada activa. La baja limpia al operador de los turnos activos sin afectar el historial cerrado.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-slate-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">7. Metodos de Pago Aceptados</strong>
                        El dueno configura los metodos de pago disponibles (nombre y moneda USD o Bs). Puede agregar metodos propios del negocio o eliminar los existentes. El sistema garantiza al menos un metodo activo en todo momento.
                    </div>
                </div>
            </div>

            <!-- Procedimientos Operativos -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <div class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">O</div>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Procedimientos Operativos: Jornadas, Multicajero y Cobro Multimétodo</h3>
                        <p class="text-xs text-gray-500 font-bold">Instrucciones para apertura, gestion de cajeros simultaneos, inventario dual y cobro combinado con vuelto</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Apertura Directa, Multicajero y Cierre</strong>
                        Si no hay turno activo, el botón de cajero en Caja muestra "SIN TURNO ACTIVO", permitiendo al operador iniciar la jornada seleccionando los cajeros del día sin requerir clave de dueño. En cualquier momento se pueden agregar, editar y relevar cajeros simultáneos. El dueño finaliza y consolida el turno desde el Panel.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Paginación y Rendimiento a Largo Plazo</strong>
                        Todos los módulos históricos (Jornadas, Transacciones, Catálogo, Reposición y Cuentas) operan bajo paginación estricta con sanitización en tiempo real de montos y texto, garantizando fluidez constante sin consumo excesivo de memoria tras años de uso comercial.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Cobro Multimétodo y Vuelto Retenido</strong>
                        El sistema prioriza bolívares en la parte superior y divisas abajo. Si el cliente paga con varios medios (ej: Punto de Venta + Efectivo Divisas), el sistema reajusta automáticamente el saldo faltante. Si el cliente entrega un excedente, el cajero define si el vuelto fue entregado físicamente o retenido como saldo a favor.
                    </div>
                </div>
            </div>
        </div>`;
    }
}
