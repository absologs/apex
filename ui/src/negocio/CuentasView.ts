import { api, CuentaAbierta, MetodoPagoConfig, MonedaMetodo, PagoTicket, ProductoInfo, ResolucionVuelto } from "./api";
import { NegocioModel } from "./NegocioModel";

const parseNum = (n: unknown): number => {
    if (typeof n === "number") return Number.isFinite(n) ? n : 0;
    if (n === null || n === undefined) return 0;
    let s = String(n).trim();
    if (!s) return 0;
    if (s.includes(",") && !s.includes(".")) {
        s = s.replace(",", ".");
    } else if (s.includes(".") && s.includes(",")) {
        s = s.replace(/\./g, "").replace(",", ".");
    }
    const val = parseFloat(s);
    return Number.isFinite(val) && !isNaN(val) ? val : 0;
};

const fmt = (n: number | string | undefined | null): string =>
    parseNum(n).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const sanitizarInputDecimal = (
    inputEl: HTMLInputElement,
    maxValor: number,
    maxLongitud: number,
    onInputCallback?: () => void,
): void => {
    inputEl.maxLength = maxLongitud;
    inputEl.addEventListener("input", () => {
        let val = inputEl.value.replace(/[^0-9.,]/g, "");
        const partes = val.split(/[.,]/);
        if (partes.length > 2) {
            val = partes[0] + "." + partes.slice(1).join("");
        }
        if (val.length > maxLongitud) {
            val = val.slice(0, maxLongitud);
        }
        const num = parseNum(val);
        if (Number.isFinite(num) && num > maxValor) {
            val = String(maxValor);
        }
        if (inputEl.value !== val) {
            inputEl.value = val;
        }
        if (onInputCallback) onInputCallback();
    });
};

const sanitizarInputTexto = (
    inputEl: HTMLInputElement,
    maxLongitud: number,
    permitirEspeciales: boolean = false,
): void => {
    inputEl.maxLength = maxLongitud;
    inputEl.addEventListener("input", () => {
        let val = permitirEspeciales
            ? inputEl.value.replace(/[<>{}\\]/g, "")
            : inputEl.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,/_#-]/g, "");
        if (val.length > maxLongitud) {
            val = val.slice(0, maxLongitud);
        }
        if (inputEl.value !== val) {
            inputEl.value = val;
        }
    });
};

function calcularAntiguedad(fechaUnix?: number): string {
    if (!fechaUnix) return "Hoy";
    const ahora = Math.floor(Date.now() / 1000);
    const diff = Math.max(0, ahora - fechaUnix);
    if (diff < 3600) return "Hoy (reciente)";
    const horas = Math.floor(diff / 3600);
    if (horas < 24) return `Hoy (hace ${horas}h)`;
    const dias = Math.floor(horas / 24);
    if (dias === 1) return "Hace 1 día";
    return `Hace ${dias} días`;
}

export class CuentasView {
    private contenedor: HTMLElement;
    private modal: HTMLElement;
    private modelo: NegocioModel;
    private cuentas: CuentaAbierta[] = [];
    private productos: ProductoInfo[] = [];
    private cuentaSeleccionada: CuentaAbierta | null = null;
    private filtroTab: "todas" | "activa" | "deuda" = "todas";
    private readonly POR_PAGINA_CUENTAS = 15;
    private paginaCuentas: number = 1;
    private pagosBorradorPorCuenta: Map<string, Array<{
        id: string;
        metodo: string;
        moneda: MonedaMetodo;
        monto: number;
        tasaCambio: number;
        referencia: string;
    }>> = new Map();
    private resolucionVueltoPorCuenta: Map<string, {
        estado: 'PAGADO' | 'RETENIDO';
        metodo: string;
        tasa: number;
    }> = new Map();

    constructor(contenedor: HTMLElement, modal: HTMLElement, modelo: NegocioModel) {
        this.contenedor = contenedor;
        this.modal = modal;
        this.modelo = modelo;
    }

    async render(): Promise<void> {
        [this.cuentas, this.productos] = await Promise.all([
            api.cuentas(),
            api.productos(),
        ]);


        const esLicoreria = this.modelo.tieneRubro(4);
        if (!esLicoreria && this.filtroTab === "activa") {
            this.filtroTab = "deuda";
        }

        const cuentasActivas = this.cuentas.filter((c) => (c.tipo || "activa") === "activa");
        const deudas = this.cuentas.filter((c) => c.tipo === "deuda");

        const cuentasAMostrar = this.cuentas.filter((c) => {
            if (!esLicoreria) return c.tipo === "deuda";
            if (this.filtroTab === "activa") return (c.tipo || "activa") === "activa";
            if (this.filtroTab === "deuda") return c.tipo === "deuda";
            return true;
        });

        if (this.cuentaSeleccionada) {
            this.cuentaSeleccionada = this.cuentas.find((c) => c.ventaId === this.cuentaSeleccionada?.ventaId) || null;
        }
        if (this.cuentaSeleccionada && !cuentasAMostrar.some((c) => c.ventaId === this.cuentaSeleccionada?.ventaId)) {
            this.cuentaSeleccionada = cuentasAMostrar[0] || null;
        } else if (!this.cuentaSeleccionada && cuentasAMostrar.length > 0) {
            this.cuentaSeleccionada = cuentasAMostrar[0];
        }

        const tasa = this.modelo.tasaActual || 807.39;

        let deudasAbiertasUsd = 0;
        deudas.forEach((d) => {
            const tot = parseNum(d.totalParcialUsd);
            const abo = parseNum(d.abonosUsd);
            deudasAbiertasUsd += Math.max(0, tot - abo);
        });
        const deudasAbiertasBs = deudasAbiertasUsd * tasa;

        let saldoActivasUsd = 0;
        cuentasActivas.forEach((c) => {
            const tot = parseNum(c.totalParcialUsd);
            const abo = parseNum(c.abonosUsd);
            saldoActivasUsd += Math.max(0, tot - abo);
        });

        const totalAbonosUsd = this.cuentas.reduce((acc, c) => acc + parseNum(c.abonosUsd), 0);

        this.contenedor.innerHTML = `
        <div class="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black font-heading">${esLicoreria ? 'Cuentas Abiertas y Deudas' : 'Deudas Comerciales a Clientes'}</h2>
                <p class="text-brand-text font-body text-xs sm:text-sm">${esLicoreria ? 'Control de comandas activas en local y deudas comerciales a crédito con liquidación a tasa libre' : 'Gestión de crédito comercial a clientes de confianza con liquidación a tasa libre'}</p>
            </div>
            <div class="flex items-center gap-2">
                <button id="btn-nueva-deuda" class="bg-amber-400 hover:bg-amber-500 text-brand-black px-3 sm:px-4 py-2 sm:py-2.5 rounded font-heading font-black text-xs sm:text-sm border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                    <span class="text-base sm:text-lg leading-none">+</span>
                    <span>REGISTRAR DEUDA</span>
                </button>
                ${esLicoreria ? `
                <button id="btn-nueva-cuenta" class="bg-brand-black text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded font-heading font-black text-xs sm:text-sm border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                    <span class="text-base sm:text-lg leading-none">+</span>
                    <span>ABRIR CUENTA</span>
                </button>` : ''}
            </div>
        </div>

        <!-- Banner de Métricas y Deudas Abiertas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 sm:mb-6">
            <div class="bg-amber-50 border-2 border-brand-black rounded-lg p-3 sm:p-4 shadow-brutal-sm">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-amber-900 tracking-wider">Deudas Abiertas</span>
                    <span class="bg-amber-200 text-amber-950 font-black text-[10px] px-1.5 py-0.5 rounded border border-amber-400">${deudas.length} pendientes</span>
                </div>
                <p class="font-heading font-black text-2xl sm:text-3xl text-amber-950 mt-1">$ ${fmt(deudasAbiertasUsd)}</p>
                <p class="text-xs font-bold text-amber-800">Bs. ${fmt(deudasAbiertasBs)} <span class="text-[10px] text-amber-700">(tasa ref.)</span></p>
            </div>

            <div class="bg-white border-2 border-brand-black rounded-lg p-3 sm:p-4 shadow-brutal-sm">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-gray-600 tracking-wider">Cuentas en Local</span>
                    <span class="bg-blue-100 text-blue-900 font-black text-[10px] px-1.5 py-0.5 rounded border border-blue-300">${cuentasActivas.length} activas</span>
                </div>
                <p class="font-heading font-black text-2xl sm:text-3xl text-brand-black mt-1">$ ${fmt(saldoActivasUsd)}</p>
                <p class="text-xs font-bold text-gray-500">Saldo pendiente de cobro</p>
            </div>

            <div class="bg-white border-2 border-brand-black rounded-lg p-3 sm:p-4 shadow-brutal-sm">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-gray-600 tracking-wider">Abonos Recaudados</span>
                    <span class="bg-emerald-100 text-emerald-900 font-black text-[10px] px-1.5 py-0.5 rounded border border-emerald-300">Anticipos</span>
                </div>
                <p class="font-heading font-black text-2xl sm:text-3xl text-emerald-700 mt-1">$ ${fmt(totalAbonosUsd)}</p>
                <p class="text-xs font-bold text-gray-500">Bs. ${fmt(totalAbonosUsd * tasa)}</p>
            </div>

            <div class="bg-white border-2 border-brand-black rounded-lg p-3 sm:p-4 shadow-brutal-sm">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-gray-600 tracking-wider">Tasa Oficial del Día</span>
                    <span class="bg-gray-100 text-gray-800 font-black text-[10px] px-1.5 py-0.5 rounded border border-gray-300">BCV</span>
                </div>
                <p class="font-heading font-black text-xl sm:text-2xl text-brand-black mt-1">Bs. ${fmt(tasa)}</p>
                <p class="text-[11px] font-bold text-gray-500">Referencia (liquidación a tasa libre)</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            <!-- Columna de Cuentas y Deudas -->
            <div class="space-y-3">
                <!-- Selector de Pestañas -->
                ${esLicoreria ? `
                <div class="flex border-2 border-brand-black rounded bg-gray-100 p-1 shadow-brutal-sm">
                    <button id="tab-todas" class="flex-1 py-1.5 font-heading font-black text-xs rounded transition-colors ${this.filtroTab === "todas" ? "bg-brand-black text-white" : "text-brand-black hover:bg-white"}">
                        TODAS (${this.cuentas.length})
                    </button>
                    <button id="tab-activas" class="flex-1 py-1.5 font-heading font-black text-xs rounded transition-colors ${this.filtroTab === "activa" ? "bg-brand-black text-white" : "text-brand-black hover:bg-white"}">
                        ACTIVAS (${cuentasActivas.length})
                    </button>
                    <button id="tab-deudas" class="flex-1 py-1.5 font-heading font-black text-xs rounded transition-colors ${this.filtroTab === "deuda" ? "bg-amber-400 text-brand-black font-black" : "text-brand-black hover:bg-white"}">
                        DEUDAS (${deudas.length})
                    </button>
                </div>` : `
                <div class="border-2 border-brand-black rounded bg-amber-100 p-2 shadow-brutal-sm flex items-center justify-between">
                    <span class="font-heading font-black text-xs text-amber-950 uppercase">Crédito Comercial a Clientes</span>
                    <span class="font-mono font-black text-xs bg-amber-200 border border-amber-400 px-2 py-0.5 rounded text-amber-950">${deudas.length} pendientes</span>
                </div>
                `}

                <div id="cuentas-lista" class="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                    ${cuentasAMostrar.length === 0
                        ? `<div class="bg-white border-2 border-brand-black rounded-lg p-6 text-center text-brand-text font-bold">
                            No hay registros en la sección seleccionada.
                        </div>`
                        : (() => {
                            const totalPag = Math.ceil(cuentasAMostrar.length / this.POR_PAGINA_CUENTAS);
                            if (this.paginaCuentas > totalPag) this.paginaCuentas = totalPag;
                            if (this.paginaCuentas < 1) this.paginaCuentas = 1;
                            const inicio = (this.paginaCuentas - 1) * this.POR_PAGINA_CUENTAS;
                            const pagina = cuentasAMostrar.slice(inicio, inicio + this.POR_PAGINA_CUENTAS);

                            return pagina.map((c) => {
                            const esDeuda = c.tipo === "deuda";
                            const totU = parseNum(c.totalParcialUsd);
                            const aboU = parseNum(c.abonosUsd);
                            const pendU = Math.max(0, totU - aboU);
                            const favorU = Math.max(0, aboU - totU);
                            const esSel = this.cuentaSeleccionada?.ventaId === c.ventaId;
                            const antiguedad = calcularAntiguedad(c.fechaCreacionUnix);

                            let cardClases = "cursor-pointer border-2 border-brand-black rounded-lg p-3 sm:p-4 transition-all ";
                            if (esSel) {
                                cardClases += esDeuda
                                    ? "bg-amber-50 text-brand-black border-l-[6px] border-l-amber-600 shadow-brutal ring-1 ring-amber-500/20"
                                    : "bg-blue-50 text-brand-black border-l-[6px] border-l-blue-600 shadow-brutal ring-1 ring-blue-500/20";
                            } else {
                                cardClases += esDeuda
                                    ? "bg-stone-50 border-l-4 border-l-amber-300 text-brand-black shadow-brutal-sm hover:bg-amber-50/60 hover:-translate-y-0.5"
                                    : "bg-stone-50 border-l-4 border-l-blue-200 text-brand-black shadow-brutal-sm hover:bg-blue-50/50 hover:-translate-y-0.5";
                            }

                            return `
                        <div data-cuenta-id="${c.ventaId}" class="${cardClases}">
                            <div class="flex justify-between items-start gap-2">
                                <div>
                                    <div class="flex items-center gap-1.5">
                                        <span class="font-heading font-black text-base sm:text-lg leading-snug">${c.etiqueta}</span>
                                        ${esDeuda
                                            ? `<span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-400 bg-amber-100 text-amber-900">DEUDA</span>`
                                            : `<span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-blue-300 bg-blue-100 text-blue-900">LOCAL</span>`}
                                    </div>
                                    <p class="text-[11px] font-mono font-bold text-gray-500 mt-0.5">
                                        ${esDeuda ? `${antiguedad} · ` : ""}${c.ventaId.slice(0, 9)}
                                    </p>
                                    ${c.nota ? `<p class="text-[11px] italic font-semibold text-gray-600 mt-0.5 line-clamp-1">Nota: ${c.nota}</p>` : ""}
                                </div>
                                <div class="text-right shrink-0">
                                    <p class="font-heading font-black text-base sm:text-lg text-brand-black">$${fmt(c.totalParcialUsd)}</p>
                                    ${favorU > 0
                                        ? `<p class="text-[11px] font-black text-emerald-700">A favor: +$${fmt(favorU)}</p>`
                                        : pendU > 0
                                        ? `<p class="text-xs font-bold ${esDeuda ? "text-amber-900" : "text-blue-900"}">Pend: $${fmt(pendU)}</p>`
                                        : `<p class="text-[11px] font-bold text-gray-400">Cubierta ($0,00)</p>`}
                                </div>
                            </div>
                            <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 text-[11px] font-bold text-gray-600">
                                <span>${c.lineas} consumos</span>
                                <span>Abonado: <strong class="text-brand-black">$${fmt(c.abonosUsd)}</strong></span>
                            </div>
                        </div>`;
                        }).join("");
                        })()}
                </div>
                ${(() => {
                    const totalPag = Math.ceil(cuentasAMostrar.length / this.POR_PAGINA_CUENTAS);
                    if (totalPag <= 1) return "";
                    return `
                    <div class="flex items-center justify-between border-2 border-brand-black rounded bg-white p-2 mt-2 shadow-brutal-sm">
                        <span class="text-[10px] font-bold text-gray-600">Pág. ${this.paginaCuentas} de ${totalPag} (${cuentasAMostrar.length} reg.)</span>
                        <div class="flex gap-1">
                            <button id="cta-pag-ant" class="border-2 border-brand-black px-2 py-0.5 rounded text-[10px] font-heading font-black shadow-brutal-sm ${this.paginaCuentas === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-100'}">ANT.</button>
                            <button id="cta-pag-sig" class="border-2 border-brand-black px-2 py-0.5 rounded text-[10px] font-heading font-black shadow-brutal-sm ${this.paginaCuentas === totalPag ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-100'}">SIG.</button>
                        </div>
                    </div>`;
                })()}
            </div>

            <!-- Columna de Detalle / Añadir Consumo / Cobrar -->
            <div class="lg:col-span-2">
                ${this.cuentaSeleccionada ? (() => {
                    const esDeuda = this.cuentaSeleccionada.tipo === "deuda";
                    const totU = parseNum(this.cuentaSeleccionada.totalParcialUsd);
                    const aboU = parseNum(this.cuentaSeleccionada.abonosUsd);
                    const pendU = Math.max(0, totU - aboU);
                    const favorU = Math.max(0, aboU - totU);
                    const antiguedad = calcularAntiguedad(this.cuentaSeleccionada.fechaCreacionUnix);

                    return `
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 flex flex-col space-y-4">
                    <!-- Banner Distintivo del Tipo de Registro -->
                    ${esDeuda ? `
                    <div class="bg-amber-50/70 border-2 border-brand-black border-l-[6px] border-l-amber-600 rounded p-3 text-xs text-amber-950 flex flex-wrap justify-between items-center gap-2">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-amber-500 border border-brand-black shrink-0"></span>
                            <div>
                                <p class="font-heading font-black text-sm uppercase">DEUDA COMERCIAL / FIADO PENDIENTE</p>
                                <p class="text-[11px] font-bold text-amber-900 mt-0.5">
                                    Cliente: <strong>${this.cuentaSeleccionada.cliente || this.cuentaSeleccionada.etiqueta}</strong> · Creada: <strong>${this.cuentaSeleccionada.fechaCreacionStr || antiguedad}</strong>
                                    ${this.cuentaSeleccionada.nota ? ` · Plazo: <em>"${this.cuentaSeleccionada.nota}"</em>` : ""}
                                </p>
                            </div>
                        </div>
                        <span class="text-[10px] font-black uppercase px-2 py-1 rounded bg-amber-200 text-amber-950 border border-amber-400">
                            TASA LIBRE AL COBRAR
                        </span>
                    </div>
                    ` : `
                    <div class="bg-blue-50/70 border-2 border-brand-black border-l-[6px] border-l-blue-600 rounded p-3 text-xs text-blue-950 flex justify-between items-center">
                        <div>
                            <p class="font-heading font-black text-sm uppercase">CUENTA ACTIVA EN LOCAL (MESA / COMANDA)</p>
                            <p class="text-[11px] font-bold text-blue-800 mt-0.5">Consumos con tasa oficial de referencia</p>
                        </div>
                        <span class="text-[10px] font-black uppercase px-2 py-1 rounded bg-blue-100 text-blue-900 border border-blue-300">
                            CONSUMO EN MESA
                        </span>
                    </div>
                    `}

                    <!-- Cabecera de la Cuenta Seleccionada -->
                    <div class="flex flex-wrap justify-between items-center border-b-2 border-brand-black pb-4 gap-2">
                        <div>
                            <h3 class="font-heading font-black text-2xl sm:text-3xl">${this.cuentaSeleccionada.etiqueta}</h3>
                            <p class="text-xs font-mono text-gray-500 font-bold">ID: ${this.cuentaSeleccionada.ventaId}</p>
                        </div>
                        <div class="text-right">
                            ${favorU > 0 ? `
                                <span class="text-[10px] font-black text-emerald-900 uppercase px-2 py-0.5 rounded bg-emerald-100 border border-emerald-500">
                                    SALDO A FAVOR DEL CLIENTE
                                </span>
                                <p class="font-heading font-black text-2xl sm:text-3xl text-emerald-600 mt-0.5">
                                    +$${fmt(favorU)}
                                </p>
                                <p class="text-xs font-black text-emerald-700">
                                    Bs. ${fmt(favorU * tasa)} (excedente)
                                </p>
                                <div class="flex items-center justify-end gap-1.5 mt-1">
                                    <span class="font-bold text-[10px] text-gray-500">
                                        Consumo: $${fmt(totU)} · Abonado: <strong class="text-brand-black">$${fmt(aboU)}</strong>
                                    </span>
                                    <button data-editar-abono title="Corregir monto abonado por error" class="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-brand-black bg-amber-200 hover:bg-amber-300 text-brand-black">
                                        Editar
                                    </button>
                                </div>
                            ` : `
                                <span class="text-xs font-bold text-gray-500 uppercase">${esDeuda ? "Monto Adeudado Pendiente" : "Saldo Pendiente"}</span>
                                <p class="font-heading font-black text-2xl sm:text-3xl text-brand-black">
                                    $${fmt(pendU)} USD
                                </p>
                                <p class="text-xs font-bold text-gray-600">
                                    Bs. ${fmt(pendU * tasa)} <span class="text-[10px] text-gray-400">(${esDeuda ? "tasa hoy" : "actual"})</span>
                                </p>
                                <div class="flex items-center justify-end gap-1.5 mt-1">
                                    <span class="font-bold text-xs text-gray-600">
                                        Total: $${fmt(totU)} · Abonado: <strong class="text-brand-black">$${fmt(aboU)}</strong>
                                    </span>
                                    <button data-editar-abono title="Corregir monto abonado por error" class="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-brand-black bg-amber-200 hover:bg-amber-300 text-brand-black">
                                        Editar
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Lista detallada de consumos agregados con opcion de eliminar (reintegra stock) -->
                    <div class="border-2 border-brand-black rounded-lg p-3 sm:p-4 bg-gray-50 shadow-sm flex flex-col">
                        <div class="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-2 shrink-0">
                            <span class="font-heading font-black text-xs uppercase tracking-wider text-gray-700">Consumos Cargados (${this.cuentaSeleccionada.consumos?.length || 0})</span>
                            <span class="text-xs font-bold text-gray-500">Monto Unit. / Subtotal</span>
                        </div>
                        <div id="cta-consumos-lista" class="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                            ${(!this.cuentaSeleccionada.consumos || this.cuentaSeleccionada.consumos.length === 0)
                                ? `<div class="py-6 text-center text-xs text-gray-400 font-bold">
                                    Sin consumos cargados en este registro. Selecciona productos abajo para cargar mercancía. El stock se descuenta de inmediato.
                                </div>`
                                : this.cuentaSeleccionada.consumos.map((item) => `
                                <div class="flex items-center justify-between border-2 border-brand-black rounded-lg bg-white px-3 py-2 text-xs font-bold shadow-brutal-sm hover:bg-amber-50/50 transition-colors gap-2">
                                    <div class="flex-1 min-w-0 pr-2">
                                        <p class="truncate text-brand-black font-heading font-black text-sm" title="${item.nombre}">${item.nombre}</p>
                                        <p class="text-[11px] text-gray-500 font-semibold">${item.cantidad} un. &times; $${fmt(item.precioUsd)} <span class="text-gray-400 font-normal">· Bs. ${this.modelo.bs(parseNum(item.precioUsd))} c/u</span></p>
                                    </div>
                                    <div class="flex items-center gap-3 shrink-0">
                                        <div class="text-right">
                                            <p class="font-heading font-black text-sm sm:text-base text-brand-black leading-tight">$${fmt(item.subtotalUsd)}</p>
                                            <p class="text-[10px] font-bold text-gray-500 leading-tight">Bs. ${this.modelo.bs(parseNum(item.subtotalUsd))}</p>
                                        </div>
                                        <button data-del-consumo="${item.id}" title="Eliminar consumo y reintegrar stock al inventario" class="w-7 h-7 flex items-center justify-center rounded border-2 border-brand-black bg-red-100 hover:bg-red-500 hover:text-white text-red-800 text-sm font-black transition-colors active:scale-95">&times;</button>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <!-- Buscador dinámico de productos para cargar consumo (muestra stock en tiempo real) -->
                    <div>
                        <div class="flex justify-between items-center mb-1">
                            <label class="block font-heading font-bold text-xs uppercase">Buscar y agregar producto a la comanda / deuda:</label>
                            <span class="text-[11px] text-gray-500 font-bold">Descuenta stock físico inmediatamente</span>
                        </div>
                        <input id="cta-buscar-prod" type="text" maxlength="40" placeholder="Escribe el nombre del producto o servicio..." class="w-full border-2 border-brand-black rounded px-3 py-2 font-bold text-sm mb-2 focus:ring-2 focus:ring-brand-cyan" />
                        <div id="cta-grid-prod" class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                            ${this.productos.map((p) => {
                                const agotado = !p.sinStock && (Number(p.stock) <= 0);
                                return `
                                <button data-add-sku="${p.sku}" data-agotado="${agotado ? "1" : "0"}" class="text-left border-2 border-brand-black rounded p-2 transition-all text-xs font-bold ${agotado ? "bg-gray-100 opacity-60 cursor-not-allowed" : "bg-gray-50 hover:bg-white shadow-sm hover:shadow-brutal-sm"}">
                                    <div class="flex justify-between items-start gap-1">
                                        <p class="truncate flex-1" title="${p.nombre}">${p.nombre}</p>
                                        ${agotado ? '<span class="bg-red-200 text-red-900 border border-red-400 text-[9px] font-black px-1 rounded">AGOTADO</span>' : ""}
                                    </div>
                                    <div class="flex justify-between items-center mt-1">
                                        <p class="text-brand-black font-black">$${fmt(p.precioUsd)}</p>
                                        <span class="text-[10px] ${agotado ? "text-red-700 font-black" : "text-gray-500"}">${p.sinStock ? "Ilimitado" : `${p.stock} un.`}</span>
                                    </div>
                                </button>`;
                            }).join("")}
                        </div>
                    </div>

                    <!-- Botonera de Abono, Corrección y Liquidación -->
                    <div class="border-t-2 border-brand-black pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button id="btn-abonar-cuenta" class="bg-amber-400 hover:bg-amber-500 text-brand-black font-heading font-black text-xs sm:text-sm py-3.5 rounded border-2 border-brand-black shadow-brutal active:translate-y-0.5">
                            + REGISTRAR ABONO
                        </button>
                        <button id="btn-editar-abono-cuenta" class="bg-amber-100 hover:bg-amber-200 text-amber-950 font-heading font-black text-xs sm:text-sm py-3.5 rounded border-2 border-brand-black shadow-brutal active:translate-y-0.5">
                            EDITAR ABONO
                        </button>
                        <button id="btn-cerrar-cuenta" class="${favorU > 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-green-700 hover:bg-green-800"} text-white font-heading font-black text-xs sm:text-sm py-3.5 rounded border-2 border-brand-black shadow-brutal active:translate-y-0.5">
                            ${esDeuda
                                ? "COBRAR Y LIQUIDAR DEUDA (TASA LIBRE)"
                                : (favorU > 0 ? `LIQUIDAR (+$${fmt(favorU)})` : "LIQUIDAR Y COBRAR")}
                        </button>
                    </div>
                </div>`;
                })() : `
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <h4 class="font-heading font-black text-2xl mb-2">Selecciona un registro</h4>
                    <p class="text-brand-text font-body text-sm max-w-sm">Haz clic en una cuenta activa o deuda de la lista izquierda para cargarle consumos, abonar pagos o cobrarla.</p>
                </div>
                `}
            </div>
        </div>`;

        this.vincularEventos();
    }

    private vincularEventos(): void {
        document.getElementById("btn-nueva-cuenta")?.addEventListener("click", () => this.modalNuevaCuenta("activa"));
        document.getElementById("btn-nueva-deuda")?.addEventListener("click", () => this.modalNuevaCuenta("deuda"));

        document.getElementById("tab-todas")?.addEventListener("click", () => {
            this.filtroTab = "todas";
            this.paginaCuentas = 1;
            void this.render();
        });
        document.getElementById("tab-activas")?.addEventListener("click", () => {
            this.filtroTab = "activa";
            this.paginaCuentas = 1;
            void this.render();
        });
        document.getElementById("tab-deudas")?.addEventListener("click", () => {
            this.filtroTab = "deuda";
            this.paginaCuentas = 1;
            void this.render();
        });

        document.getElementById("cta-pag-ant")?.addEventListener("click", () => {
            if (this.paginaCuentas > 1) {
                this.paginaCuentas--;
                void this.render();
            }
        });
        document.getElementById("cta-pag-sig")?.addEventListener("click", () => {
            this.paginaCuentas++;
            void this.render();
        });

        this.contenedor.querySelectorAll("[data-cuenta-id]").forEach((el) => {
            el.addEventListener("click", () => {
                const id = (el as HTMLElement).dataset.cuentaId;
                this.cuentaSeleccionada = this.cuentas.find((c) => c.ventaId === id) || null;
                void this.render();
            });
        });

        this.contenedor.querySelectorAll("[data-del-consumo]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (!this.cuentaSeleccionada) return;
                const cid = (btn as HTMLElement).dataset.delConsumo || "";
                try {
                    const actualizada = await api.eliminarConsumo(this.cuentaSeleccionada.ventaId, cid);
                    this.cuentaSeleccionada = actualizada;
                    void this.render();
                } catch (e) {
                    alert(e instanceof Error ? e.message : String(e));
                }
            });
        });

        const inputBuscar = this.contenedor.querySelector<HTMLInputElement>("#cta-buscar-prod");
        if (inputBuscar) sanitizarInputTexto(inputBuscar, 40);
        inputBuscar?.addEventListener("input", () => {
            const q = inputBuscar.value.trim().toLowerCase();
            const grid = this.contenedor.querySelector("#cta-grid-prod");
            if (grid) {
                const filtrados = this.productos.filter((p) => !q || p.nombre.toLowerCase().includes(q));
                if (filtrados.length === 0) {
                    grid.innerHTML = '<p class="col-span-full text-center text-xs text-gray-400 py-4 font-bold">No se encontraron productos coincidentes.</p>';
                } else {
                    grid.innerHTML = filtrados.map((p) => {
                        const agotado = !p.sinStock && (Number(p.stock) <= 0);
                        return `
                        <button data-add-sku="${p.sku}" data-agotado="${agotado ? "1" : "0"}" class="text-left border-2 border-brand-black rounded p-2 transition-all text-xs font-bold ${agotado ? "bg-gray-100 opacity-60 cursor-not-allowed" : "bg-gray-50 hover:bg-white shadow-sm hover:shadow-brutal-sm"}">
                            <div class="flex justify-between items-start gap-1">
                                <p class="truncate flex-1" title="${p.nombre}">${p.nombre}</p>
                                ${agotado ? '<span class="bg-red-200 text-red-900 border border-red-400 text-[9px] font-black px-1 rounded">AGOTADO</span>' : ""}
                            </div>
                            <div class="flex justify-between items-center mt-1">
                                <p class="text-brand-black font-black">$${fmt(p.precioUsd)}</p>
                                <span class="text-[10px] ${agotado ? "text-red-700 font-black" : "text-gray-500"}">${p.sinStock ? "Ilimitado" : `${p.stock} un.`}</span>
                            </div>
                        </button>`;
                    }).join("");
                    this.vincularBotonesAgregar(grid);
                }
            }
        });

        const gridInicial = this.contenedor.querySelector("#cta-grid-prod");
        if (gridInicial) this.vincularBotonesAgregar(gridInicial);

        this.contenedor.querySelectorAll("[data-editar-abono]").forEach((btn) => {
            btn.addEventListener("click", () => this.modalEditarAbono());
        });
        document.getElementById("btn-editar-abono-cuenta")?.addEventListener("click", () => this.modalEditarAbono());
        document.getElementById("btn-abonar-cuenta")?.addEventListener("click", () => this.modalAbono());
        document.getElementById("btn-cerrar-cuenta")?.addEventListener("click", () => this.modalCierre());
    }

    private vincularBotonesAgregar(contenedor: Element): void {
        contenedor.querySelectorAll("[data-add-sku]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (!this.cuentaSeleccionada) return;
                const el = btn as HTMLElement;
                const sku = el.dataset.addSku || "";
                const agotado = el.dataset.agotado === "1";

                if (agotado) {
                    alert("Stock insuficiente: este producto no tiene existencias disponibles en inventario.");
                    return;
                }

                try {
                    const actualizada = await api.agregarConsumo(
                        this.cuentaSeleccionada.ventaId,
                        sku,
                        "1",
                        true,
                    );
                    this.cuentaSeleccionada = actualizada;
                    void this.render();
                } catch (e) {
                    alert(e instanceof Error ? e.message : String(e));
                }
            });
        });
    }

    private modalNuevaCuenta(tipoInicial: "activa" | "deuda" = "activa"): void {
        let tipo = tipoInicial;

        const updateContent = () => {
            const esDeuda = tipo === "deuda";
            this.modal.innerHTML = `
            <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-md">
                    <div class="flex border-2 border-brand-black rounded bg-gray-100 p-1 mb-4">
                        <button id="modal-tab-activa" class="flex-1 py-2 font-heading font-black text-xs rounded transition-colors ${!esDeuda ? "bg-brand-black text-white" : "text-brand-black hover:bg-white"}">
                            CUENTA EN LOCAL (MESA)
                        </button>
                        <button id="modal-tab-deuda" class="flex-1 py-2 font-heading font-black text-xs rounded transition-colors ${esDeuda ? "bg-amber-400 text-brand-black font-black" : "text-brand-black hover:bg-white"}">
                            DEUDA / FIADO (CLIENTE)
                        </button>
                    </div>

                    <h3 class="font-heading font-black text-2xl mb-1">${esDeuda ? "REGISTRAR NUEVA DEUDA" : "ABRIR CUENTA EN LOCAL"}</h3>
                    <p class="text-xs text-gray-600 mb-4 font-bold leading-relaxed">
                        ${esDeuda
                            ? "Abre un registro de deuda a nombre de un cliente. Los consumos descontarán stock de inmediato. Esta cuenta puede permanecer abierta por días y se cobrará a la tasa libre que usted defina al momento del pago."
                            : "Identificador para consumos de comanda, mesa o servicio en barra."}
                    </p>

                    <div class="space-y-3 mb-4">
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">${esDeuda ? "Nombre del Cliente / Deudor" : "Identificador (Mesa / Barra / Cliente)"}</label>
                            <input id="modal-cta-nombre" maxlength="40" autofocus placeholder="${esDeuda ? "Ej: Taller Hermanos Gómez / Carlos" : "Ej: Mesa 4 / Terraza"}"
                                class="w-full border-2 border-brand-black rounded px-3 py-2 text-base font-body focus:ring-2 focus:ring-brand-cyan" />
                        </div>

                        ${esDeuda ? `
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Nota de Compromiso / Plazo (Opcional)</label>
                            <input id="modal-cta-nota" maxlength="60" placeholder="Ej: Paga el viernes / Autorizado por dueño"
                                class="w-full border-2 border-brand-black rounded px-3 py-2 text-sm font-body focus:ring-2 focus:ring-brand-cyan" />
                        </div>
                        ` : ""}
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button id="modal-cta-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded">CANCELAR</button>
                        <button id="modal-cta-ok" class="${esDeuda ? "bg-amber-400 text-brand-black" : "bg-brand-black text-white"} font-heading font-black py-3 rounded border-2 border-brand-black shadow-brutal-sm">
                            ${esDeuda ? "CREAR DEUDA" : "ABRIR CUENTA"}
                        </button>
                    </div>
                </div>
            </div>`;

            const btnTabActiva = this.modal.querySelector("#modal-tab-activa");
            const btnTabDeuda = this.modal.querySelector("#modal-tab-deuda");
            btnTabActiva?.addEventListener("click", () => {
                tipo = "activa";
                updateContent();
            });
            btnTabDeuda?.addEventListener("click", () => {
                tipo = "deuda";
                updateContent();
            });

            const inputNombre = this.modal.querySelector("#modal-cta-nombre") as HTMLInputElement | null;
            const inputNota = this.modal.querySelector("#modal-cta-nota") as HTMLInputElement | null;
            if (inputNombre) sanitizarInputTexto(inputNombre, 40);
            if (inputNota) sanitizarInputTexto(inputNota, 60);
            setTimeout(() => inputNombre?.focus(), 50);

            const cerrar = () => { this.modal.innerHTML = ""; };
            this.modal.querySelector("#modal-cta-cancel")?.addEventListener("click", cerrar);
            this.modal.querySelector("#modal-cta-ok")?.addEventListener("click", async () => {
                const nombre = inputNombre?.value.trim().slice(0, 40);
                const nota = inputNota?.value.trim().slice(0, 60);
                if (nombre) {
                    const nueva = await api.abrirCuenta(nombre, tipo, nota, nombre);
                    this.cuentaSeleccionada = nueva;
                    if (tipo === "deuda") this.filtroTab = "deuda";
                    cerrar();
                    void this.render();
                } else {
                    alert(esDeuda ? "Debe ingresar el nombre del cliente o empresa deudora." : "Debe ingresar un identificador válido para la cuenta.");
                    inputNombre?.focus();
                }
            });
        };

        updateContent();
    }

    private async modalAbono(): Promise<void> {
        if (!this.cuentaSeleccionada) return;
        let metodosDisponibles: MetodoPagoConfig[] = [];
        try {
            metodosDisponibles = await api.listarMetodosPago();
        } catch (_) {
            metodosDisponibles = [
                { nombre: 'PUNTOD.VENTA', moneda: 'BS' },
                { nombre: 'BIOPAGO', moneda: 'BS' },
                { nombre: 'PAGO MOVIL', moneda: 'BS' },
                { nombre: 'TRANSF.BS.', moneda: 'BS' },
                { nombre: 'BS.EFEC.', moneda: 'BS' },
                { nombre: 'DOL.CASH', moneda: 'USD' },
                { nombre: 'ZELLE', moneda: 'USD' },
                { nombre: 'BINAN.USDT', moneda: 'USD' },
            ];
        }

        const totalU = parseNum(this.cuentaSeleccionada.totalParcialUsd);
        const abonosU = parseNum(this.cuentaSeleccionada.abonosUsd);
        const pendienteUsd = Math.max(0, totalU - abonosU);
        const tasaOficial = this.modelo.tasaActual || 807.39;
        const pendienteBs = (pendienteUsd * tasaOficial).toFixed(2);
        const esDeuda = this.cuentaSeleccionada.tipo === "deuda";

        let metodoSeleccionado = metodosDisponibles[0] || { nombre: 'PUNTOD.VENTA', moneda: 'BS' as const };
        let montoInput = metodoSeleccionado.moneda === 'USD' ? pendienteUsd : Number(pendienteBs);
        let tasaMetodo = tasaOficial;
        let referencia = "";

        const renderFormularioAbono = () => {
            const metodosUsd = metodosDisponibles.filter((m) => m.moneda === 'USD');
            const metodosBs = metodosDisponibles.filter((m) => m.moneda === 'BS');

            const optUsd = metodosUsd
                .map((m) => `<option value="${m.nombre}" ${m.nombre === metodoSeleccionado.nombre ? 'selected' : ''}>${m.nombre} ($ USD - Tasa Dinámica)</option>`)
                .join('');
            const optBs = metodosBs
                .map((m) => `<option value="${m.nombre}" ${m.nombre === metodoSeleccionado.nombre ? 'selected' : ''}>${m.nombre} (Bs.)</option>`)
                .join('');

            const opcionesMetodos = `
                <optgroup label="MÉTODOS EN BOLÍVARES (Bs.)">
                    ${optBs}
                </optgroup>
                <optgroup label="MÉTODOS EN DÓLARES ($ - TASA PROPIA)">
                    ${optUsd}
                </optgroup>
            `;

            const esUsd = metodoSeleccionado.moneda === 'USD';
            const tasaAplicada = esUsd ? (tasaMetodo > 0 ? tasaMetodo : tasaOficial) : tasaOficial;
            const aporteBs = esUsd ? montoInput * tasaAplicada : montoInput;
            const abonoComputableUsd = tasaOficial > 0 ? aporteBs / tasaOficial : 0;
            const totalAbonadoProyectado = abonosU + abonoComputableUsd;
            const diffUsd = totalAbonadoProyectado - totalU;
            const diffBs = diffUsd * tasaOficial;

            let previewHtml = '';
            if (montoInput <= 0.0001) {
                previewHtml = `
                    <div class="rounded p-2.5 border-2 border-brand-black bg-gray-50 text-xs text-gray-700 font-bold">
                        <div class="flex justify-between items-center">
                            <span>Aporte de este abono:</span>
                            <span class="font-heading font-black text-sm text-gray-800">$0.00 USD (Bs. 0.00)</span>
                        </div>
                        <div class="flex justify-between items-center text-gray-600 border-t border-gray-300 pt-1 mt-1">
                            <span>Saldo pendiente actual:</span>
                            <span class="font-heading font-black text-sm text-brand-black">$${fmt(pendienteUsd)} USD (Bs. ${fmt(pendienteBs)})</span>
                        </div>
                    </div>
                `;
            } else if (diffUsd > 0.001) {
                previewHtml = `
                    <div class="rounded p-2.5 border-2 border-emerald-600 bg-emerald-50 text-xs text-emerald-950 font-bold">
                        <div class="flex justify-between items-center mb-1">
                            <span>Nuevo Total Abonado:</span>
                            <span class="font-heading font-black text-sm text-emerald-700">$${fmt(totalAbonadoProyectado)}</span>
                        </div>
                        <div class="flex justify-between items-center text-emerald-900 border-t border-emerald-300 pt-1">
                            <span>Saldo a favor resultante:</span>
                            <span class="font-heading font-black text-base text-emerald-600">+$${fmt(diffUsd)} USD (Bs. ${fmt(diffBs)})</span>
                        </div>
                        <p class="text-[10px] text-emerald-800 mt-1">✓ Abono superior al consumo: este excedente se convertirá en ganancia o crédito al liquidar.</p>
                    </div>
                `;
            } else if (diffUsd < -0.001) {
                const restante = Math.abs(diffUsd);
                const restanteBs = restante * tasaOficial;
                previewHtml = `
                    <div class="rounded p-2.5 border-2 border-brand-black bg-gray-50 text-xs text-gray-800 font-bold">
                        <div class="flex justify-between items-center mb-1">
                            <span>Nuevo Total Abonado:</span>
                            <span class="font-heading font-black text-sm text-brand-black">$${fmt(totalAbonadoProyectado)}</span>
                        </div>
                        <div class="flex justify-between items-center text-gray-900 border-t border-gray-300 pt-1">
                            <span>Saldo pendiente restante:</span>
                            <span class="font-heading font-black text-base text-brand-black">$${fmt(restante)} USD (Bs. ${fmt(restanteBs)})</span>
                        </div>
                    </div>
                `;
            } else {
                previewHtml = `
                    <div class="rounded p-2.5 border-2 border-green-600 bg-green-50 text-xs text-green-950 font-bold">
                        <div class="flex justify-between items-center">
                            <span>Registro saldado exactamente:</span>
                            <span class="font-heading font-black text-base text-green-700">$${fmt(totalAbonadoProyectado)} USD</span>
                        </div>
                    </div>
                `;
            }

            this.modal.innerHTML = `
            <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-md">
                    <h3 class="font-heading font-black text-2xl mb-1">${esDeuda ? "ABONAR A LA DEUDA" : "REGISTRAR ABONO / ANTICIPO"}</h3>
                    <p class="font-body text-xs text-gray-700 mb-3">${this.cuentaSeleccionada?.etiqueta} · El usuario decide libremente el monto y tasa del abono.</p>

                    <div class="bg-blue-50 border border-blue-400 rounded p-2.5 mb-3 text-xs text-blue-950 font-bold leading-tight">
                        ℹ <strong>Abonos con tasas dinámicas:</strong> En métodos en divisas (${metodosUsd.map((m) => m.nombre).join(', ')}) se define la tasa al momento del abono. El diferencial frente a la tasa oficial se computa a favor del cliente.
                    </div>

                    <div class="space-y-3 mb-4">
                        <div>
                            <label class="block text-xs font-black uppercase text-gray-700 mb-1">Método de Pago del Abono</label>
                            <select id="select-metodo-abono" class="w-full border-2 border-brand-black rounded px-3 py-2 font-heading font-black text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple">
                                ${opcionesMetodos}
                            </select>
                        </div>

                        ${
                            esUsd
                                ? `
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Monto a abonar en Dólares ($ USD)</label>
                            <div class="flex items-center">
                                <span class="bg-brand-black text-white px-3 py-2 rounded-l border-y-2 border-l-2 border-brand-black text-sm font-mono font-bold">$</span>
                                <input id="input-monto-abono" type="number" step="0.01" min="0.01" max="50000" value="${montoInput > 0 ? montoInput : ''}" placeholder="0.00"
                                    class="w-full border-2 border-brand-black rounded-r px-3 py-2 font-mono font-black text-xl text-brand-black text-right focus:outline-none" />
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-1">
                                <label class="block text-xs font-bold uppercase text-gray-700">Tasa de Cambio del Método (Bs. / USD)</label>
                                <button type="button" id="btn-reset-tasa-abono" class="text-[10px] font-black uppercase text-brand-purple hover:underline">
                                    TASA BCV: ${fmt(tasaOficial)}
                                </button>
                            </div>
                            <input id="input-tasa-abono" type="number" step="0.01" min="1" max="100000" value="${tasaAplicada}"
                                class="w-full border-2 border-brand-black rounded px-3 py-2 font-mono font-black text-base text-brand-black text-right focus:outline-none" />
                        </div>

                        <div class="bg-purple-50 border border-brand-purple rounded p-2 text-xs font-bold space-y-0.5">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Valor aportado en Bolívares:</span>
                                <span class="text-brand-purple font-mono font-black">Bs. ${fmt(aporteBs)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Abono computable (Tasa BCV):</span>
                                <span class="text-brand-black font-mono font-black">$ ${fmt(abonoComputableUsd)} USD</span>
                            </div>
                        </div>
                        `
                                : `
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Monto a abonar en Bolívares (Bs.)</label>
                            <div class="flex items-center">
                                <span class="bg-brand-black text-white px-3 py-2 rounded-l border-y-2 border-l-2 border-brand-black text-sm font-mono font-bold">Bs.</span>
                                <input id="input-monto-abono" type="number" step="0.01" min="0.01" max="50000000" value="${montoInput > 0 ? montoInput : ''}" placeholder="0.00"
                                    class="w-full border-2 border-brand-black rounded-r px-3 py-2 font-mono font-black text-xl text-brand-black text-right focus:outline-none" />
                            </div>
                            <p class="text-[11px] text-gray-500 mt-1">Equivalente oficial acreditado: <span class="font-bold text-brand-black">$ ${fmt(abonoComputableUsd)} USD</span> (Tasa BCV: ${fmt(tasaOficial)})</p>
                        </div>
                        `
                        }

                        <div>
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Referencia (Opcional)</label>
                            <input id="input-ref-abono" type="text" maxlength="25" value="${referencia}" placeholder="Ej: PAGO MOVIL 4912, USDT HASH..."
                                class="w-full border-2 border-brand-black rounded px-3 py-1.5 text-xs font-mono focus:outline-none" />
                        </div>

                        ${previewHtml}
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button id="modal-abono-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded hover:bg-gray-100">VOLVER</button>
                        <button id="modal-abono-ok" ${montoInput <= 0 ? 'disabled' : ''} class="bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-brand-black font-heading font-black py-3 rounded border-2 border-brand-black shadow-brutal-sm">APLICAR ABONO</button>
                    </div>
                </div>
            </div>`;

            conectarEventosAbono();
        };

        const conectarEventosAbono = () => {
            const cerrar = () => { this.modal.innerHTML = ""; };
            this.modal.querySelector("#modal-abono-cancel")?.addEventListener("click", cerrar);

            // Select metodo
            this.modal.querySelector<HTMLSelectElement>("#select-metodo-abono")?.addEventListener("change", (e) => {
                const val = (e.target as HTMLSelectElement).value;
                const m = metodosDisponibles.find((x) => x.nombre === val);
                if (m) {
                    const eraUsd = metodoSeleccionado.moneda === 'USD';
                    metodoSeleccionado = m;
                    if (m.moneda === 'USD') {
                        tasaMetodo = tasaOficial;
                        if (!eraUsd) montoInput = pendienteUsd;
                    } else {
                        if (eraUsd) montoInput = Number(pendienteBs);
                    }
                    renderFormularioAbono();
                }
            });

            // Input monto
            this.modal.querySelector<HTMLInputElement>("#input-monto-abono")?.addEventListener("input", (e) => {
                montoInput = parseNum((e.target as HTMLInputElement).value);
                renderFormularioAbono();
                const inp = this.modal.querySelector<HTMLInputElement>("#input-monto-abono");
                inp?.focus();
            });

            // Input tasa
            this.modal.querySelector<HTMLInputElement>("#input-tasa-abono")?.addEventListener("input", (e) => {
                tasaMetodo = parseNum((e.target as HTMLInputElement).value);
                renderFormularioAbono();
                const inp = this.modal.querySelector<HTMLInputElement>("#input-tasa-abono");
                inp?.focus();
            });

            // Reset tasa button
            this.modal.querySelector("#btn-reset-tasa-abono")?.addEventListener("click", () => {
                tasaMetodo = tasaOficial;
                renderFormularioAbono();
            });

            // Input ref
            this.modal.querySelector<HTMLInputElement>("#input-ref-abono")?.addEventListener("input", (e) => {
                referencia = (e.target as HTMLInputElement).value;
            });

            // Confirmar abono
            this.modal.querySelector("#modal-abono-ok")?.addEventListener("click", async () => {
                if (!this.cuentaSeleccionada) return;
                const esUsd = metodoSeleccionado.moneda === 'USD';
                const tasaAplicada = esUsd ? (tasaMetodo > 0 ? tasaMetodo : tasaOficial) : tasaOficial;
                const aporteBs = esUsd ? montoInput * tasaAplicada : montoInput;
                const abonoComputableUsd = tasaOficial > 0 ? aporteBs / tasaOficial : 0;

                if (abonoComputableUsd <= 0 || !Number.isFinite(abonoComputableUsd)) {
                    alert("Por favor ingrese un monto válido.");
                    return;
                }

                const actualizada = await api.abonarCuenta(this.cuentaSeleccionada.ventaId, abonoComputableUsd, aporteBs);
                if (actualizada) {
                    this.cuentaSeleccionada = actualizada;
                }
                cerrar();
                void this.render();
            });
        };

        renderFormularioAbono();
    }

    private modalEditarAbono(): void {
        if (!this.cuentaSeleccionada) return;
        const totU = parseNum(this.cuentaSeleccionada.totalParcialUsd);
        const prevAboU = parseNum(this.cuentaSeleccionada.abonosUsd);
        const tasa = this.modelo.tasaActual || 807.39;

        this.modal.innerHTML = `
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-md">
                <h3 class="font-heading font-black text-2xl mb-1">CORREGIR SALDO ABONADO</h3>
                <p class="font-body text-xs text-gray-700 mb-4">${this.cuentaSeleccionada.etiqueta} · Modifique el saldo acumulado en caso de error de registro o digitación.</p>

                <div class="bg-gray-50 border-2 border-brand-black rounded p-3 mb-4 text-xs space-y-1">
                    <div class="flex justify-between font-bold text-gray-600">
                        <span>Consumo acumulado:</span>
                        <span>$${fmt(totU)} (Bs. ${this.modelo.bs(totU)})</span>
                    </div>
                    <div class="flex justify-between font-bold text-amber-800">
                        <span>Abonado registrado actualmente:</span>
                        <span>$${fmt(prevAboU)} (Bs. ${this.modelo.bs(prevAboU)})</span>
                    </div>
                </div>

                <div class="space-y-4 mb-4">
                    <div class="flex border-2 border-brand-black rounded bg-gray-100 p-1">
                        <button id="tab-edit-usd" class="flex-1 py-1.5 font-heading font-black text-xs rounded bg-brand-black text-white">CORREGIR EN DÓLARES ($)</button>
                        <button id="tab-edit-bs" class="flex-1 py-1.5 font-heading font-bold text-xs rounded text-brand-black hover:bg-white">CORREGIR EN BOLÍVARES (Bs)</button>
                    </div>

                    <div id="sec-edit-usd">
                        <label class="block text-xs font-bold uppercase mb-1">Nuevo Total Abonado Real ($) (Máx $50,000.00)</label>
                        <input id="edit-abono-usd-val" type="text" inputmode="decimal" maxlength="8" value="${prevAboU > 0 ? prevAboU.toFixed(2) : "0.00"}" class="w-full border-2 border-brand-black rounded px-3 py-2 font-mono font-black text-xl text-brand-black" />
                        <p class="text-[11px] text-gray-500 mt-1">Equivalente en Bs: <span id="edit-usd-equiv" class="font-bold"></span></p>
                    </div>

                    <div id="sec-edit-bs" class="hidden">
                        <label class="block text-xs font-bold uppercase mb-1">Nuevo Total Abonado Real (Bs.) (Máx Bs. 50.000.000,00)</label>
                        <input id="edit-abono-bs-val" type="text" inputmode="decimal" maxlength="11" value="${(prevAboU * tasa).toFixed(2)}" class="w-full border-2 border-brand-black rounded px-3 py-2 font-mono font-black text-xl text-brand-black" />
                        <p class="text-[11px] text-gray-500 mt-1">Equivalente en USD: <span id="edit-bs-equiv" class="font-bold"></span></p>
                    </div>

                    <div class="flex gap-2">
                        <button id="btn-preset-cero" type="button" class="text-xs font-bold px-2.5 py-1.5 rounded border border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-800">Poner en $0.00 (Resetear)</button>
                        <button id="btn-preset-exacto" type="button" class="text-xs font-bold px-2.5 py-1.5 rounded border border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-800">Cubrir Todo ($${fmt(totU)})</button>
                    </div>

                    <div id="edit-preview-box" class="rounded p-2.5 border-2 border-brand-black text-xs"></div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <button id="modal-edit-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded">VOLVER</button>
                    <button id="modal-edit-ok" class="bg-amber-400 hover:bg-amber-500 text-brand-black font-heading font-black py-3 rounded border-2 border-brand-black shadow-brutal-sm">GUARDAR CORRECCIÓN</button>
                </div>
            </div>
        </div>`;

        const tabUsd = this.modal.querySelector("#tab-edit-usd") as HTMLButtonElement | null;
        const tabBs = this.modal.querySelector("#tab-edit-bs") as HTMLButtonElement | null;
        const secUsd = this.modal.querySelector("#sec-edit-usd");
        const secBs = this.modal.querySelector("#sec-edit-bs");
        const inUsd = this.modal.querySelector("#edit-abono-usd-val") as HTMLInputElement | null;
        const inBs = this.modal.querySelector("#edit-abono-bs-val") as HTMLInputElement | null;
        const eqUsd = this.modal.querySelector("#edit-usd-equiv");
        const eqBs = this.modal.querySelector("#edit-bs-equiv");
        const previewBox = this.modal.querySelector("#edit-preview-box");

        let modo: "usd" | "bs" = "usd";

        const updatePreview = () => {
            let nuevoAboU = 0;
            if (modo === "usd") {
                nuevoAboU = parseNum(inUsd?.value);
                if (eqUsd) eqUsd.textContent = `Bs. ${(nuevoAboU * tasa).toFixed(2)}`;
            } else {
                const b = parseNum(inBs?.value);
                nuevoAboU = b / tasa;
                if (eqBs) eqBs.textContent = `$${nuevoAboU.toFixed(2)} USD`;
            }

            if (!Number.isFinite(nuevoAboU)) nuevoAboU = 0;
            const diff = nuevoAboU - totU;

            if (previewBox) {
                if (diff > 0.001) {
                    previewBox.className = "rounded p-2.5 border-2 border-emerald-600 bg-emerald-50 text-xs text-emerald-950 font-bold";
                    previewBox.innerHTML = `
                        <div class="flex justify-between items-center mb-1">
                            <span>Nuevo Saldo Abonado:</span>
                            <span class="font-heading font-black text-sm text-emerald-700">$${fmt(nuevoAboU)}</span>
                        </div>
                        <div class="flex justify-between items-center text-emerald-900 border-t border-emerald-300 pt-1">
                            <span>Saldo a favor resultante:</span>
                            <span class="font-heading font-black text-base text-emerald-600">+$${fmt(diff)} USD</span>
                        </div>
                        <p class="text-[10px] text-emerald-800 mt-1">✓ Excedente a favor del cliente.</p>
                    `;
                } else if (diff < -0.001) {
                    const restante = Math.abs(diff);
                    previewBox.className = "rounded p-2.5 border-2 border-brand-black bg-gray-50 text-xs text-gray-800 font-bold";
                    previewBox.innerHTML = `
                        <div class="flex justify-between items-center mb-1">
                            <span>Nuevo Saldo Abonado:</span>
                            <span class="font-heading font-black text-sm text-brand-black">$${fmt(nuevoAboU)}</span>
                        </div>
                        <div class="flex justify-between items-center text-gray-900 border-t border-gray-300 pt-1">
                            <span>Saldo pendiente restante:</span>
                            <span class="font-heading font-black text-base text-brand-black">$${fmt(restante)} USD</span>
                        </div>
                    `;
                } else {
                    previewBox.className = "rounded p-2.5 border-2 border-green-600 bg-green-50 text-xs text-green-950 font-bold";
                    previewBox.innerHTML = `
                        <div class="flex justify-between items-center">
                            <span>Registro saldado exactamente:</span>
                            <span class="font-heading font-black text-base text-green-700">$${fmt(nuevoAboU)} USD</span>
                        </div>
                    `;
                }
            }
        };

        if (inUsd) sanitizarInputDecimal(inUsd, 50000, 8, updatePreview);
        if (inBs) sanitizarInputDecimal(inBs, 50000000, 11, updatePreview);
        updatePreview();

        this.modal.querySelector("#btn-preset-cero")?.addEventListener("click", () => {
            const actVal = modo === "usd" ? parseNum(inUsd?.value) : parseNum(inBs?.value);
            if (prevAboU > 0 || actVal > 0) {
                const confirmar = window.confirm("¿Desea restablecer el saldo abonado a $0.00? Esta acción dejará los pagos registrados en cero.");
                if (!confirmar) return;
            }
            if (inUsd) inUsd.value = "0.00";
            if (inBs) inBs.value = "0.00";
            updatePreview();
        });

        this.modal.querySelector("#btn-preset-exacto")?.addEventListener("click", () => {
            if (inUsd) inUsd.value = totU.toFixed(2);
            if (inBs) inBs.value = (totU * tasa).toFixed(2);
            updatePreview();
        });

        tabUsd?.addEventListener("click", () => {
            modo = "usd";
            tabUsd.className = "flex-1 py-1.5 font-heading font-black text-xs rounded bg-brand-black text-white";
            tabBs!.className = "flex-1 py-1.5 font-heading font-bold text-xs rounded text-brand-black hover:bg-white";
            secUsd?.classList.remove("hidden");
            secBs?.classList.add("hidden");
            updatePreview();
        });

        tabBs?.addEventListener("click", () => {
            modo = "bs";
            tabBs.className = "flex-1 py-1.5 font-heading font-black text-xs rounded bg-brand-black text-white";
            tabUsd!.className = "flex-1 py-1.5 font-heading font-bold text-xs rounded text-brand-black hover:bg-white";
            secBs?.classList.remove("hidden");
            secUsd?.classList.add("hidden");
            updatePreview();
        });

        const cerrar = () => { this.modal.innerHTML = ""; };
        this.modal.querySelector("#modal-edit-cancel")?.addEventListener("click", cerrar);
        this.modal.querySelector("#modal-edit-ok")?.addEventListener("click", async () => {
            if (!this.cuentaSeleccionada) return;
            let nuevoAboU = 0;
            if (modo === "usd") {
                nuevoAboU = parseNum(inUsd?.value);
            } else {
                const b = parseNum(inBs?.value);
                nuevoAboU = b / tasa;
            }

            if (!Number.isFinite(nuevoAboU) || nuevoAboU < 0 || nuevoAboU > 50000) {
                alert("Monto inválido. Ingrese un valor entre $0.00 y $50,000.00 USD.");
                return;
            }

            const difiere = Math.abs(nuevoAboU - prevAboU) > 0.009;
            if (difiere) {
                const msg = nuevoAboU === 0
                    ? `¿Confirmas reiniciar el saldo abonado a $0.00? (Monto previo registrado: $${fmt(prevAboU)})`
                    : `¿Confirmas modificar el saldo abonado de esta cuenta a $${fmt(nuevoAboU)} USD (Bs. ${fmt(nuevoAboU * tasa)})? (Monto previo registrado: $${fmt(prevAboU)})`;
                const confirmado = window.confirm(msg);
                if (!confirmado) return;
            }

            const actualizada = await api.editarAbonoCuenta(this.cuentaSeleccionada.ventaId, nuevoAboU);
            if (actualizada) {
                this.cuentaSeleccionada = actualizada;
            }
            cerrar();
            void this.render();
        });
    }

    private async modalCierre(): Promise<void> {
        if (!this.cuentaSeleccionada) return;
        const esDeuda = this.cuentaSeleccionada.tipo === "deuda";
        const totalU = parseNum(this.cuentaSeleccionada.totalParcialUsd);
        const abonosU = parseNum(this.cuentaSeleccionada.abonosUsd);
        const saldoPendienteUsd = Math.max(0, Math.round((totalU - abonosU) * 100) / 100);
        const saldoAFavorUsd = Math.max(0, Math.round((abonosU - totalU) * 100) / 100);
        const tasaOficial = this.modelo.tasaActual || 807.39;

        // Si la cuenta está completamente pagada por abonos o tiene saldo a favor
        if (saldoPendienteUsd <= 0.009) {
            this.modal.innerHTML = `
            <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-md">
                    <h3 class="font-heading font-black text-2xl mb-1">${esDeuda ? "LIQUIDAR DEUDA" : "LIQUIDAR CUENTA"}</h3>
                    <p class="font-body text-sm text-gray-600 mb-4">${this.cuentaSeleccionada.etiqueta} · Total cubierto por abonos previos</p>
                    
                    <div class="space-y-2 mb-4">
                        <div class="flex justify-between text-xs font-bold text-gray-500">
                            <span>Total de consumos:</span>
                            <span>$${fmt(totalU)} (Bs. ${fmt(totalU * tasaOficial)})</span>
                        </div>
                        <div class="flex justify-between text-xs font-bold text-emerald-700">
                            <span>Total abonado acumulado:</span>
                            <span>$${fmt(abonosU)} (Bs. ${fmt(abonosU * tasaOficial)})</span>
                        </div>

                        ${saldoAFavorUsd > 0 ? `
                        <div class="bg-emerald-50 border-2 border-emerald-600 rounded p-4 text-center mt-3">
                            <span class="text-xs font-black text-emerald-900 uppercase">Saldo a Favor del Cliente</span>
                            <p class="font-heading font-black text-3xl text-emerald-600 mt-1">+$${fmt(saldoAFavorUsd)} USD</p>
                            <p class="font-bold text-xs text-emerald-800">Bs. ${fmt(saldoAFavorUsd * tasaOficial)}</p>
                            <div class="mt-3 bg-white border border-emerald-500 rounded p-2.5 text-xs text-emerald-950 font-bold leading-tight text-left">
                                ✓ <strong>Consolidación como ganancia:</strong> Al liquidar y cerrar la cuenta, este excedente de <strong>$${fmt(saldoAFavorUsd)}</strong> se consolidará automáticamente como ganancia del negocio.
                            </div>
                        </div>
                        ` : `
                        <div class="bg-green-50 border-2 border-green-600 rounded p-4 text-center mt-2">
                            <span class="text-xs font-black text-green-900 uppercase">Totalmente Pagado</span>
                            <p class="font-heading font-black text-xl text-green-800 mt-1">Saldo pendiente: $0.00</p>
                        </div>
                        `}
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button id="modal-liq-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded">VOLVER</button>
                        <button id="modal-liq-ok" class="${saldoAFavorUsd > 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-green-600 hover:bg-green-700"} text-white font-heading font-black py-3 rounded border-2 border-brand-black shadow-brutal-sm">
                            ${saldoAFavorUsd > 0 ? "LIQUIDAR Y CONSOLIDAR GANANCIA" : "CONFIRMAR CIERRE"}
                        </button>
                    </div>
                </div>
            </div>`;

            const cerrar = () => { this.modal.innerHTML = ""; };
            this.modal.querySelector("#modal-liq-cancel")?.addEventListener("click", cerrar);
            this.modal.querySelector("#modal-liq-ok")?.addEventListener("click", async () => {
                if (!this.cuentaSeleccionada) return;
                await api.cerrarCuenta(this.cuentaSeleccionada.ventaId, "0.00", tasaOficial.toFixed(4));
                this.cuentaSeleccionada = null;
                cerrar();
                void this.render();
            });
            return;
        }

        let metodosDisponibles: MetodoPagoConfig[] = [];
        try {
            metodosDisponibles = await api.listarMetodosPago();
        } catch (_) {
            metodosDisponibles = [
                { nombre: 'PUNTOD.VENTA', moneda: 'BS' },
                { nombre: 'BIOPAGO', moneda: 'BS' },
                { nombre: 'PAGO MOVIL', moneda: 'BS' },
                { nombre: 'TRANSF.BS.', moneda: 'BS' },
                { nombre: 'BS.EFEC.', moneda: 'BS' },
                { nombre: 'DOL.CASH', moneda: 'USD' },
                { nombre: 'ZELLE', moneda: 'USD' },
                { nombre: 'BINAN.USDT', moneda: 'USD' },
            ];
        }

        let tasaCobro = esDeuda ? tasaOficial : tasaOficial;

        interface LineaCobroCuenta {
            id: string;
            metodo: string;
            moneda: 'USD' | 'BS';
            monto: number;
            tasaCambio: number;
            referencia: string;
        }

        const defMetodoCierre = esDeuda
            ? (metodosDisponibles.find((m) => m.nombre === 'TRANSF.BS.') || metodosDisponibles[0] || { nombre: 'PUNTOD.VENTA', moneda: 'BS' as const })
            : (metodosDisponibles.find((m) => m.nombre === 'PUNTOD.VENTA') || metodosDisponibles[0] || { nombre: 'PUNTOD.VENTA', moneda: 'BS' as const });

        const vId = this.cuentaSeleccionada.ventaId;
        const borradorPrevio = this.pagosBorradorPorCuenta.get(vId);
        let lineasCobro: LineaCobroCuenta[];
        if (borradorPrevio && borradorPrevio.length > 0) {
            lineasCobro = borradorPrevio.map((p) => ({ ...p }));
            // Recálculo reactivo: si hay un único método en borrador, ajustar su monto al nuevo saldo pendiente tras agregar productos
            if (lineasCobro.length === 1 && lineasCobro[0]) {
                const unico = lineasCobro[0];
                unico.monto = unico.moneda === 'USD' ? saldoPendienteUsd : Number((saldoPendienteUsd * tasaCobro).toFixed(2));
                unico.tasaCambio = tasaCobro;
            } else if (lineasCobro.length > 1) {
                // Líneas múltiples: recalcular si hubo variación en el saldo pendiente tras añadir consumos
                const totalEsperadoBs = Number((saldoPendienteUsd * tasaCobro).toFixed(2));
                let sumaBs = 0;
                for (let i = 0; i < lineasCobro.length - 1; i++) {
                    const l = lineasCobro[i];
                    const t = l.tasaCambio > 0 ? l.tasaCambio : tasaCobro;
                    sumaBs += l.moneda === 'USD' ? l.monto * t : l.monto;
                }
                const restoBs = Math.max(0, Math.round((totalEsperadoBs - sumaBs) * 100) / 100);
                const ultima = lineasCobro[lineasCobro.length - 1];
                if (ultima) {
                    ultima.monto = ultima.moneda === 'USD'
                        ? (tasaCobro > 0 ? Number((restoBs / tasaCobro).toFixed(2)) : 0)
                        : restoBs;
                    ultima.tasaCambio = tasaCobro;
                }
            }
        } else {
            lineasCobro = [
                {
                    id: 'p-1',
                    metodo: defMetodoCierre.nombre,
                    moneda: defMetodoCierre.moneda,
                    monto: defMetodoCierre.moneda === 'USD' ? saldoPendienteUsd : Number((saldoPendienteUsd * tasaCobro).toFixed(2)),
                    tasaCambio: tasaCobro,
                    referencia: '',
                },
            ];
        }

        const resVueltoPrevio = this.resolucionVueltoPorCuenta.get(vId);
        let estadoVuelto: 'PAGADO' | 'RETENIDO' = resVueltoPrevio?.estado || 'PAGADO';
        let metodoVuelto: string = resVueltoPrevio?.metodo || (esDeuda ? 'TRANSF.BS.' : 'BS.EFEC.');
        let tasaVuelto: number = resVueltoPrevio?.tasa || tasaCobro;

        if (!metodosDisponibles.some((m) => m.nombre === metodoVuelto)) {
            metodoVuelto = metodosDisponibles[0]?.nombre || (esDeuda ? 'TRANSF.BS.' : 'BS.EFEC.');
        }

        let mostrandoNuevoMetodo = false;

        const calcularTotales = () => {
            let cubiertoBs = 0;
            for (const l of lineasCobro) {
                if (l.moneda === 'USD') {
                    const t = l.tasaCambio > 0 ? l.tasaCambio : tasaCobro;
                    cubiertoBs += l.monto * t;
                } else {
                    cubiertoBs += l.monto;
                }
            }
            cubiertoBs = Math.round(cubiertoBs * 100) / 100;
            const totalEsperadoBs = Math.round(saldoPendienteUsd * tasaCobro * 100) / 100;
            const cubiertoUsd = tasaCobro > 0 ? Math.round((cubiertoBs / tasaCobro) * 100) / 100 : 0;
            const faltanteBs = Math.max(0, Math.round((totalEsperadoBs - cubiertoBs) * 100) / 100);
            const faltanteUsd = tasaCobro > 0 ? Math.max(0, Math.round((faltanteBs / tasaCobro) * 100) / 100) : 0;
            const vueltoBs = Math.max(0, Math.round((cubiertoBs - totalEsperadoBs) * 100) / 100);
            const vueltoUsd = tasaCobro > 0 ? Math.max(0, Math.round((vueltoBs / tasaCobro) * 100) / 100) : 0;
            const puedeConfirmar = cubiertoBs >= totalEsperadoBs - 0.01 && lineasCobro.every((l) => l.monto > 0);

            return {
                cubiertoUsd,
                cubiertoBs,
                totalEsperadoBs,
                faltanteUsd,
                faltanteBs,
                vueltoUsd,
                vueltoBs,
                puedeConfirmar,
            };
        };

        const renderModalLiquidacion = () => {
            const t = calcularTotales();

            const metodosUsd = metodosDisponibles.filter((m) => m.moneda === 'USD');
            const metodosBs = metodosDisponibles.filter((m) => m.moneda === 'BS');

            const filasHtml = lineasCobro
                .map((p, idx) => {
                    const optUsd = metodosUsd
                        .map(
                            (m) =>
                                `<option value="${m.nombre}" ${m.nombre === p.metodo ? 'selected' : ''}>${m.nombre} ($ - Tasa Dinámica)</option>`,
                        )
                        .join('');
                    const optBs = metodosBs
                        .map(
                            (m) =>
                                `<option value="${m.nombre}" ${m.nombre === p.metodo ? 'selected' : ''}>${m.nombre} (Bs.)</option>`,
                        )
                        .join('');

                    const opcionesMetodos = `
                        <optgroup label="MÉTODOS EN BOLÍVARES (Bs.)">
                            ${optBs}
                        </optgroup>
                        <optgroup label="MÉTODOS EN DÓLARES ($ - TASA PROPIA)">
                            ${optUsd}
                        </optgroup>
                    `;

                    const tasaUsd = p.tasaCambio > 0 ? p.tasaCambio : tasaCobro;
                    const aporteBs = p.moneda === 'USD' ? p.monto * tasaUsd : p.monto;
                    const equivOficialUsd = tasaCobro > 0 ? aporteBs / tasaCobro : 0;

                    return `
                    <div class="border-2 border-brand-black rounded-lg p-2.5 bg-gray-50 mb-2">
                        <div class="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                            <span class="font-heading font-black text-xs uppercase text-gray-700">
                                Pago #${idx + 1} · <span class="${p.moneda === 'USD' ? 'text-brand-purple' : 'text-brand-black'}">${p.moneda === 'USD' ? 'Divisa ($ USD)' : 'Moneda Nacional (Bs.)'}</span>
                            </span>
                            ${
                                lineasCobro.length > 1
                                    ? `<button data-eliminar-pago="${p.id}" class="text-[11px] font-black text-red-600 hover:text-red-800 bg-red-50 border border-red-300 rounded px-2 py-0.5">Eliminar</button>`
                                    : ''
                            }
                        </div>
                        ${
                            p.moneda === 'USD'
                                ? `
                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <div class="sm:col-span-4">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Medio en Divisa</label>
                                <select data-pago-metodo="${p.id}" class="w-full border-2 border-brand-black rounded px-2 py-1 font-heading font-black text-xs bg-white focus:outline-none">
                                    ${opcionesMetodos}
                                </select>
                            </div>
                            <div class="sm:col-span-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Monto ($ USD)</label>
                                <div class="flex items-center">
                                    <span class="bg-brand-black text-white px-2 py-1 rounded-l border-y-2 border-l-2 border-brand-black text-xs font-mono font-bold">$</span>
                                    <input type="number" step="0.01" min="0.01" max="999999" data-pago-monto="${p.id}" value="${p.monto > 0 ? p.monto : ''}" placeholder="0.00"
                                        class="w-full border-2 border-brand-black rounded-r px-2 py-1 text-xs font-mono font-black focus:outline-none text-right" />
                                </div>
                            </div>
                            <div class="sm:col-span-3">
                                <div class="flex items-center justify-between mb-0.5">
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase">Tasa (Bs./$)</label>
                                    <button type="button" data-reset-tasa-cuenta="${p.id}" class="text-[9px] font-black uppercase text-brand-purple hover:underline" title="Restablecer a tasa oficial">Base: ${fmt(tasaCobro)}</button>
                                </div>
                                <input type="number" step="0.01" min="1" max="100000" data-pago-tasa="${p.id}" value="${tasaUsd > 0 ? tasaUsd : tasaCobro}"
                                    class="w-full border-2 border-brand-black rounded px-2 py-1 text-xs font-mono font-black focus:outline-none text-right" />
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Referencia</label>
                                <input type="text" maxlength="25" data-pago-ref="${p.id}" value="${p.referencia || ''}" placeholder="Opcional"
                                    class="w-full border-2 border-brand-black rounded px-2 py-1 text-xs font-mono focus:outline-none" />
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center justify-between gap-1 mt-1 text-[11px]">
                            <span class="font-bold text-brand-purple">Aporte: Bs. ${fmt(aporteBs)}</span>
                            <span class="text-gray-500 font-mono">Equiv. base: $ ${fmt(equivOficialUsd)} ${tasaUsd !== tasaCobro ? `(Tasa: Bs. ${fmt(tasaUsd)} vs Base: Bs. ${fmt(tasaCobro)})` : ''}</span>
                        </div>
                        `
                                : `
                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <div class="sm:col-span-5">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Medio en Bolívares</label>
                                <select data-pago-metodo="${p.id}" class="w-full border-2 border-brand-black rounded px-2 py-1 font-heading font-black text-xs bg-white focus:outline-none">
                                    ${opcionesMetodos}
                                </select>
                            </div>
                            <div class="sm:col-span-4">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Monto (Bs.)</label>
                                <div class="flex items-center">
                                    <span class="bg-brand-black text-white px-2 py-1 rounded-l border-y-2 border-l-2 border-brand-black text-xs font-mono font-bold">Bs.</span>
                                    <input type="number" step="0.01" min="0.01" max="999999999" data-pago-monto="${p.id}" value="${p.monto > 0 ? p.monto : ''}" placeholder="0.00"
                                        class="w-full border-2 border-brand-black rounded-r px-2 py-1 text-xs font-mono font-black focus:outline-none text-right" />
                                </div>
                            </div>
                            <div class="sm:col-span-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Referencia</label>
                                <input type="text" maxlength="25" data-pago-ref="${p.id}" value="${p.referencia || ''}" placeholder="Opcional"
                                    class="w-full border-2 border-brand-black rounded px-2 py-1 text-xs font-mono focus:outline-none" />
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center justify-between gap-1 mt-1 text-[11px]">
                            <span class="font-bold text-brand-black">Aporte directo: Bs. ${fmt(p.monto)}</span>
                            <span class="text-gray-500 font-mono">Equiv. base: $ ${fmt(equivOficialUsd)}</span>
                        </div>
                        `
                        }
                    </div>`;
                })
                .join('');

            const cfgMetodoVuelto = metodosDisponibles.find((m) => m.nombre === metodoVuelto);
            const metodoVueltoEsUsd = cfgMetodoVuelto?.moneda === 'USD';
            const tasaVueltoEfectiva = tasaVuelto > 0 ? tasaVuelto : tasaCobro;
            const montoVueltoUsdCalculado = metodoVueltoEsUsd && tasaVueltoEfectiva > 0
                ? Number((t.vueltoBs / tasaVueltoEfectiva).toFixed(2))
                : t.vueltoUsd;

            const estadoBalanceHtml =
                t.faltanteBs > 0.009
                    ? `
                    <div class="bg-amber-50 border-2 border-amber-500 rounded p-2.5 text-center mb-3">
                        <p class="text-xs font-black uppercase text-amber-900">Monto Incompleto por Cubrir</p>
                        <p class="font-heading font-black text-lg text-amber-700">Faltan Bs. ${fmt(t.faltanteBs)} · <span class="text-sm text-amber-900">$ ${fmt(t.faltanteUsd)} (Equiv. Base)</span></p>
                    </div>`
                    : t.vueltoBs > 0.009
                    ? `
                    <div class="border-2 border-emerald-700 bg-emerald-50/70 rounded-lg p-3 mb-3">
                        <div class="flex flex-wrap items-center justify-between gap-1 mb-2">
                            <div>
                                <span class="text-[10px] font-black uppercase text-emerald-900 tracking-wide block">Excedente / Vuelto del Cliente</span>
                                <span class="font-heading font-black text-lg text-emerald-800">Bs. ${fmt(t.vueltoBs)}</span>
                            </div>
                            <span class="text-xs font-bold text-emerald-900 font-mono">$ ${fmt(t.vueltoUsd)} equiv.</span>
                        </div>

                        <!-- Selector: Entregar Vuelto vs Retener Vuelto -->
                        <div class="grid grid-cols-2 gap-2 mb-2.5">
                            <button type="button" id="btn-vuelto-pagado-cuenta" class="py-1.5 px-2 rounded border-2 text-xs font-heading font-black transition-all ${estadoVuelto === 'PAGADO' ? 'bg-emerald-700 text-white border-brand-black shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}">
                                ENTREGAR VUELTO (PAGADO)
                            </button>
                            <button type="button" id="btn-vuelto-retenido-cuenta" class="py-1.5 px-2 rounded border-2 text-xs font-heading font-black transition-all ${estadoVuelto === 'RETENIDO' ? 'bg-emerald-700 text-white border-brand-black shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}">
                                RETENER VUELTO (A FAVOR)
                            </button>
                        </div>

                        ${estadoVuelto === 'PAGADO' ? `
                        <div class="bg-white border border-emerald-600 rounded p-2.5 space-y-2">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <label class="text-[11px] font-bold text-gray-700 uppercase">Método de Egreso del Vuelto:</label>
                                <select id="select-metodo-vuelto-cuenta" class="border-2 border-brand-black rounded px-2 py-1 text-xs font-bold bg-white focus:outline-none">
                                    ${metodosDisponibles.map((m) => `
                                        <option value="${m.nombre}" ${m.nombre === metodoVuelto ? 'selected' : ''}>
                                            ${m.nombre} (${m.moneda === 'USD' ? '$ Dólares' : 'Bs. Bolívares'})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            ${metodoVueltoEsUsd ? `
                            <div class="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-gray-100">
                                <div>
                                    <span class="text-[10px] font-bold text-gray-500 uppercase block">Tasa Pactada Vuelto USD:</span>
                                    <div class="flex items-center gap-1.5">
                                        <input id="input-tasa-vuelto-cuenta" type="text" inputmode="decimal" value="${tasaVuelto.toFixed(2)}"
                                            class="w-24 border-2 border-brand-black rounded px-2 py-0.5 text-xs font-mono font-bold" />
                                        <button id="btn-reset-tasa-vuelto-cuenta" type="button" class="text-[10px] bg-gray-100 border border-gray-400 rounded px-1.5 py-0.5 hover:bg-gray-200">
                                            Reset Base
                                        </button>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] font-bold text-gray-500 uppercase block">Divisa USD a Entregar:</span>
                                    <span class="font-heading font-black text-base text-brand-purple">
                                        $ ${fmt(montoVueltoUsdCalculado)} USD
                                    </span>
                                </div>
                            </div>
                            ` : `
                            <div class="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                                <span class="font-bold text-gray-600">Total a Entregar en Bolívares:</span>
                                <span class="font-heading font-black text-base text-brand-black">Bs. ${fmt(t.vueltoBs)}</span>
                            </div>
                            `}
                        </div>
                        ` : `
                        <div class="bg-white border border-gray-300 rounded p-2 text-xs text-gray-700">
                            <p class="font-bold text-emerald-900 mb-0.5">Vuelto Retenido como Saldo a Favor</p>
                            <p class="text-[11px] text-gray-600 leading-tight">
                                El excedente de <b>Bs. ${fmt(t.vueltoBs)} ($ ${fmt(t.vueltoUsd)})</b> no genera egreso físico de caja y se asienta en el comprobante como saldo a favor retenido en el negocio.
                            </p>
                        </div>
                        `}
                    </div>`
                    : '';

            this.modal.innerHTML = `
            <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between border-b-2 border-brand-black pb-3 mb-3">
                        <div>
                            <span class="text-[10px] font-black uppercase tracking-wider text-brand-purple">
                                ${esDeuda ? "Cobro de Crédito Comercial" : "Cobro de Comanda en Local"}
                            </span>
                            <h3 class="font-heading font-black text-2xl">
                                ${esDeuda ? "COBRAR Y LIQUIDAR DEUDA" : "LIQUIDAR CUENTA"}
                            </h3>
                            <p class="font-body text-xs text-gray-600 font-bold">
                                ${this.cuentaSeleccionada?.etiqueta} ${this.cuentaSeleccionada?.cliente ? `· ${this.cuentaSeleccionada.cliente}` : ""}
                            </p>
                        </div>
                        <button id="modal-liq-cerrar" class="w-8 h-8 rounded border-2 border-brand-black font-black flex items-center justify-center hover:bg-gray-100">&times;</button>
                    </div>

                    <!-- Resumen del Importe Pendiente -->
                    <div class="bg-brand-gray/30 border-2 border-brand-black rounded-lg p-3 mb-3 flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <span class="text-[10px] font-bold text-gray-600 uppercase block">Saldo Neto a Cobrar</span>
                            <div class="flex items-baseline gap-2">
                                <span class="font-heading font-black text-2xl text-brand-black">$ ${fmt(saldoPendienteUsd)} USD</span>
                                <span class="font-heading font-black text-xl text-brand-purple">Bs. ${fmt(t.totalEsperadoBs)}</span>
                            </div>
                        </div>
                        <div class="text-right text-xs">
                            <span class="text-gray-500 font-bold block">Consumo: $${fmt(totalU)} · Abonos: $${fmt(abonosU)}</span>
                        </div>
                    </div>

                    <!-- Control de Tasa (Libre para Deudas, Fija para Cuenta) -->
                    ${esDeuda ? `
                    <div class="bg-gray-50 border-2 border-brand-black rounded p-3 mb-3">
                        <label class="block text-xs font-black uppercase text-gray-800 mb-1">Tasa Libre de Cobro (Bs. / USD):</label>
                        <div class="flex gap-2">
                            <input id="deuda-tasa-input" type="text" inputmode="decimal" maxlength="9" value="${tasaCobro.toFixed(4)}"
                                class="flex-1 border-2 border-brand-black rounded px-3 py-1.5 font-mono font-black text-base text-brand-black" />
                            <button id="btn-tasa-bcv" type="button" class="bg-gray-200 hover:bg-gray-300 text-brand-black font-heading font-black text-[11px] px-3 py-1.5 rounded border-2 border-brand-black">
                                TASA DEL DÍA (BCV)
                            </button>
                        </div>
                        <p class="text-[11px] text-gray-500 font-bold mt-1">Usted define libremente la tasa al momento de liquidar o aplica la oficial del día.</p>
                    </div>` : ''}

                    <!-- Lista de Métodos de Pago -->
                    <div class="mb-3">
                        <span class="text-[10px] font-heading font-black uppercase text-gray-600 block mb-1">
                            Métodos de Pago Aplicados (${lineasCobro.length})
                        </span>
                        ${filasHtml}
                    </div>

                    <!-- Acciones sobre Métodos -->
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <button id="btn-agregar-pago-cuenta" class="bg-blue-50 text-blue-950 hover:bg-blue-100 border-2 border-brand-black rounded px-3 py-1.5 text-xs font-heading font-black shadow-brutal-sm">
                            + AGREGAR OTRO MÉTODO (PAGO MIXTO)
                        </button>
                        <button id="btn-toggle-nuevo-metodo-cuenta" class="bg-white text-gray-800 hover:bg-gray-50 border border-brand-black rounded px-2.5 py-1.5 text-xs font-bold">
                            + CREAR MÉTODO DE PAGO
                        </button>
                    </div>

                    <!-- Subformulario para Crear Nuevo Método -->
                    ${
                        mostrandoNuevoMetodo
                            ? `
                    <div class="bg-purple-50 border-2 border-brand-purple rounded-lg p-3 mb-3">
                        <p class="text-xs font-heading font-black text-brand-purple uppercase mb-1.5">Nuevo Método de Pago</p>
                        <div class="space-y-2">
                            <div class="flex gap-2">
                                <input id="input-nuevo-metodo-nombre-cuenta" type="text" maxlength="25" placeholder="Ej: BANESCO PANAMA, USDT..."
                                    class="flex-1 border-2 border-brand-black rounded px-2.5 py-1 text-xs font-bold uppercase focus:outline-none" />
                                <button id="btn-guardar-nuevo-metodo-cuenta" class="bg-brand-purple text-white border-2 border-brand-black rounded px-3 py-1 text-xs font-heading font-black hover:opacity-90">
                                    GUARDAR
                                </button>
                            </div>
                            <div class="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-800">
                                <span class="text-[10px] text-gray-500 uppercase">Moneda Base:</span>
                                <label class="inline-flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="radio-nuevo-metodo-moneda-cuenta" value="USD" checked class="text-brand-purple" />
                                    <span>Dólares ($ USD - Tasa Dinámica)</span>
                                </label>
                                <label class="inline-flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="radio-nuevo-metodo-moneda-cuenta" value="BS" class="text-brand-purple" />
                                    <span>Bolívares (Bs.)</span>
                                </label>
                            </div>
                        </div>
                    </div>`
                            : ''
                    }

                    <!-- Balance -->
                    ${estadoBalanceHtml}

                    <div id="cobro-error-cuenta" class="hidden text-red-700 text-xs font-bold mb-3 bg-red-50 border border-red-400 rounded p-2"></div>

                    <!-- Acciones Finales -->
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-brand-black">
                        <div class="flex items-center gap-2">
                            <button id="modal-liq-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-2 px-4 rounded text-xs hover:bg-gray-100">
                                VOLVER
                            </button>
                            <button id="modal-liq-agregar-mas" class="bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-brand-black font-heading font-black py-2 px-3 rounded text-xs">
                                ${esDeuda ? "AGREGAR CARGOS A LA DEUDA" : "AGREGAR MÁS CONSUMOS"}
                            </button>
                        </div>
                        <button id="modal-liq-ok" ${!t.puedeConfirmar ? 'disabled' : ''}
                            class="bg-green-700 hover:bg-green-800 disabled:opacity-30 disabled:cursor-not-allowed text-white font-heading font-black py-2 px-5 rounded border-2 border-brand-black shadow-brutal-sm text-sm">
                            CONFIRMAR COBRO
                        </button>
                    </div>
                </div>
            </div>`;

            conectarEventosLiquidacion();
        };

        const conectarEventosLiquidacion = () => {
            const guardarBorrador = () => {
                if (this.cuentaSeleccionada) {
                    this.pagosBorradorPorCuenta.set(this.cuentaSeleccionada.ventaId, lineasCobro);
                    this.resolucionVueltoPorCuenta.set(this.cuentaSeleccionada.ventaId, {
                        estado: estadoVuelto,
                        metodo: metodoVuelto,
                        tasa: tasaVuelto,
                    });
                }
            };

            const cerrar = () => {
                guardarBorrador();
                this.modal.innerHTML = "";
            };
            this.modal.querySelector("#modal-liq-cerrar")?.addEventListener("click", cerrar);
            this.modal.querySelector("#modal-liq-cancel")?.addEventListener("click", cerrar);
            this.modal.querySelector("#modal-liq-agregar-mas")?.addEventListener("click", () => {
                guardarBorrador();
                this.modal.innerHTML = "";
            });

            // Selector entrega vs retencion de vuelto
            this.modal.querySelector('#btn-vuelto-pagado-cuenta')?.addEventListener('click', () => {
                estadoVuelto = 'PAGADO';
                guardarBorrador();
                renderModalLiquidacion();
            });
            this.modal.querySelector('#btn-vuelto-retenido-cuenta')?.addEventListener('click', () => {
                estadoVuelto = 'RETENIDO';
                guardarBorrador();
                renderModalLiquidacion();
            });

            // Selector metodo vuelto
            this.modal.querySelector<HTMLSelectElement>('#select-metodo-vuelto-cuenta')?.addEventListener('change', (e) => {
                metodoVuelto = (e.target as HTMLSelectElement).value;
                guardarBorrador();
                renderModalLiquidacion();
            });

            // Tasa para vuelto en divisa
            const inpTasaVuelto = this.modal.querySelector<HTMLInputElement>('#input-tasa-vuelto-cuenta');
            if (inpTasaVuelto) {
                inpTasaVuelto.addEventListener('input', (e) => {
                    const val = parseNum((e.target as HTMLInputElement).value);
                    tasaVuelto = val > 0 ? val : tasaCobro;
                    guardarBorrador();
                });
                inpTasaVuelto.addEventListener('blur', () => {
                    renderModalLiquidacion();
                });
            }
            this.modal.querySelector('#btn-reset-tasa-vuelto-cuenta')?.addEventListener('click', () => {
                tasaVuelto = tasaCobro;
                guardarBorrador();
                renderModalLiquidacion();
            });

            // Tasa libre si es deuda
            if (esDeuda) {
                const inputTasa = this.modal.querySelector("#deuda-tasa-input") as HTMLInputElement | null;
                const btnTasaBcv = this.modal.querySelector("#btn-tasa-bcv");
                if (inputTasa) {
                    sanitizarInputDecimal(inputTasa, 100000, 9, () => {
                        const t = parseNum(inputTasa.value);
                        tasaCobro = (Number.isFinite(t) && t > 0) ? t : tasaOficial;
                        guardarBorrador();
                        renderModalLiquidacion();
                    });
                }
                btnTasaBcv?.addEventListener("click", () => {
                    tasaCobro = tasaOficial;
                    guardarBorrador();
                    renderModalLiquidacion();
                });
            }

            // Selectores de método
            this.modal.querySelectorAll<HTMLSelectElement>('select[data-pago-metodo]').forEach((sel) => {
                sel.addEventListener('change', (e) => {
                    const id = sel.dataset.pagoMetodo;
                    const val = (e.target as HTMLSelectElement).value;
                    const item = lineasCobro.find((x) => x.id === id);
                    if (item) {
                        const cfg = metodosDisponibles.find((m) => m.nombre === val);
                        const nuevaMoneda = cfg?.moneda || 'BS';
                        item.moneda = nuevaMoneda;
                        item.tasaCambio = tasaCobro;
                        if (lineasCobro.length === 1) {
                            item.monto = item.moneda === 'USD' ? saldoPendienteUsd : Number((saldoPendienteUsd * tasaCobro).toFixed(2));
                        } else if (nuevaMoneda !== item.moneda) {
                            if (nuevaMoneda === 'USD') {
                                item.monto = Number((tasaCobro > 0 ? item.monto / tasaCobro : 0).toFixed(2));
                            } else {
                                item.monto = Number((item.monto * tasaCobro).toFixed(2));
                            }
                        }
                        item.metodo = val;
                        guardarBorrador();
                        renderModalLiquidacion();
                    }
                });
            });

            // Inputs de tasa (para métodos en USD)
            this.modal.querySelectorAll<HTMLInputElement>('input[data-pago-tasa]').forEach((inp) => {
                inp.addEventListener('input', (e) => {
                    const id = inp.dataset.pagoTasa;
                    const val = parseNum((e.target as HTMLInputElement).value);
                    const item = lineasCobro.find((x) => x.id === id);
                    if (item) {
                        item.tasaCambio = val > 0 ? val : tasaCobro;
                        guardarBorrador();
                        const t = calcularTotales();
                        const btnConf = this.modal.querySelector<HTMLButtonElement>('#modal-liq-ok');
                        if (btnConf) btnConf.disabled = !t.puedeConfirmar;
                    }
                });
                inp.addEventListener('blur', () => {
                    renderModalLiquidacion();
                });
            });

            // Botón reset de tasa a tasa base
            this.modal.querySelectorAll<HTMLButtonElement>('button[data-reset-tasa-cuenta]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.resetTasaCuenta;
                    const item = lineasCobro.find((x) => x.id === id);
                    if (item) {
                        item.tasaCambio = tasaCobro;
                        guardarBorrador();
                        renderModalLiquidacion();
                    }
                });
            });

            // Inputs de monto
            this.modal.querySelectorAll<HTMLInputElement>('input[data-pago-monto]').forEach((inp) => {
                inp.addEventListener('input', (e) => {
                    const id = inp.dataset.pagoMonto;
                    const val = parseNum((e.target as HTMLInputElement).value);
                    const item = lineasCobro.find((x) => x.id === id);
                    if (item) {
                        item.monto = val;
                        guardarBorrador();
                        const t = calcularTotales();
                        const btnConf = this.modal.querySelector<HTMLButtonElement>('#modal-liq-ok');
                        if (btnConf) btnConf.disabled = !t.puedeConfirmar;
                    }
                });
                inp.addEventListener('blur', () => {
                    renderModalLiquidacion();
                });
            });

            // Inputs de referencia
            this.modal.querySelectorAll<HTMLInputElement>('input[data-pago-ref]').forEach((inp) => {
                inp.addEventListener('input', (e) => {
                    const id = inp.dataset.pagoRef;
                    const val = (e.target as HTMLInputElement).value;
                    const item = lineasCobro.find((x) => x.id === id);
                    if (item) {
                        item.referencia = val;
                        guardarBorrador();
                    }
                });
            });

            // Eliminar pago
            this.modal.querySelectorAll<HTMLButtonElement>('button[data-eliminar-pago]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.eliminarPago;
                    lineasCobro = lineasCobro.filter((x) => x.id !== id);
                    guardarBorrador();
                    renderModalLiquidacion();
                });
            });

            // Agregar otro método
            this.modal.querySelector('#btn-agregar-pago-cuenta')?.addEventListener('click', () => {
                let t = calcularTotales();
                const nuevoId = 'p-' + Math.random().toString(36).slice(2, 7);
                const nuevoMetodo =
                    metodosDisponibles.find((m) => !lineasCobro.some((l) => l.metodo === m.nombre)) ||
                    metodosDisponibles[0] ||
                    { nombre: 'BS.EFEC.', moneda: 'BS' as const };

                // Si no hay faltante porque el primer pago cubría el 100%, dividir el primer método a la mitad
                if (t.faltanteBs <= 0.01 && lineasCobro.length === 1 && lineasCobro[0]) {
                    const primero = lineasCobro[0];
                    const tPrimero = primero.tasaCambio > 0 ? primero.tasaCambio : tasaCobro;
                    const aporteOriginalBs = primero.moneda === 'USD' ? primero.monto * tPrimero : primero.monto;
                    const mitadBs = Math.round((aporteOriginalBs / 2) * 100) / 100;
                    primero.monto = primero.moneda === 'USD'
                        ? (tPrimero > 0 ? Number((mitadBs / tPrimero).toFixed(2)) : 0)
                        : mitadBs;
                    t = calcularTotales();
                }

                const faltante = t.faltanteBs > 0 ? t.faltanteBs : 0;
                lineasCobro.push({
                    id: nuevoId,
                    metodo: nuevoMetodo.nombre,
                    moneda: nuevoMetodo.moneda,
                    monto: nuevoMetodo.moneda === 'USD' ? (tasaCobro > 0 ? Number((faltante / tasaCobro).toFixed(2)) : 0) : faltante,
                    tasaCambio: tasaCobro,
                    referencia: '',
                });
                guardarBorrador();
                renderModalLiquidacion();
            });

            // Toggle nuevo método
            this.modal.querySelector('#btn-toggle-nuevo-metodo-cuenta')?.addEventListener('click', () => {
                mostrandoNuevoMetodo = !mostrandoNuevoMetodo;
                renderModalLiquidacion();
            });

            // Guardar nuevo método
            this.modal.querySelector('#btn-guardar-nuevo-metodo-cuenta')?.addEventListener('click', () => {
                void (async () => {
                    const inp = this.modal.querySelector<HTMLInputElement>('#input-nuevo-metodo-nombre-cuenta');
                    const nombre = inp?.value.trim() || '';
                    const radioUsd = this.modal.querySelector<HTMLInputElement>('input[name="radio-nuevo-metodo-moneda-cuenta"][value="USD"]');
                    const moneda: MonedaMetodo = radioUsd?.checked ? 'USD' : 'BS';
                    if (nombre) {
                        try {
                            metodosDisponibles = await api.crearMetodoPago(nombre, moneda);
                            mostrandoNuevoMetodo = false;
                            renderModalLiquidacion();
                        } catch (_) {}
                    }
                })();
            });

            // Confirmar liquidación
            this.modal.querySelector('#modal-liq-ok')?.addEventListener('click', () => {
                void (async () => {
                    if (!this.cuentaSeleccionada) return;
                    const errEl = this.modal.querySelector<HTMLDivElement>('#cobro-error-cuenta');
                    try {
                        const pagosFinales: PagoTicket[] = lineasCobro
                            .filter((l) => l.monto > 0)
                            .map((l) => {
                                const tasaFinal = l.moneda === 'USD' ? (l.tasaCambio > 0 ? l.tasaCambio : tasaCobro) : tasaCobro;
                                const aporteBs = l.moneda === 'USD' ? l.monto * tasaFinal : l.monto;
                                const aporteUsd = tasaCobro > 0 ? aporteBs / tasaCobro : 0;
                                return {
                                    metodo: l.metodo,
                                    moneda: l.moneda,
                                    montoUsd: (l.moneda === 'USD' ? l.monto : aporteUsd).toFixed(2),
                                    montoBs: aporteBs.toFixed(2),
                                    tasaCambio: l.moneda === 'USD' ? tasaFinal.toFixed(2) : undefined,
                                    referencia: l.referencia.trim() || undefined,
                                };
                            });

                        if (pagosFinales.length === 0) {
                            throw new Error('Debe especificar al menos un pago válido.');
                        }

                        const t = calcularTotales();
                        const totalRecibidoBs = pagosFinales.reduce((acc, p) => acc + Number(p.montoBs), 0);

                        const cfgVuelto = metodosDisponibles.find((m) => m.nombre === metodoVuelto);
                        const vueltoEsUsd = cfgVuelto?.moneda === 'USD';
                        const tasaVueltoFinal = vueltoEsUsd ? (tasaVuelto > 0 ? tasaVuelto : tasaCobro) : undefined;
                        const montoUsdVuelto = vueltoEsUsd && tasaVueltoFinal ? (t.vueltoBs / tasaVueltoFinal).toFixed(2) : t.vueltoUsd.toFixed(2);

                        const resVuelto: ResolucionVuelto = {
                            estado: t.vueltoBs > 0.009 ? estadoVuelto : 'SIN_VUELTO',
                            metodo: t.vueltoBs > 0.009 && estadoVuelto === 'PAGADO' ? metodoVuelto : undefined,
                            montoBs: t.vueltoBs > 0.009 ? t.vueltoBs.toFixed(2) : undefined,
                            montoUsd: t.vueltoBs > 0.009 ? montoUsdVuelto : undefined,
                            tasa: t.vueltoBs > 0.009 && estadoVuelto === 'PAGADO' && tasaVueltoFinal ? tasaVueltoFinal.toFixed(2) : undefined,
                        };

                        const vIdActual = this.cuentaSeleccionada.ventaId;
                        await api.cerrarCuenta(
                            vIdActual,
                            totalRecibidoBs.toFixed(2),
                            tasaCobro.toFixed(4),
                            pagosFinales,
                            resVuelto,
                        );
                        this.pagosBorradorPorCuenta.delete(vIdActual);
                        this.resolucionVueltoPorCuenta.delete(vIdActual);
                        this.cuentaSeleccionada = null;
                        this.modal.innerHTML = "";
                        void this.render();
                    } catch (e) {
                        if (errEl) {
                            errEl.textContent = e instanceof Error ? e.message.replace(/"/g, '') : String(e);
                            errEl.classList.remove('hidden');
                        }
                    }
                })();
            });
        };

        renderModalLiquidacion();
    }
}
