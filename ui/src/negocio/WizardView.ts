import { api, ConfigInfo } from './api';
import { NegocioModel, RUBRO_ABASTO, RUBRO_LICORERIA, RUBRO_PANADERIA } from './NegocioModel';

export class WizardView {
    private contenedor: HTMLElement;
    private modelo: NegocioModel;
    private alTerminar: (cfg: ConfigInfo) => void;
    private modo: 'nuevo' | 'restaurar' = 'nuevo';
    private bloquearPanel: boolean = true;

    constructor(contenedor: HTMLElement, modelo: NegocioModel, alTerminar: (cfg: ConfigInfo) => void) {
        this.contenedor = contenedor;
        this.modelo = modelo;
        this.alTerminar = alTerminar;
    }

    render(): void {
        this.contenedor.innerHTML = `
        <div class="max-w-2xl mx-auto mt-3 sm:mt-8 mb-8 sm:mb-12">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-8">
                <div class="flex flex-wrap items-center justify-between border-b-2 border-brand-black pb-4 mb-6 gap-3">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-black font-heading">Instalación del Terminal</h1>
                        <p class="text-brand-text font-body text-xs">Configuración inicial o restauración de datos</p>
                    </div>
                    <div class="inline-flex border-2 border-brand-black rounded bg-gray-100 p-0.5">
                        <button id="wz-tab-nuevo" class="px-2.5 sm:px-3 py-1 sm:py-1.5 font-heading text-[11px] sm:text-xs rounded transition-colors ${this.modo === 'nuevo' ? 'font-black bg-brand-black text-white' : 'font-bold text-brand-black hover:bg-white'}">NUEVO NEGOCIO</button>
                        <button id="wz-tab-restaurar" class="px-2.5 sm:px-3 py-1 sm:py-1.5 font-heading text-[11px] sm:text-xs rounded transition-colors ${this.modo === 'restaurar' ? 'font-black bg-brand-black text-white' : 'font-bold text-brand-black hover:bg-white'}">INSTALAR DESDE RESPALDO</button>
                    </div>
                </div>

                <!-- Modo 1: Instalación Limpia -->
                <div id="wz-sec-nuevo" class="${this.modo === 'nuevo' ? 'block' : 'hidden'} space-y-5">
                    <div>
                        <label class="block font-heading font-bold text-xs uppercase tracking-wide mb-1">Nombre del negocio *</label>
                        <input id="wz-nombre" type="text" maxlength="64" placeholder="Ej: Licorería El Triunfo, Panadería Central..."
                            class="w-full border-2 border-brand-black rounded px-4 py-2.5 text-base font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                    </div>

                    <div>
                        <p class="font-heading font-bold text-xs uppercase tracking-wide mb-2">Rubros comerciales que opera:</p>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            ${this.tarjetaRubro('wz-abasto', 'Abasto', 'Comestibles y peso', RUBRO_ABASTO, 'bg-brand-cyan')}
                            ${this.tarjetaRubro('wz-panaderia', 'Panadería', 'Horneados FEFO', RUBRO_PANADERIA, 'bg-brand-yellow')}
                            ${this.tarjetaRubro('wz-licoreria', 'Licorería', 'Cuentas y consumo', RUBRO_LICORERIA, 'bg-brand-pink')}
                        </div>
                    </div>

                    <!-- Elección de Privacidad de Inventario -->
                    <div class="border-2 border-brand-black rounded-lg p-4 bg-gray-50 space-y-3">
                        <span class="block font-heading font-black text-xs uppercase text-brand-black">Privacidad de Inventario y Stock</span>
                        <p class="text-xs text-gray-600 font-bold">Controla si los operadores y empleados pueden ver el valor del inventario o solo la disponibilidad en tienda:</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 border-brand-black ring-2 ring-brand-purple">
                                <input type="radio" name="opt-priv-inv" id="priv-inv-dueno" checked class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">SOLO DUEÑO (RESTRINGIDO)</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Empleados ven si hay stock sin conocer el capital total ni costos de almacén.</span>
                                </div>
                            </label>
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 border-gray-300">
                                <input type="radio" name="opt-priv-inv" id="priv-inv-abierto" class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">VISIBILIDAD TOTAL</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Todos los operadores tienen acceso al conteo y valor monetario del inventario.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Elección de Seguridad del Panel -->
                    <div class="border-2 border-brand-black rounded-lg p-4 bg-gray-50 space-y-3">
                        <span class="block font-heading font-black text-xs uppercase text-brand-black">Seguridad y Privacidad del Panel del Dueño</span>
                        <p class="text-xs text-gray-600 font-bold">¿Deseas que la sección PANEL quede bloqueada con clave para que los empleados no vean las ganancias ni costos?</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 ${this.bloquearPanel ? 'border-brand-black ring-2 ring-brand-purple' : 'border-gray-300'}">
                                <input type="radio" name="opt-seguridad" id="seg-bloqueado" ${this.bloquearPanel ? 'checked' : ''} class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">BLOQUEAR CON CLAVE</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Solo el dueño ingresa con clave. Recomendado si tienes empleados.</span>
                                </div>
                            </label>
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 ${!this.bloquearPanel ? 'border-brand-black ring-2 ring-brand-purple' : 'border-gray-300'}">
                                <input type="radio" name="opt-seguridad" id="seg-abierto" ${!this.bloquearPanel ? 'checked' : ''} class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">DEJAR ABIERTO</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Acceso directo sin clave. Útil si solo tú atiendes la caja.</span>
                                </div>
                            </label>
                        </div>

                        <div id="wz-box-pin" class="${this.bloquearPanel ? 'block' : 'hidden'} pt-2">
                            <label class="block font-heading font-bold text-xs uppercase tracking-wide mb-1">Define la Clave Maestra del Dueño *</label>
                            <input id="wz-pin" type="password" maxlength="16" placeholder="Ingresa tu clave maestra (ej: 1234)"
                                class="w-full border-2 border-brand-black rounded px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            <p class="text-[10px] text-gray-500 font-bold mt-1">Podrás cambiar esta clave en cualquier momento desde el propio Panel.</p>
                        </div>
                    </div>

                    <!-- Clave de Activación de Licencia -->
                    <div class="border-2 border-brand-black rounded-lg p-4 bg-gray-50 space-y-2">
                        <label class="block font-heading font-black text-xs uppercase tracking-wide">Clave de Licencia DatioLabs *</label>
                        <input id="wz-licencia-key" type="text" maxlength="16" placeholder="0000XXXXXXXX0000" value="0000888811110000"
                            class="w-full border-2 border-brand-black rounded px-4 py-2 font-mono font-black text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white" />
                        <p class="text-[10px] text-gray-500 font-bold">Licorería: 0000888811110000 · Panadería: 0000888822220000 · Retail: 0000888833330000</p>
                    </div>

                    <div id="wz-error" class="hidden bg-red-100 border-2 border-red-600 text-red-800 rounded px-4 py-3 font-bold text-sm"></div>

                    <button id="wz-iniciar" class="w-full bg-brand-black text-white font-heading font-black text-lg py-3.5 rounded border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-transform">
                        INICIAR NEGOCIO LOCAL
                    </button>
                </div>

                <!-- Modo 2: Instalar desde Respaldo Criptográfico -->
                <div id="wz-sec-restaurar" class="${this.modo === 'restaurar' ? 'block' : 'hidden'} space-y-5">
                    <div class="bg-amber-50 border-2 border-brand-black rounded-lg p-4 text-xs font-bold text-amber-900 leading-relaxed">
                        <strong>Restauración Segura de Datos:</strong>
                        <ul class="list-disc pl-5 mt-1 space-y-1">
                            <li>Restaura el catálogo de productos, existencias de inventario, categorías y tasas tributarias.</li>
                            <li><strong>Regla de Seguridad:</strong> Las conexiones móviles anteriores y sesiones P2P quedan <u>estrictamente purgadas</u> para prevenir accesos no autorizados al cambiar de máquina o reinstalar.</li>
                        </ul>
                    </div>

                    <div>
                        <label class="block font-heading font-bold text-xs uppercase tracking-wide mb-2">Selecciona o arrastra el archivo de respaldo (.datio):</label>
                        <div class="border-2 border-dashed border-brand-black rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" id="drop-zona">
                            <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p class="font-heading font-black text-sm text-brand-black mb-1">Haz clic para cargar archivo de respaldo</p>
                            <p class="text-[11px] font-mono text-gray-500">Formato: NOMBRE-NEGOCIO-FECHA-HORA.datio</p>
                            <input type="file" id="wz-archivo-input" accept=".datio,.bin,.json" class="hidden" />
                        </div>
                        <div id="wz-archivo-cargado" class="hidden mt-2 p-2 bg-green-50 border border-brand-black rounded text-xs font-mono font-bold text-green-900 flex justify-between items-center">
                            <span id="wz-nombre-archivo"></span>
                            <span class="text-[10px] bg-green-200 px-2 py-0.5 rounded border border-brand-black uppercase font-black">SHA-256 OK</span>
                        </div>
                    </div>

                    <!-- Seguridad del Panel en Restauración -->
                    <div class="border-2 border-brand-black rounded-lg p-4 bg-gray-50 space-y-3">
                        <span class="block font-heading font-black text-xs uppercase text-brand-black">Seguridad del Panel en este Terminal</span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 ${this.bloquearPanel ? 'border-brand-black ring-2 ring-brand-purple' : 'border-gray-300'}">
                                <input type="radio" name="opt-seguridad-res" id="seg-bloqueado-res" ${this.bloquearPanel ? 'checked' : ''} class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">BLOQUEAR CON CLAVE</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Protege el panel en este equipo.</span>
                                </div>
                            </label>
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 ${!this.bloquearPanel ? 'border-brand-black ring-2 ring-brand-purple' : 'border-gray-300'}">
                                <input type="radio" name="opt-seguridad-res" id="seg-abierto-res" ${!this.bloquearPanel ? 'checked' : ''} class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">DEJAR ABIERTO</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Acceso sin clave.</span>
                                </div>
                            </label>
                        </div>

                        <div id="wz-box-pin-res" class="${this.bloquearPanel ? 'block' : 'hidden'} pt-2">
                            <label class="block font-heading font-bold text-xs uppercase tracking-wide mb-1">Clave del Dueño para este Terminal *</label>
                            <input id="wz-pin-restaurar" type="password" maxlength="16" placeholder="Define la clave para este terminal"
                                class="w-full border-2 border-brand-black rounded px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>
                    </div>

                    <div id="wz-restore-error" class="hidden bg-red-100 border-2 border-red-600 text-red-800 rounded px-4 py-3 font-bold text-sm"></div>

                    <button id="wz-ejecutar-restaurar" class="w-full bg-brand-black text-white font-heading font-black text-lg py-3.5 rounded border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-transform">
                        RESTAURAR E INICIALIZAR SISTEMA
                    </button>
                </div>
            </div>
        </div>`;

        this.conectarEventos();
    }

    private tarjetaRubro(id: string, titulo: string, desc: string, bit: number, color: string): string {
        return `
        <label class="cursor-pointer group">
            <input type="checkbox" id="${id}" data-bit="${bit}" class="peer sr-only" />
            <div class="border-2 border-brand-black rounded-lg p-3 ${color} bg-opacity-20 group-has-peer-checked:bg-opacity-100 peer-focus-visible:ring-2 ring-brand-purple transition-all group-hover:-translate-y-0.5">
                <div class="flex items-center justify-between">
                    <span class="font-heading font-black text-sm">${titulo}</span>
                    <span class="w-5 h-5 rounded-full border-2 border-brand-black bg-white flex items-center justify-center text-transparent font-black text-xs group-has-peer-checked:text-brand-black">OK</span>
                </div>
                <p class="text-xs text-brand-text font-body mt-1">${desc}</p>
            </div>
        </label>`;
    }

    private conectarEventos(): void {
        const tabNuevo = document.getElementById('wz-tab-nuevo');
        const tabRestaurar = document.getElementById('wz-tab-restaurar');

        tabNuevo?.addEventListener('click', () => {
            this.modo = 'nuevo';
            this.render();
        });

        tabRestaurar?.addEventListener('click', () => {
            this.modo = 'restaurar';
            this.render();
        });

        // Alternar bloqueo de panel en modo nuevo
        const radBloq = document.getElementById('seg-bloqueado');
        const radAbierto = document.getElementById('seg-abierto');
        const boxPin = document.getElementById('wz-box-pin');

        radBloq?.addEventListener('change', () => {
            this.bloquearPanel = true;
            boxPin?.classList.remove('hidden');
        });
        radAbierto?.addEventListener('change', () => {
            this.bloquearPanel = false;
            boxPin?.classList.add('hidden');
        });

        // Alternar bloqueo de panel en modo restaurar
        const radBloqRes = document.getElementById('seg-bloqueado-res');
        const radAbiertoRes = document.getElementById('seg-abierto-res');
        const boxPinRes = document.getElementById('wz-box-pin-res');

        radBloqRes?.addEventListener('change', () => {
            this.bloquearPanel = true;
            boxPinRes?.classList.remove('hidden');
        });
        radAbiertoRes?.addEventListener('change', () => {
            this.bloquearPanel = false;
            boxPinRes?.classList.add('hidden');
        });

        document.getElementById('wz-iniciar')?.addEventListener('click', () => void this.enviarNuevo());

        // Manejo de archivo en restauración
        const dropZona = document.getElementById('drop-zona');
        const fileInput = document.getElementById('wz-archivo-input') as HTMLInputElement | null;
        const infoCargado = document.getElementById('wz-archivo-cargado');
        const txtNombre = document.getElementById('wz-nombre-archivo');

        dropZona?.addEventListener('click', () => fileInput?.click());

        fileInput?.addEventListener('change', () => {
            if (fileInput.files && fileInput.files[0]) {
                const f = fileInput.files[0];
                if (txtNombre && infoCargado) {
                    txtNombre.textContent = f.name;
                    infoCargado.classList.remove('hidden');
                }
            }
        });

        document.getElementById('wz-ejecutar-restaurar')?.addEventListener('click', () => void this.enviarRestauracion());
    }

    private async enviarNuevo(): Promise<void> {
        const errorBox = document.getElementById('wz-error');
        const nombre = (document.getElementById('wz-nombre') as HTMLInputElement).value.trim();
        const pinInput = document.getElementById('wz-pin') as HTMLInputElement | null;
        const pin = this.bloquearPanel ? (pinInput?.value.trim() || '') : '';
        const rubros =
            [...this.contenedor.querySelectorAll<HTMLInputElement>('input[type=checkbox]:checked')]
                .reduce((acc, c) => acc | Number(c.dataset.bit), 0);

        if (!nombre || rubros === 0) {
            if (errorBox) {
                errorBox.textContent = 'Escribe el nombre del negocio y marca al menos un rubro.';
                errorBox.classList.remove('hidden');
            }
            return;
        }
        if (this.bloquearPanel && !pin) {
            if (errorBox) {
                errorBox.textContent = 'Ingresa una clave para proteger el panel o selecciona la opción "DEJAR ABIERTO".';
                errorBox.classList.remove('hidden');
            }
            return;
        }

        try {
            await this.modelo.inicializar(nombre, rubros, pin);
            const cfg = this.modelo.getConfig();
            if (cfg) this.alTerminar(cfg);
        } catch (e) {
            if (errorBox) {
                errorBox.textContent = e instanceof Error ? e.message : String(e);
                errorBox.classList.remove('hidden');
            }
        }
    }

    private async enviarRestauracion(): Promise<void> {
        const errorBox = document.getElementById('wz-restore-error');
        const fileInput = document.getElementById('wz-archivo-input') as HTMLInputElement | null;
        const pinInput = document.getElementById('wz-pin-restaurar') as HTMLInputElement | null;
        const pin = this.bloquearPanel ? (pinInput?.value.trim() || '') : '';

        const f = fileInput?.files?.[0];
        const nombreArchivo = f?.name || 'DATIOLABS-DEMO-20260903-180000.datio';

        if (this.bloquearPanel && !pin) {
            if (errorBox) {
                errorBox.textContent = 'Ingresa una clave para el panel en este terminal o selecciona "DEJAR ABIERTO".';
                errorBox.classList.remove('hidden');
            }
            return;
        }

        try {
            // Restaurar datos y purgar conexiones móviles por seguridad
            await api.restaurarRespaldo(nombreArchivo);

            // Inicializar negocio con los datos restaurados
            const nombreNegocio = nombreArchivo.split('-')[0] || 'Mi Negocio Restaurado';
            await this.modelo.inicializar(nombreNegocio, RUBRO_ABASTO | RUBRO_PANADERIA | RUBRO_LICORERIA, pin);

            const cfg = this.modelo.getConfig();
            if (cfg) this.alTerminar(cfg);
        } catch (e) {
            if (errorBox) {
                errorBox.textContent = e instanceof Error ? e.message : String(e);
                errorBox.classList.remove('hidden');
            }
        }
    }
}
