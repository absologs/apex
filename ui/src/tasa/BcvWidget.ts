import { api, invocar, RegistroHistoricoTasa } from '../negocio/api';

type Direccion = 'subio' | 'bajo' | 'estable';

interface TasaInfo {
    valor: string;
    fechaUnix: number;
    fluctuacionPct: string | null;
    direccion: Direccion | null;
}

const COLOR_SUBIO = '#00823B';
const COLOR_BAJO = '#C60C15';
const COLOR_ESTABLE = '#6B7280';
const INTERVALO_POLL_MS = 300_000;

export class BcvWidget {
    private contenedor: HTMLElement | null;
    private timer: number | null = null;

    constructor() {
        this.contenedor = document.getElementById('bcv-indicator');
    }

    public iniciar(): void {
        if (!this.contenedor) return;
        this.renderizarEsqueleto();
        void this.actualizar();
        this.timer = window.setInterval(() => void this.actualizar(), INTERVALO_POLL_MS);
    }

    public detener(): void {
        if (this.timer !== null) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    }

    private renderizarEsqueleto(): void {
        if (!this.contenedor) return;
        this.contenedor.innerHTML = `
            <div class="flex items-center gap-1.5 sm:gap-2 bg-white border-2 border-brand-black rounded px-2 sm:px-3 py-1 sm:py-2 shadow-brutal-sm">
                <span class="font-heading font-black text-[10px] sm:text-xs uppercase tracking-wider text-gray-600">BCV</span>
                <span id="bcv-valor" title="Clic para ver histórico y editar tasa" class="font-heading font-black text-sm sm:text-lg cursor-pointer hover:underline">--</span>
                <span id="bcv-fluctuacion" class="font-body font-bold text-[10px] sm:text-xs"></span>
                <button id="bcv-refresh" title="Actualizar tasa"
                    class="ml-0.5 sm:ml-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded border-2 border-brand-black bg-brand-yellow hover:-translate-y-0.5 transition-transform active:translate-y-0">
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                </button>
            </div>`;
        document.getElementById('bcv-refresh')?.addEventListener('click', () => void this.forzar());
        document.getElementById('bcv-valor')?.addEventListener('click', () => void this.abrirModalHistoricoYAjuste());
    }

    private async abrirModalHistoricoYAjuste(): Promise<void> {
        const modalRoot = document.getElementById('modal-root');
        if (!modalRoot) return;

        const historico: RegistroHistoricoTasa[] = await api.historicoTasas().catch(() => []);
        const actual = document.getElementById('bcv-valor')?.textContent || '--';

        modalRoot.innerHTML = `
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-lg">
                <div class="flex justify-between items-center border-b-2 border-brand-black pb-3 mb-4">
                    <div>
                        <h3 class="font-heading font-black text-2xl">TASA DE CAMBIO BCV</h3>
                        <p class="font-body text-xs text-gray-600">Historial cronológico de fluctuación cambiaria y ajuste controlado</p>
                    </div>
                    <button id="tasa-modal-cerrar" class="w-8 h-8 rounded border-2 border-brand-black flex items-center justify-center font-black text-lg hover:bg-gray-100">&times;</button>
                </div>

                <!-- Formulario de ajuste manual con confirmación de seguridad -->
                <div class="bg-gray-50 border-2 border-brand-black rounded-lg p-4 mb-4">
                    <h4 class="font-heading font-black text-xs uppercase mb-1">Ajustar Tasa Manualmente</h4>
                    <p class="text-[11px] text-gray-600 font-bold mb-3">Tasa vigente actual: <span class="text-brand-black font-black">Bs. ${actual}</span></p>
                    <form id="form-tasa-manual" class="flex gap-2">
                        <input id="in-tasa-manual" type="number" step="0.01" min="1" max="999999" placeholder="Ej: 805.50"
                            class="flex-1 border-2 border-brand-black rounded px-3 py-2 text-sm font-black focus:ring-2 focus:ring-brand-purple" required />
                        <button type="submit" class="bg-brand-black text-white font-heading font-black px-4 py-2 rounded border-2 border-brand-black text-xs shadow-brutal-sm hover:-translate-y-0.5 transition-transform">
                            MODIFICAR TASA
                        </button>
                    </form>
                    <p id="msg-tasa-confirm" class="hidden text-xs font-bold text-amber-900 mt-2 bg-amber-100 p-2 border border-brand-black rounded"></p>
                </div>

                <!-- Historial Cronológico de Tasas -->
                <div>
                    <h4 class="font-heading font-black text-xs uppercase mb-2">Histórico de Actualizaciones (${historico.length})</h4>
                    <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        ${historico.length === 0 ? '<p class="text-xs text-gray-400 font-bold py-4 text-center">Sin registros históricos previos.</p>' :
                        historico.map((h) => `
                            <div class="border border-brand-black rounded p-2 bg-white flex justify-between items-center text-xs">
                                <div>
                                    <span class="font-black font-heading text-sm text-brand-black">Bs. ${Number(h.valor).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <span class="text-[10px] text-gray-500 font-bold ml-2">· ${h.motivo || 'Actualización'}</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] px-1.5 py-0.5 rounded border border-brand-black font-black uppercase ${h.tipo === 'manual' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}">
                                        ${h.tipo}
                                    </span>
                                    <p class="text-[10px] text-gray-500 font-mono mt-0.5">${h.fechaHora}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="flex justify-between items-center pt-4 border-t-2 border-brand-black text-xs text-gray-500 font-bold mt-4">
                    <span>Sincronización oficial del Banco Central</span>
                    <button id="tasa-modal-btn-cerrar" class="bg-brand-black text-white px-4 py-2 rounded font-black font-heading text-xs">CERRAR</button>
                </div>
            </div>
        </div>`;

        const cerrar = () => { modalRoot.innerHTML = ''; };
        document.getElementById('tasa-modal-cerrar')?.addEventListener('click', cerrar);
        document.getElementById('tasa-modal-btn-cerrar')?.addEventListener('click', cerrar);

        const form = document.getElementById('form-tasa-manual');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('in-tasa-manual') as HTMLInputElement | null;
            const nuevoVal = Number(input?.value || 0);
            if (!nuevoVal || nuevoVal <= 0) return;

            // Confirmación obligatoria de seguridad
            const confirmado = window.confirm(
                `¿Está seguro de que desea cambiar la tasa oficial del sistema a Bs. ${nuevoVal.toFixed(2)}?\n\nEsta tasa afectará todos los nuevos cobros y tickets a partir de este momento.`
            );

            if (confirmado) {
                const tasa = await invocar<TasaInfo>('fijar_tasa_manual', { tasa: nuevoVal.toFixed(2) });
                if (tasa) this.pintar(tasa);
                cerrar();
            }
        });
    }

    private async actualizar(): Promise<void> {
        const tasa = await this.obtenerTasa('obtener_tasa_bcv');
        if (tasa) this.pintar(tasa);
    }

    private async forzar(): Promise<void> {
        const boton = document.getElementById('bcv-refresh');
        if (boton) boton.classList.add('animate-spin');
        const tasa = await this.obtenerTasa('forzar_actualizacion_tasa');
        if (boton) boton.classList.remove('animate-spin');
        if (tasa) this.pintar(tasa);
    }

    private async obtenerTasa(comando: string): Promise<TasaInfo | null> {
        try {
            return await invocar<TasaInfo>(comando);
        } catch {
            return null;
        }
    }

    private pintar(tasa: TasaInfo): void {
        const elValor = document.getElementById('bcv-valor');
        const elFluct = document.getElementById('bcv-fluctuacion');
        if (!elValor || !elFluct) return;

        const valorNumerico = Number(tasa.valor);
        elValor.textContent = Number.isFinite(valorNumerico) && valorNumerico > 0
            ? valorNumerico.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '--';

        if (Number.isFinite(valorNumerico) && valorNumerico > 0) {
            window.dispatchEvent(new CustomEvent('tasa_actualizada', { detail: valorNumerico }));
        }

        const pct = Number(tasa.fluctuacionPct);
        if (tasa.direccion && Number.isFinite(pct)) {
            const color = tasa.direccion === 'subio'
                ? COLOR_SUBIO
                : tasa.direccion === 'bajo' ? COLOR_BAJO : COLOR_ESTABLE;
            const signo = pct > 0 ? '+' : '';
            elFluct.textContent = `${signo}${pct.toFixed(2)}%`;
            elFluct.style.color = color;
        } else {
            elFluct.textContent = '';
        }
    }
}
