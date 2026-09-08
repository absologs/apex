import { api, JornadaLaboral, Ticket } from './api';
import { NegocioModel } from './NegocioModel';

export const parseNum = (n: unknown): number => {
    if (typeof n === 'number') return Number.isFinite(n) ? n : 0;
    if (n === null || n === undefined) return 0;
    let s = String(n).trim();
    if (!s) return 0;
    if (s.includes(',') && !s.includes('.')) {
        s = s.replace(',', '.');
    } else if (s.includes('.') && s.includes(',')) {
        s = s.replace(/\./g, '').replace(',', '.');
    }
    const val = parseFloat(s);
    return Number.isFinite(val) && !isNaN(val) ? val : 0;
};

const fmt = (n: number | string | undefined | null): string => {
    const num = parseNum(n);
    return num.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const duracion = (j: JornadaLaboral): string => {
    const fin = j.finUnix || Math.floor(Date.now() / 1000);
    const diff = Math.max(0, fin - j.inicioUnix);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${h}h ${m}m`;
};

const exportarJornadaCsv = (j: JornadaLaboral, tickets: Ticket[]): void => {
    const operadores = j.operadoresRelevo.length > 0 ? j.operadoresRelevo.join(' / ') : j.operadorActual;
    const ticketsDeJornada = tickets.filter((t) =>
        t.operador && j.operadoresRelevo.some((op) => t.operador === op)
    );

    const encabezadoJornada = [
        ['INFORME DE JORNADA', j.id],
        ['Estado', j.estado === 'abierta' ? 'En curso' : 'Cerrada'],
        ['Apertura', j.inicioStr],
        ['Cierre', j.finStr || '-'],
        ['Duracion', duracion(j)],
        ['Operadores', operadores],
        ['Total USD', `$${fmt(j.ventasTotalUsd)}`],
        ['Total Bs', `Bs. ${fmt(j.ventasTotalBs)}`],
        ['Tickets emitidos', String(j.ticketsEmitidos)],
        ['Vuelto pagado Bs', `Bs. ${fmt(j.vueltoPagadoBs)}`],
        ['Vuelto retenido Bs', `Bs. ${fmt(j.vueltoRetenidoBs)}`],
        ['Deudas liquidadas USD', `$${fmt(j.deudasLiquidadasUsd)}`],
        ['Entradas stock', String(j.entradasStockReg)],
        ['Mermas', String(j.mermasStockReg)],
        ['Cambios de precio', String(j.cambiosPrecioReg)],
        ['Tasa apertura', `Bs. ${j.tasaInicio}`],
        ['Tasa cierre', j.tasaFin ? `Bs. ${j.tasaFin}` : '-'],
        ...(j.checksumSha256 ? [['SHA-256', j.checksumSha256]] : []),
        [],
        ['TICKETS DE LA JORNADA'],
        ['ID Ticket', 'Fecha/Hora', 'Canal', 'Operador', 'Metodo(s) de Pago', 'Total USD', 'Total Bs'],
    ];

    const filaTickets = ticketsDeJornada.map((t) => {
        const metodos = t.pagos && t.pagos.length > 0
            ? t.pagos.map((p) => `${p.metodo}:$${fmt(p.montoUsd)}`).join(' | ')
            : 'DIRECTO';
        return [
            t.ventaId,
            t.fechaHora || '',
            t.canal || 'VENTA DIRECTA',
            t.operador || 'Caja',
            metodos,
            `$${fmt(t.totalUsd)}`,
            `Bs. ${fmt(t.totalBs)}`,
        ];
    });

    const todasLasFilas = [...encabezadoJornada, ...filaTickets];
    const csvContent = todasLasFilas
        .map((fila) => fila.map((celda) => `"${String(celda).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jornada_${j.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export class VentasView {
    private contenedor: HTMLElement;
    private modalRoot: HTMLElement;
    private modelo: NegocioModel;
    private jornadas: JornadaLaboral[] = [];
    private jornadaActual: JornadaLaboral | null = null;
    private todosLosTickets: Ticket[] = [];
    private busqueda: string = '';
    private expandidos: Set<string> = new Set();
    private paginaActual: number = 1;
    private readonly POR_PAGINA = 20;

    constructor(contenedor: HTMLElement, modalRoot: HTMLElement, modelo: NegocioModel) {
        this.contenedor = contenedor;
        this.modalRoot = modalRoot;
        this.modelo = modelo;
    }

    async render(): Promise<void> {
        const [jornadaActual, historico, tickets] = await Promise.all([
            api.obtenerJornadaActual(),
            api.listarHistoricoJornadas(),
            api.ventas(),
        ]);

        this.jornadaActual = jornadaActual;
        this.jornadas = historico;
        this.todosLosTickets = tickets;

        const totalJornadas = (jornadaActual ? 1 : 0) + historico.length;
        const todasParaKpi = [...(jornadaActual ? [jornadaActual] : []), ...historico];
        const totalUsd = todasParaKpi.reduce((a, j) => a + parseNum(j.ventasTotalUsd), 0);
        const totalTickets = todasParaKpi.reduce((a, j) => a + j.ticketsEmitidos, 0);

        this.contenedor.innerHTML = `
        <div class="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black font-heading">Historial de Jornadas</h2>
                <p class="text-brand-text font-body text-xs sm:text-sm">Registro de turnos operativos, balance consolidado y exportacion por jornada</p>
            </div>
            <span class="text-xs font-bold text-gray-700 bg-white border-2 border-brand-black px-3 py-1.5 rounded shadow-brutal-sm">
                ${totalJornadas} Jornada${totalJornadas !== 1 ? 's' : ''}
            </span>
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div class="border-2 border-brand-black rounded-lg shadow-brutal-sm p-3 bg-amber-50">
                <p class="font-heading font-bold text-[10px] uppercase tracking-wide text-brand-text">Facturado Total</p>
                <div class="font-heading font-black text-lg mt-0.5 text-brand-black">$ ${fmt(totalUsd)}</div>
            </div>
            <div class="border-2 border-brand-black rounded-lg shadow-brutal-sm p-3 ${jornadaActual ? 'bg-emerald-50' : 'bg-gray-50'}">
                <p class="font-heading font-bold text-[10px] uppercase tracking-wide text-brand-text">Estado Actual</p>
                <div class="font-heading font-black text-sm mt-0.5 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full inline-block shrink-0 ${jornadaActual ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}"></span>
                    ${jornadaActual ? 'Abierta' : 'Sin turno'}
                </div>
            </div>
            <div class="border-2 border-brand-black rounded-lg shadow-brutal-sm p-3 bg-purple-50">
                <p class="font-heading font-bold text-[10px] uppercase tracking-wide text-brand-text">Tasa BCV</p>
                <div class="font-heading font-black text-lg mt-0.5 text-brand-purple">Bs. ${fmt(this.modelo.tasaActual || 807.39)}</div>
            </div>
            <div class="border-2 border-brand-black rounded-lg shadow-brutal-sm p-3 bg-blue-50">
                <p class="font-heading font-bold text-[10px] uppercase tracking-wide text-brand-text">Tickets Totales</p>
                <div class="font-heading font-black text-lg mt-0.5 text-blue-900">${totalTickets}</div>
            </div>
        </div>

        <!-- Buscador -->
        <div class="mb-3">
            <input id="jornadas-buscar" type="text" maxlength="60"
                placeholder="Buscar por ID, operador, fecha..."
                value="${this.busqueda}"
                class="w-full border-2 border-brand-black rounded px-3.5 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white" />
        </div>

        <!-- Lista -->
        <div id="lista-jornadas" class="flex flex-col gap-2"></div>`;

        this.conectarEventosBuscador();
        this.renderLista();
    }

    private conectarEventosBuscador(): void {
        document.getElementById('jornadas-buscar')?.addEventListener('input', (e) => {
            this.busqueda = (e.target as HTMLInputElement).value;
            this.paginaActual = 1;
            this.renderLista();
        });
    }

    private renderLista(): void {
        const lista = document.getElementById('lista-jornadas');
        if (!lista) return;

        const todas: JornadaLaboral[] = [
            ...(this.jornadaActual ? [this.jornadaActual] : []),
            ...this.jornadas,
        ];

        const q = this.busqueda.trim().toLowerCase();
        const filtradas = q
            ? todas.filter((j) =>
                j.id.toLowerCase().includes(q) ||
                j.operadorActual.toLowerCase().includes(q) ||
                j.operadoresRelevo.some((op) => op.toLowerCase().includes(q)) ||
                j.inicioStr.toLowerCase().includes(q) ||
                (j.finStr || '').toLowerCase().includes(q)
            )
            : todas;

        // Eliminar bloque de paginacion previo si existe
        const pagAnterior = document.getElementById('paginacion-jornadas');
        if (pagAnterior) pagAnterior.remove();

        if (filtradas.length === 0) {
            lista.innerHTML = `
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-8 text-center text-gray-400 font-bold text-sm">
                ${q ? 'Sin jornadas que coincidan con la busqueda.' : 'No hay jornadas registradas en el sistema.'}
            </div>`;
            return;
        }

        const totalPaginas = Math.max(1, Math.ceil(filtradas.length / this.POR_PAGINA));
        // Clamp de seguridad
        if (this.paginaActual > totalPaginas) this.paginaActual = totalPaginas;
        if (this.paginaActual < 1) this.paginaActual = 1;

        const pagina = this.paginaActual;
        const enPagina = filtradas.slice((pagina - 1) * this.POR_PAGINA, pagina * this.POR_PAGINA);

        lista.innerHTML = enPagina.map((j) => this.renderFila(j)).join('');

        // Restaurar estado de expansiones
        enPagina.forEach((j) => {
            if (this.expandidos.has(j.id)) {
                const det = document.getElementById(`detalle-${j.id}`);
                det?.classList.remove('hidden');
                const icon = document.getElementById(`icon-${j.id}`);
                if (icon) icon.textContent = '\u25B2';
            }
        });

        lista.querySelectorAll('[data-toggle-jornada]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = (btn as HTMLElement).dataset.toggleJornada!;
                const detalle = document.getElementById(`detalle-${id}`);
                const icon = document.getElementById(`icon-${id}`);
                if (detalle) {
                    const abierto = detalle.classList.contains('hidden');
                    detalle.classList.toggle('hidden', !abierto);
                    if (icon) icon.textContent = abierto ? '\u25B2' : '\u25BC';
                    if (abierto) { this.expandidos.add(id); } else { this.expandidos.delete(id); }
                }
            });
        });

        lista.querySelectorAll('[data-exportar-jornada]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = (btn as HTMLElement).dataset.exportarJornada!;
                const j = filtradas.find((x) => x.id === id);
                if (j) exportarJornadaCsv(j, this.todosLosTickets);
            });
        });

        lista.querySelectorAll('[data-ver-ticket]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = (btn as HTMLElement).dataset.verTicket!;
                const ticket = this.todosLosTickets.find((x) => x.ventaId === id);
                if (ticket) this.mostrarModalTicket(ticket);
            });
        });

        // Insertar controles de paginacion como nodo hermano DESPUES de lista-jornadas
        const pagDiv = document.createElement('div');
        pagDiv.id = 'paginacion-jornadas';
        pagDiv.innerHTML = `
            <div class="flex items-center justify-between mt-3 gap-3 flex-wrap">
                <span class="text-xs font-bold text-gray-600">
                    Pagina ${pagina} de ${totalPaginas} &middot; ${filtradas.length} jornada${filtradas.length !== 1 ? 's' : ''}
                </span>
                <div class="flex gap-2">
                    <button id="btn-pag-ant"
                        class="border-2 border-brand-black font-heading font-black text-xs px-3 py-1.5 rounded shadow-brutal-sm bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        ${pagina === 1 ? 'disabled' : ''}>
                        ANTERIOR
                    </button>
                    <button id="btn-pag-sig"
                        class="border-2 border-brand-black font-heading font-black text-xs px-3 py-1.5 rounded shadow-brutal-sm bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        ${pagina === totalPaginas ? 'disabled' : ''}>
                        SIGUIENTE
                    </button>
                </div>
            </div>`;
        lista.insertAdjacentElement('afterend', pagDiv);

        document.getElementById('btn-pag-ant')?.addEventListener('click', () => {
            if (this.paginaActual > 1) {
                this.paginaActual--;
                this.renderLista();
            }
        });

        document.getElementById('btn-pag-sig')?.addEventListener('click', () => {
            if (this.paginaActual < totalPaginas) {
                this.paginaActual++;
                this.renderLista();
            }
        });
    }

    private renderFila(j: JornadaLaboral): string {
        const estaAbierta = j.estado === 'abierta';
        const operadores = j.operadoresRelevo.length > 0
            ? j.operadoresRelevo.join(', ')
            : j.operadorActual;

        const ticketsDeJornada = this.todosLosTickets.filter((t) =>
            t.operador && j.operadoresRelevo.some((op) => t.operador === op)
        );

        const acumuladoPorMetodo: Record<string, { usd: number; bs: number }> = {};
        ticketsDeJornada.forEach((t) => {
            (t.pagos || []).forEach((p) => {
                if (!acumuladoPorMetodo[p.metodo]) acumuladoPorMetodo[p.metodo] = { usd: 0, bs: 0 };
                acumuladoPorMetodo[p.metodo].usd += parseNum(p.montoUsd);
                acumuladoPorMetodo[p.metodo].bs += parseNum(p.montoBs);
            });
        });

        const metodoRows = Object.entries(acumuladoPorMetodo).map(([metodo, tot]) => `
            <div class="flex justify-between items-center text-xs border-b border-gray-100 last:border-none py-1">
                <span class="font-heading font-black text-brand-black">${metodo}</span>
                <div>
                    <span class="font-black">$ ${fmt(tot.usd)}</span>
                    <span class="text-brand-purple font-mono font-bold ml-2">Bs. ${fmt(tot.bs)}</span>
                </div>
            </div>`).join('');

        const ticketRows = ticketsDeJornada.length > 0
            ? ticketsDeJornada.map((t) => {
                const esCuenta = t.canal === 'CONSUMO EN CUENTA' || t.ventaId.startsWith('CTA-');
                const canalBadge = esCuenta
                    ? '<span class="bg-amber-100 text-amber-900 border border-brand-black px-1.5 py-0.5 rounded font-black text-[9px]">CUENTA</span>'
                    : '<span class="bg-blue-100 text-blue-900 border border-brand-black px-1.5 py-0.5 rounded font-black text-[9px]">VENTA</span>';
                let metodoBadge = '';
                if (t.pagos && t.pagos.length > 1) {
                    metodoBadge = '<span class="bg-amber-50 text-amber-950 border border-amber-500 px-1.5 py-0.5 rounded font-black text-[9px]">MIXTO</span>';
                } else if (t.pagos && t.pagos.length === 1) {
                    metodoBadge = `<span class="bg-gray-100 text-brand-black border border-brand-black px-1.5 py-0.5 rounded font-black text-[9px]">${t.pagos[0].metodo}</span>`;
                } else {
                    metodoBadge = '<span class="bg-gray-100 text-gray-500 border border-gray-300 px-1.5 py-0.5 rounded font-mono text-[9px]">DIRECTO</span>';
                }
                return `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="py-1.5 px-2 font-mono text-brand-purple text-[10px]">${t.ventaId}</td>
                    <td class="py-1.5 px-2 text-gray-500 text-[10px]">${t.fechaHora || '-'}</td>
                    <td class="py-1.5 px-2">${canalBadge}</td>
                    <td class="py-1.5 px-2">${metodoBadge}</td>
                    <td class="py-1.5 px-2 text-gray-700 text-[10px]">${t.operador || 'Caja'}</td>
                    <td class="py-1.5 px-2 text-right font-black text-brand-black text-[10px]">$ ${fmt(t.totalUsd)}</td>
                    <td class="py-1.5 px-2 text-right font-black text-brand-purple text-[10px]">Bs. ${fmt(t.totalBs)}</td>
                    <td class="py-1.5 px-2 text-center">
                        <button data-ver-ticket="${t.ventaId}"
                            class="bg-brand-black text-white hover:bg-gray-800 border border-brand-black px-2 py-0.5 rounded text-[9px] font-heading font-black shadow-brutal-sm">
                            VER
                        </button>
                    </td>
                </tr>`;
            }).join('')
            : `<tr><td colspan="8" class="py-3 text-center text-gray-400 font-bold text-xs">Sin tickets vinculados en la sesion actual.</td></tr>`;

        return `
        <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal-sm overflow-hidden">
            <!-- Fila compacta (siempre visible) -->
            <div class="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer select-none"
                 data-toggle-jornada="${j.id}">

                <!-- Indicador estado -->
                <span class="w-2 h-2 rounded-full shrink-0 ${estaAbierta ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}"></span>

                <!-- ID + badge -->
                <div class="flex items-center gap-1.5 min-w-0 flex-1">
                    <span class="font-mono font-black text-xs text-brand-black truncate">${j.id}</span>
                    <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border shrink-0
                        ${estaAbierta ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-gray-100 text-gray-600 border-gray-300'}">
                        ${estaAbierta ? 'EN CURSO' : 'CERRADA'}
                    </span>
                </div>

                <!-- Fecha -->
                <span class="text-[10px] text-gray-500 font-bold hidden sm:block shrink-0">${j.inicioStr}${j.finStr ? ` — ${j.finStr}` : ''}</span>

                <!-- Operadores -->
                <span class="text-[10px] text-gray-700 font-bold hidden md:block shrink-0 max-w-[140px] truncate" title="${operadores}">${operadores}</span>

                <!-- Totales -->
                <div class="flex items-center gap-3 shrink-0 ml-auto">
                    <span class="font-heading font-black text-xs text-brand-black hidden sm:block">${j.ticketsEmitidos} tkt</span>
                    <span class="font-heading font-black text-sm text-brand-black">$ ${fmt(j.ventasTotalUsd)}</span>
                    <span class="font-heading font-black text-sm text-brand-purple hidden sm:block">Bs. ${fmt(j.ventasTotalBs)}</span>
                </div>

                <!-- Boton CSV -->
                <button data-exportar-jornada="${j.id}"
                    title="Exportar jornada a CSV"
                    class="shrink-0 border-2 border-brand-black bg-white hover:bg-brand-black hover:text-white text-brand-black font-heading font-black text-[9px] px-2 py-1 rounded shadow-brutal-sm transition-colors ml-1">
                    CSV
                </button>

                <!-- Toggle icon -->
                <span id="icon-${j.id}" class="text-gray-400 font-black text-[10px] w-4 text-center shrink-0">\u25BC</span>
            </div>

            <!-- Panel de detalle (colapsado por defecto) -->
            <div id="detalle-${j.id}" class="hidden border-t-2 border-brand-black">

                <!-- Stats en grid compacto -->
                <div class="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-gray-200 border-b border-gray-200 text-center">
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Duracion</p>
                        <p class="font-bold text-xs text-brand-black mt-0.5">${duracion(j)}</p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Vuelto pagado</p>
                        <p class="font-bold text-xs text-brand-black mt-0.5">Bs. ${fmt(j.vueltoPagadoBs)}</p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Vuelto retenido</p>
                        <p class="font-bold text-xs text-brand-black mt-0.5">Bs. ${fmt(j.vueltoRetenidoBs)}</p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Deudas liquid.</p>
                        <p class="font-bold text-xs text-brand-black mt-0.5">$ ${fmt(j.deudasLiquidadasUsd)}</p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Stock in/merma</p>
                        <p class="font-bold text-xs mt-0.5">
                            <span class="text-emerald-700">${j.entradasStockReg}</span>
                            <span class="text-gray-400 mx-0.5">/</span>
                            <span class="${j.mermasStockReg > 0 ? 'text-red-600' : 'text-gray-500'}">${j.mermasStockReg}</span>
                        </p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Tasa apertura</p>
                        <p class="font-bold text-xs text-brand-purple mt-0.5">Bs. ${j.tasaInicio}</p>
                    </div>
                </div>

                <!-- Operadores full -->
                <div class="px-4 py-2 border-b border-gray-200 text-xs">
                    <span class="text-[9px] font-black uppercase text-gray-400 mr-2">Operadores en turno:</span>
                    <span class="font-bold text-brand-black">${operadores}</span>
                </div>

                <!-- Metodos de pago -->
                ${Object.keys(acumuladoPorMetodo).length > 0 ? `
                <div class="px-4 py-2 border-b border-gray-200">
                    <p class="text-[9px] font-black uppercase text-gray-400 mb-1.5">Desglose por metodo de pago</p>
                    <div class="bg-gray-50 border border-gray-200 rounded p-2">
                        ${metodoRows}
                    </div>
                </div>` : ''}

                <!-- Tabla de tickets -->
                <div class="p-3">
                    <p class="text-[9px] font-black uppercase text-gray-400 mb-1.5">Tickets de la jornada</p>
                    <div class="border border-brand-black rounded overflow-hidden overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-brand-black text-white font-heading font-bold text-[9px] uppercase">
                                <tr>
                                    <th class="py-1.5 px-2">ID</th>
                                    <th class="py-1.5 px-2">Fecha/Hora</th>
                                    <th class="py-1.5 px-2">Canal</th>
                                    <th class="py-1.5 px-2">Metodo</th>
                                    <th class="py-1.5 px-2">Operador</th>
                                    <th class="py-1.5 px-2 text-right">USD</th>
                                    <th class="py-1.5 px-2 text-right">Bs.</th>
                                    <th class="py-1.5 px-2 text-center">Ver</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 font-bold">
                                ${ticketRows}
                            </tbody>
                        </table>
                    </div>
                    ${j.checksumSha256 ? `<p class="text-[9px] font-mono text-gray-400 mt-1.5 break-all">SHA-256: ${j.checksumSha256}</p>` : ''}
                </div>
            </div>
        </div>`;
    }

    private mostrarModalTicket(ticket: Ticket): void {
        const tasaStr = ticket.tasaDelDia ? `Bs. ${fmt(ticket.tasaDelDia)}` : `Bs. ${fmt(this.modelo.tasaActual || 807.39)}`;

        const lineasHtml = ticket.lineas && ticket.lineas.length > 0
            ? ticket.lineas.map((l) => `
                <tr class="border-b border-gray-100 last:border-none">
                    <td class="py-2 pr-2">
                        <div class="font-bold text-gray-900">${l.nombre}</div>
                        <div class="text-[10px] text-gray-400 font-mono">${l.sku}</div>
                    </td>
                    <td class="py-2 text-center font-bold">${l.cantidad}</td>
                    <td class="py-2 text-right font-mono">$ ${fmt(l.precioUsd)}</td>
                    <td class="py-2 text-right font-bold text-brand-black">$ ${fmt(l.subtotalUsd)}</td>
                    <td class="py-2 text-right font-black text-brand-purple">Bs. ${fmt(l.subtotalBs)}</td>
                </tr>
            `).join('')
            : `<tr><td colspan="5" class="py-3 text-center text-gray-400 font-bold">Sin lineas individuales registradas.</td></tr>`;

        this.modalRoot.innerHTML = `
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-2xl max-h-[90vh] flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start border-b-2 border-brand-black pb-3 mb-4">
                        <div>
                            <span class="text-[10px] uppercase font-black tracking-widest text-brand-purple">Comprobante de Venta</span>
                            <h3 class="font-heading font-black text-2xl">${ticket.ventaId}</h3>
                            <p class="text-xs text-gray-600 font-bold mt-0.5">${ticket.fechaHora || 'Hoy'} · Canal: ${ticket.canal || 'VENTA DIRECTA'}</p>
                        </div>
                        <button id="modal-ticket-cerrar" class="w-8 h-8 rounded border-2 border-brand-black font-black flex items-center justify-center hover:bg-gray-100">
                            &times;
                        </button>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 bg-gray-50 border border-brand-black rounded p-3 text-xs">
                        <div>
                            <span class="text-[10px] text-gray-500 font-bold uppercase block">Operador / Mesa</span>
                            <span class="font-bold text-gray-900">${ticket.operador || 'Caja'}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-gray-500 font-bold uppercase block">Tasa BCV Auditada</span>
                            <span class="font-black text-brand-purple font-mono">${tasaStr}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-gray-500 font-bold uppercase block">Recibido (Bs.)</span>
                            <span class="font-bold text-gray-900">Bs. ${fmt(ticket.montoRecibidoBs || ticket.totalBs)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-gray-500 font-bold uppercase block">Vuelto (${ticket.estadoVuelto === 'RETENIDO' ? 'Retenido' : 'Entregado'})</span>
                            <span class="font-bold ${ticket.estadoVuelto === 'RETENIDO' ? 'text-blue-700' : 'text-green-700'}">Bs. ${fmt(ticket.vueltoBs || '0.00')}</span>
                        </div>
                    </div>

                    ${parseNum(ticket.vueltoBs) > 0.009 ? `
                    <div class="mb-3 ${ticket.estadoVuelto === 'RETENIDO' ? 'bg-blue-50 border-blue-500 text-blue-950' : 'bg-emerald-50 border-emerald-500 text-emerald-950'} border-2 rounded p-2.5 text-xs font-bold flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span class="text-[10px] font-black uppercase tracking-wider block">
                                ${ticket.estadoVuelto === 'RETENIDO' ? 'Vuelto Retenido (Saldo a Favor)' : 'Vuelto Pagado al Cliente'}
                            </span>
                            <span>
                                ${ticket.estadoVuelto === 'RETENIDO'
                                    ? 'Asentado como saldo a favor retenido.'
                                    : `Entregado via ${ticket.metodoVuelto || 'Efectivo'}${ticket.montoVueltoUsd && Number(ticket.montoVueltoUsd) > 0 && ticket.tasaVuelto ? ` ($ ${fmt(ticket.montoVueltoUsd)} a Bs. ${fmt(ticket.tasaVuelto)})` : ''}.`}
                            </span>
                        </div>
                        <span class="font-heading font-black text-lg shrink-0">Bs. ${fmt(ticket.vueltoBs)}</span>
                    </div>` : ''}

                    <div class="mb-3 border border-brand-black rounded p-2.5 bg-gray-50">
                        <span class="text-[10px] uppercase font-heading font-black text-gray-700 block mb-1">
                            Metodos de Pago (${ticket.pagos ? ticket.pagos.length : 1})
                        </span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            ${ticket.pagos && ticket.pagos.length > 0
                                ? ticket.pagos.map((p) => `
                                    <div class="bg-white border border-brand-black rounded p-2 text-xs flex justify-between items-center">
                                        <div>
                                            <span class="font-heading font-black text-brand-black">${p.metodo}</span>
                                            ${p.tasaCambio ? `<p class="text-[10px] font-mono font-bold text-brand-purple">Tasa: Bs. ${fmt(p.tasaCambio)}</p>` : ''}
                                            ${p.referencia ? `<p class="text-[10px] font-mono text-gray-500">Ref: ${p.referencia}</p>` : ''}
                                        </div>
                                        <div class="text-right">
                                            <span class="font-black text-brand-black block">$ ${fmt(p.montoUsd)}</span>
                                            <span class="text-[10px] font-mono font-bold text-brand-purple block">Bs. ${fmt(p.montoBs)}</span>
                                        </div>
                                    </div>
                                `).join('')
                                : '<div class="bg-white border border-gray-300 rounded p-2 text-xs col-span-2 text-gray-500 font-bold">Pago directo registrado en caja</div>'
                            }
                        </div>
                    </div>

                    ${ticket.saldoAFavorConsolidadoUsd ? `
                    <div class="mb-4 bg-emerald-50 border-2 border-emerald-600 rounded p-3 text-xs text-emerald-950 font-bold flex items-center justify-between">
                        <div>
                            <span class="text-[10px] font-black uppercase text-emerald-900 block">Excedente como Ganancia</span>
                            <span>Cuenta cerrada con saldo a favor liquidado.</span>
                        </div>
                        <span class="font-heading font-black text-lg text-emerald-700 ml-4 shrink-0">+$${fmt(ticket.saldoAFavorConsolidadoUsd)} USD</span>
                    </div>` : ''}

                    <div class="border border-brand-black rounded overflow-hidden mb-3 max-h-[30vh] overflow-y-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-brand-black text-white font-heading font-bold text-[10px] uppercase">
                                <tr>
                                    <th class="py-2 px-2">Producto</th>
                                    <th class="py-2 px-2 text-center">Cant.</th>
                                    <th class="py-2 px-2 text-right">Precio Unit.</th>
                                    <th class="py-2 px-2 text-right">Subtotal ($)</th>
                                    <th class="py-2 px-2 text-right">Subtotal (Bs.)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${lineasHtml}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <div class="border-t-2 border-brand-black pt-3 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <span class="text-xs font-bold text-gray-500 block">Total Liquidado:</span>
                            <div class="flex items-baseline gap-2">
                                <span class="font-heading font-black text-2xl text-brand-black">$ ${fmt(ticket.totalUsd)}</span>
                                <span class="font-heading font-black text-xl text-brand-purple font-mono">Bs. ${fmt(ticket.totalBs)}</span>
                            </div>
                        </div>
                        <button id="modal-ticket-ok" class="bg-brand-black text-white font-heading font-black px-6 py-2.5 rounded border border-brand-black shadow-brutal-sm hover:bg-gray-800">
                            CERRAR
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        const cerrar = () => { this.modalRoot.innerHTML = ''; };
        document.getElementById('modal-ticket-cerrar')?.addEventListener('click', cerrar);
        document.getElementById('modal-ticket-ok')?.addEventListener('click', cerrar);
    }
}
