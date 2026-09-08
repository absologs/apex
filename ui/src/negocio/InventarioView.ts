import { api, Categoria, ProductoInfo, TasaImpuesto } from './api';
import { NegocioModel } from './NegocioModel';

const sanitizarInputDecimal = (
    inputEl: HTMLInputElement,
    maxValor: number,
    maxLongitud: number,
    onInputCallback?: () => void,
): void => {
    inputEl.maxLength = maxLongitud;
    inputEl.addEventListener('input', () => {
        let val = inputEl.value.replace(/[^0-9.,]/g, '');
        const partes = val.split(/[.,]/);
        if (partes.length > 2) {
            val = partes[0] + '.' + partes.slice(1).join('');
        } else if (partes.length === 2) {
            val = partes[0] + '.' + partes[1].slice(0, 2);
        }
        if (val.length > maxLongitud) {
            val = val.slice(0, maxLongitud);
        }
        const num = parseFloat(val.replace(',', '.'));
        if (Number.isFinite(num) && num > maxValor) {
            val = String(maxValor);
        }
        if (inputEl.value !== val) {
            inputEl.value = val;
        }
        if (onInputCallback) onInputCallback();
    });
};

const sanitizarInputEntero = (
    inputEl: HTMLInputElement,
    minValor: number,
    maxValor: number,
    maxLongitud: number,
    onInputCallback?: () => void,
): void => {
    inputEl.maxLength = maxLongitud;
    inputEl.addEventListener('input', () => {
        let val = inputEl.value.replace(/[^0-9]/g, '');
        if (val.length > maxLongitud) {
            val = val.slice(0, maxLongitud);
        }
        const num = parseInt(val, 10);
        if (Number.isFinite(num) && num > maxValor) {
            val = String(maxValor);
        }
        if (inputEl.value !== val) {
            inputEl.value = val;
        }
        if (onInputCallback) onInputCallback();
    });
    inputEl.addEventListener('blur', () => {
        const num = parseInt(inputEl.value, 10);
        if (Number.isFinite(num) && num < minValor) {
            inputEl.value = String(minValor);
            if (onInputCallback) onInputCallback();
        }
    });
};

const sanitizarInputTexto = (
    inputEl: HTMLInputElement,
    maxLongitud: number,
    permitirEspeciales: boolean = false,
): void => {
    inputEl.maxLength = maxLongitud;
    inputEl.addEventListener('input', () => {
        let val = permitirEspeciales
            ? inputEl.value.replace(/[<>{}\\]/g, '')
            : inputEl.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,/_#-]/g, '');
        if (val.length > maxLongitud) {
            val = val.slice(0, maxLongitud);
        }
        if (inputEl.value !== val) {
            inputEl.value = val;
        }
    });
};

export class InventarioView {
    private contenedor: HTMLElement;
    private modelo: NegocioModel;
    private categorias: Categoria[] = [];
    private tasasImpuestos: TasaImpuesto[] = [];
    private productos: ProductoInfo[] = [];
    private busquedaRepo: string = '';
    private busquedaCatalogo: string = '';
    private filtroCategoriaRepo: string = 'todas';
    private filtroCategoriaCatalogo: string = 'todas';
    private tabActiva: 'alta' | 'stock' | 'ajustes' = 'alta';
    private semaforoStock: { rojoMax: number; amarilloMax: number } = { rojoMax: 5, amarilloMax: 15 };
    private readonly POR_PAGINA_CAT = 40;
    private readonly POR_PAGINA_REPO = 24;
    private paginaCat: number = 1;
    private paginaRepo: number = 1;

    constructor(contenedor: HTMLElement, modelo: NegocioModel) {
        this.contenedor = contenedor;
        this.modelo = modelo;
        void this.modelo;
    }

    private getUnitLabel(p: ProductoInfo): string {
        if (p.unidad === 'kg') return 'kg';
        if (p.unidad === 'ml') return 'ml';
        if (p.unidad === 'un') return 'un.';
        return (p.capacidades & 2) ? 'kg' : 'un.';
    }

    private getNombreCategoria(categoriaId?: string): string {
        if (!categoriaId) return 'General';
        const cat = this.categorias.find((c) => c.id === categoriaId);
        return cat ? cat.nombre : 'General';
    }

    private getConteoCategorias(): Record<string, number> {
        const conteo: Record<string, number> = { todas: this.productos.length };
        this.categorias.forEach((c) => {
            conteo[c.id] = 0;
        });
        if (conteo['cat-general'] === undefined) {
            conteo['cat-general'] = 0;
        }
        this.productos.forEach((p) => {
            const cid = p.categoriaId || 'cat-general';
            conteo[cid] = (conteo[cid] || 0) + 1;
        });
        return conteo;
    }

    async render(tab?: 'alta' | 'stock' | 'ajustes'): Promise<void> {
        if (tab) this.tabActiva = tab;

        const [categorias, tasas, productos, semaforo] = await Promise.all([
            api.categorias(),
            api.tasasImpuestos(),
            api.productos(),
            api.obtenerSemaforoStock(),
        ]);
        this.categorias = categorias;
        this.tasasImpuestos = tasas;
        this.productos = productos;
        this.semaforoStock = semaforo;

        const conteo = this.getConteoCategorias();

        const placeholderProducto = 'Ej: Artículo Comercial 1L, Presentación 500g, Pack Estándar...';

        this.contenedor.innerHTML = `
        <div class="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black font-heading">Control de Inventario</h2>
                <p class="text-brand-text font-body text-xs sm:text-sm">Alta de productos, reposición de mercancía, categorías y tasas tributarias</p>
            </div>
            <div class="flex items-center gap-1 overflow-x-auto max-w-full pb-1" id="inv-tabs-container">
                <div class="inline-flex border-2 border-brand-black rounded bg-white shadow-brutal-sm p-0.5" id="inv-tabs">
                    <button id="tab-alta" class="w-36 sm:w-48 h-9 flex items-center justify-center font-heading text-xs rounded transition-colors shrink-0 ${this.tabActiva === 'alta' ? 'font-black bg-brand-black text-white' : 'font-bold text-brand-black hover:bg-gray-100'}">AÑADIR PRODUCTO</button>
                    <button id="tab-stock" class="w-36 sm:w-48 h-9 flex items-center justify-center font-heading text-xs rounded transition-colors shrink-0 ${this.tabActiva === 'stock' ? 'font-black bg-brand-black text-white' : 'font-bold text-brand-black hover:bg-gray-100'}">AÑADIR / AJUSTAR STOCK</button>
                    <button id="tab-ajustes" class="w-36 sm:w-48 h-9 flex items-center justify-center font-heading text-xs rounded transition-colors shrink-0 ${this.tabActiva === 'ajustes' ? 'font-black bg-brand-black text-white' : 'font-bold text-brand-black hover:bg-gray-100'}">CATEGORÍAS E IMPUESTOS</button>
                </div>
            </div>
        </div>

        <div id="inv-seccion-alta" class="${this.tabActiva === 'alta' ? 'block' : 'hidden'}">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <form id="form-nuevo-producto" novalidate class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 lg:col-span-2 space-y-4">
                    <h3 class="font-heading font-black text-xl border-b-2 border-brand-black pb-2">Registrar Nuevo Producto o Servicio</h3>
                    
                    <div>
                        <label class="block text-xs font-bold uppercase mb-1">Nombre Comercial del Producto o Servicio *</label>
                        <input id="prod-nombre" maxlength="64" placeholder="${placeholderProducto}" class="w-full border-2 border-brand-black rounded px-4 py-2.5 font-bold focus:ring-2 focus:ring-brand-cyan" required />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Categoría</label>
                            <select id="prod-categoria" class="w-full border-2 border-brand-black rounded px-3 py-2.5 bg-white font-bold">
                                ${this.categorias.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Tasa de Impuesto</label>
                            <select id="prod-impuesto" class="w-full border-2 border-brand-black rounded px-3 py-2.5 bg-white font-bold">
                                ${this.tasasImpuestos.map((t) => `<option value="${t.porcentaje}">${t.nombre}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 border-2 border-brand-black rounded p-4">
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1 text-gray-700">Precio Bruto (Costo $)</label>
                            <input id="prod-precio-bruto" type="text" inputmode="decimal" maxlength="8" placeholder="0.00" class="w-full border-2 border-brand-black rounded px-3 py-2 font-bold bg-white" />
                            <span class="text-[10px] text-gray-500">Costo de reposición (opcional)</span>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1 text-gray-700">Margen de Ganancia (%)</label>
                            <input id="prod-margen" type="text" inputmode="decimal" maxlength="5" value="30" class="w-full border-2 border-brand-black rounded px-3 py-2 font-bold bg-white" />
                            <span class="text-[10px] text-gray-500">Utilidad deseada (%)</span>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1 text-brand-purple">Precio Neto Final ($) *</label>
                            <input id="prod-precio-neto" type="text" inputmode="decimal" maxlength="8" placeholder="0.00" class="w-full border-2 border-brand-black rounded px-3 py-2 font-black text-brand-purple bg-white" required />
                            <span class="text-[10px] text-gray-500">PVP con impuesto incluido</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div id="box-stock-inicial">
                            <label class="block text-xs font-bold uppercase mb-1">Stock Inicial (en unidades base)</label>
                            <input id="prod-stock" type="text" inputmode="decimal" maxlength="7" value="10" class="w-full border-2 border-brand-black rounded px-3 py-2 font-bold bg-white" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Tipo de Medida / Venta</label>
                            <select id="prod-unidad" class="w-full border-2 border-brand-black rounded px-3 py-2 font-black bg-white">
                                <option value="un">Unidad / Pieza (un.)</option>
                                <option value="kg">Por Peso (Kilogramos - kg)</option>
                                <option value="ml">Por Volumen (Mililitros - ml)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Configuración de Empaque / Caja y Despiece -->
                    <div class="bg-gray-50 border-2 border-brand-black rounded p-3 space-y-2">
                        <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input id="prod-es-caja" type="checkbox" class="w-4 h-4 border-2 border-brand-black rounded text-brand-black focus:ring-0" />
                            <span class="font-bold text-xs sm:text-sm">¿Viene en empaque / caja con unidades sueltas?</span>
                        </label>
                        <div id="box-caja-config" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-gray-700 mb-0.5">Unidades por Empaque / Caja *</label>
                                <input id="prod-unidades-caja" type="number" min="2" max="1000" step="1" value="12" placeholder="Ej: 12" class="w-full border-2 border-brand-black rounded px-3 py-1.5 font-bold bg-white text-sm" />
                                <span class="text-[10px] text-gray-500">Cantidad de unidades contenidas en cada empaque</span>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-gray-700 mb-0.5">Ingresar Stock Inicial en Cajas</label>
                                <input id="prod-stock-cajas" type="number" min="0" max="9999" step="1" placeholder="Ej: 5 cajas" class="w-full border-2 border-brand-black rounded px-3 py-1.5 font-bold bg-white text-sm" />
                                <span class="text-[10px] text-gray-500">Convierte automáticamente a unidades base</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input id="prod-sin-stock" type="checkbox" class="w-5 h-5 border-2 border-brand-black rounded text-brand-black focus:ring-0" />
                            <span class="font-bold text-xs sm:text-sm">Venta "Sin Stock" (Servicios / Detal libre sin inventario rígido)</span>
                        </label>
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="w-full bg-brand-black text-white font-heading font-black py-4 rounded border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-all text-lg">
                            GUARDAR PRODUCTO O SERVICIO
                        </button>
                        <p id="alta-prod-msg" class="hidden font-bold text-sm mt-3 text-center"></p>
                    </div>
                </form>

                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 flex flex-col min-h-[300px] max-h-[480px] lg:max-h-[650px]">
                    <div class="flex justify-between items-center border-b-2 border-brand-black pb-2 mb-2">
                        <h3 class="font-heading font-black text-base sm:text-lg">Catálogo Registrado</h3>
                        <span class="text-xs font-black bg-gray-100 border border-brand-black px-2 py-0.5 rounded">${this.productos.length} artículos</span>
                    </div>
                    <div class="space-y-2 mb-3">
                        <select id="cat-filtro-lateral" class="w-full border-2 border-brand-black rounded px-2.5 py-1.5 text-xs font-bold bg-white focus:ring-2 focus:ring-brand-cyan">
                            <option value="todas">Todas las categorías (${this.productos.length} prods)</option>
                            ${this.categorias.map((c) => `<option value="${c.id}" ${this.filtroCategoriaCatalogo === c.id ? 'selected' : ''}>${c.nombre} (${conteo[c.id] || 0} prods)</option>`).join('')}
                        </select>
                        <input id="cat-buscar-filtro" type="text" maxlength="40" placeholder="Filtrar por nombre o SKU..." value="${this.busquedaCatalogo}" class="w-full border-2 border-brand-black rounded px-3 py-2 text-xs font-bold" />
                    </div>
                    <div id="cat-lista-items" class="flex-1 overflow-y-auto space-y-2 pr-1"></div>
                </div>
            </div>
        </div>

        <div id="inv-seccion-stock" class="${this.tabActiva === 'stock' ? 'block' : 'hidden'} space-y-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6">
                <div class="flex flex-wrap justify-between items-center mb-3 gap-2">
                    <div>
                        <h3 class="font-heading font-black text-xl">Reposición Dinámica de Stock</h3>
                        <p class="text-xs sm:text-sm text-gray-600">Explora por categoría o busca por nombre para dar entrada o salida a existencias.</p>
                    </div>
                    <span id="repo-contador-estado" class="text-xs font-bold text-gray-700 bg-gray-100 border-2 border-brand-black px-2.5 py-1 rounded">
                        ${this.productos.length} artículos en depósito
                    </span>
                </div>

                <!-- Chips de Filtrado por Categoría con Conteo Exacto -->
                <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 max-w-full" id="repo-chips-categorias">
                    <button data-cat-chip="todas" class="px-3 py-1 rounded text-xs font-heading font-black border-2 border-brand-black shrink-0 transition-colors ${this.filtroCategoriaRepo === 'todas' ? 'bg-brand-black text-white' : 'bg-gray-100 text-brand-black hover:bg-gray-200'}">
                        TODAS (${this.productos.length})
                    </button>
                    ${this.categorias.map((c) => {
                        const num = conteo[c.id] || 0;
                        const activo = this.filtroCategoriaRepo === c.id;
                        return `
                        <button data-cat-chip="${c.id}" class="px-3 py-1 rounded text-xs font-heading font-black border-2 border-brand-black shrink-0 transition-colors ${activo ? 'bg-brand-black text-white' : 'bg-gray-100 text-brand-black hover:bg-gray-200'}">
                            ${c.nombre} (${num})
                        </button>`;
                    }).join('')}
                </div>

                <input id="repo-buscar" type="text" maxlength="40" placeholder="Escribe el nombre del producto para buscar..." value="${this.busquedaRepo}" class="w-full border-2 border-brand-black rounded px-4 py-2.5 text-base font-bold mb-4 focus:ring-2 focus:ring-brand-cyan" />

                <div id="repo-lista" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1"></div>
            </div>
        </div>

        <div id="inv-seccion-ajustes" class="${this.tabActiva === 'ajustes' ? 'block' : 'hidden'} grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 space-y-4">
                <div class="border-b-2 border-brand-black pb-2 flex justify-between items-center">
                    <div>
                        <h3 class="font-heading font-black text-xl">Gestión de Categorías</h3>
                        <p class="text-xs text-gray-500 font-bold">Clasificación de catálogo comercial e inventario</p>
                    </div>
                    <span class="text-xs font-black bg-gray-100 border border-brand-black px-2 py-0.5 rounded">${this.categorias.length} categorías</span>
                </div>
                <form id="form-crear-cat" class="flex gap-2">
                    <input id="cat-nombre" maxlength="32" placeholder="Nombre de categoría..." class="flex-1 border-2 border-brand-black rounded px-3 py-2 font-bold" required />
                    <button type="submit" class="bg-brand-black text-white px-4 py-2 rounded font-black font-heading text-sm">AGREGAR</button>
                </form>
                <div class="space-y-2 max-h-[350px] overflow-y-auto">
                    ${this.categorias.map((c) => {
                        const num = conteo[c.id] || 0;
                        return `
                        <div class="flex justify-between items-center border-2 border-brand-black rounded-lg p-3 bg-gray-50">
                            <div>
                                <span class="font-bold text-sm text-brand-black">${c.nombre}</span>
                                <p class="text-[11px] font-bold text-gray-500">${num} ${num === 1 ? 'producto asociado' : 'productos asociados'}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-black px-2 py-0.5 rounded border border-brand-black ${num > 0 ? 'bg-amber-100 text-amber-900' : 'bg-gray-200 text-gray-600'}">
                                    ${num} prods.
                                </span>
                                <button data-del-cat="${c.id}" class="text-xs font-black text-red-600 hover:text-white hover:bg-red-600 border border-red-300 rounded px-2 py-1 transition-colors">Eliminar</button>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 space-y-4">
                <h3 class="font-heading font-black text-xl border-b-2 border-brand-black pb-2">Tasas de Impuestos (IVA)</h3>
                <form id="form-crear-tax" class="grid grid-cols-3 gap-2">
                    <input id="tax-nombre" maxlength="32" placeholder="Nombre (ej: Retención 5%)" class="col-span-2 border-2 border-brand-black rounded px-3 py-2 font-bold text-sm" required />
                    <div class="flex gap-1">
                        <input id="tax-pct" type="number" step="0.5" min="0" max="100" maxlength="4" placeholder="%" class="w-16 border-2 border-brand-black rounded px-2 py-2 font-bold text-sm" required />
                        <button type="submit" class="bg-brand-black text-white px-3 py-2 rounded font-black font-heading text-xs flex-1">+</button>
                    </div>
                </form>
                <div class="space-y-2 max-h-[350px] overflow-y-auto">
                    ${this.tasasImpuestos.map((t) => `
                        <div class="flex justify-between items-center border border-brand-black rounded p-2.5 bg-gray-50">
                            <span class="font-bold text-sm">${t.nombre} (${t.porcentaje}%)</span>
                            ${t.porcentaje === 0 || t.porcentaje === 16 ? '<span class="text-xs text-gray-400 font-bold">Por defecto</span>' : `<button data-del-tax="${t.id}" class="text-xs font-black text-red-600 hover:underline">Eliminar</button>`}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;

        this.conectarEventos();
        this.renderCatalogoLista();
        this.renderRepoLista();
    }

    private conectarEventos(): void {
        const tabAlta = document.getElementById('tab-alta');
        const tabStock = document.getElementById('tab-stock');
        const tabAjustes = document.getElementById('tab-ajustes');
        const secAlta = document.getElementById('inv-seccion-alta');
        const secStock = document.getElementById('inv-seccion-stock');
        const secAjustes = document.getElementById('inv-seccion-ajustes');

        const activarTab = (tabName: 'alta' | 'stock' | 'ajustes', btn: HTMLElement | null, sec: HTMLElement | null) => {
            this.tabActiva = tabName;
            [tabAlta, tabStock, tabAjustes].forEach((t) => {
                if (t) {
                    t.className = 'w-36 sm:w-48 h-9 flex items-center justify-center font-heading font-bold text-xs rounded text-brand-black hover:bg-gray-100 transition-colors shrink-0';
                }
            });
            [secAlta, secStock, secAjustes].forEach((s) => {
                s?.classList.remove('block');
                s?.classList.add('hidden');
            });
            if (btn && sec) {
                btn.className = 'w-36 sm:w-48 h-9 flex items-center justify-center font-heading font-black text-xs rounded bg-brand-black text-white transition-colors shrink-0';
                sec.classList.remove('hidden');
                sec.classList.add('block');
            }
        };

        tabAlta?.addEventListener('click', () => activarTab('alta', tabAlta, secAlta));
        tabStock?.addEventListener('click', () => {
            activarTab('stock', tabStock, secStock);
            this.renderRepoLista();
        });
        tabAjustes?.addEventListener('click', () => activarTab('ajustes', tabAjustes, secAjustes));

        // Cálculo dinámico bidireccional de precio bruto / neto / margen
        const inBruto = document.getElementById('prod-precio-bruto') as HTMLInputElement | null;
        const inMargen = document.getElementById('prod-margen') as HTMLInputElement | null;
        const inImp = document.getElementById('prod-impuesto') as HTMLSelectElement | null;
        const inNeto = document.getElementById('prod-precio-neto') as HTMLInputElement | null;

        const cleanNum = (val: string | null | undefined): number => {
            if (!val) return 0;
            const s = val.trim().replace(',', '.');
            const n = parseFloat(s);
            return Number.isFinite(n) && !isNaN(n) ? n : 0;
        };

        const recalcularNeto = () => {
            if (!inBruto || !inNeto || !inMargen || !inImp) return;
            const bruto = cleanNum(inBruto.value);
            const margen = cleanNum(inMargen.value) / 100;
            const imp = cleanNum(inImp.value) / 100;
            if (bruto > 0) {
                const conGanancia = bruto * (1 + margen);
                const netoFinal = conGanancia * (1 + imp);
                inNeto.value = netoFinal.toFixed(2);
            }
        };

        const recalcularMargenDesdeNeto = () => {
            if (!inBruto || !inNeto || !inMargen || !inImp) return;
            const neto = cleanNum(inNeto.value);
            const bruto = cleanNum(inBruto.value);
            const margen = cleanNum(inMargen.value) / 100;
            const imp = cleanNum(inImp.value) / 100;

            if (neto > 0) {
                const baseSinImp = neto / (1 + imp);
                if (bruto > 0) {
                    const margenResultante = ((baseSinImp - bruto) / bruto) * 100;
                    inMargen.value = Math.max(0, Math.round(margenResultante * 10) / 10).toFixed(1);
                } else if (margen > 0) {
                    // Deducir automáticamente costo bruto si no fue ingresado
                    inBruto.value = (baseSinImp / (1 + margen)).toFixed(2);
                }
            }
        };

        const inStockEl = document.getElementById('prod-stock') as HTMLInputElement | null;
        const inNombre = document.getElementById('prod-nombre') as HTMLInputElement | null;
        const inUnidadEl = document.getElementById('prod-unidad') as HTMLSelectElement | null;
        const inCatNombre = document.getElementById('cat-nombre') as HTMLInputElement | null;
        const inTaxNombre = document.getElementById('tax-nombre') as HTMLInputElement | null;
        const inTaxPct = document.getElementById('tax-pct') as HTMLInputElement | null;
        const inBuscarCat = document.getElementById('cat-buscar-filtro') as HTMLInputElement | null;
        const inBuscarRepo = document.getElementById('repo-buscar') as HTMLInputElement | null;
        const msgEl = document.getElementById('alta-prod-msg');

        if (inNombre) sanitizarInputTexto(inNombre, 64);
        if (inBruto) sanitizarInputDecimal(inBruto, 99999.99, 8, recalcularNeto);
        if (inMargen) sanitizarInputDecimal(inMargen, 999, 5, recalcularNeto);
        if (inNeto) sanitizarInputDecimal(inNeto, 99999.99, 8, recalcularMargenDesdeNeto);
        if (inStockEl) sanitizarInputDecimal(inStockEl, 99999, 7);
        if (inCatNombre) sanitizarInputTexto(inCatNombre, 32);
        if (inTaxNombre) sanitizarInputTexto(inTaxNombre, 32);
        if (inTaxPct) sanitizarInputDecimal(inTaxPct, 100, 5);
        if (inBuscarCat) sanitizarInputTexto(inBuscarCat, 40);
        if (inBuscarRepo) sanitizarInputTexto(inBuscarRepo, 40);
        inImp?.addEventListener('change', recalcularNeto);

        // Limpieza de mensajes de error al corregir
        const limpiarError = () => {
            if (msgEl && !msgEl.classList.contains('hidden') && msgEl.style.color !== '#00823B') {
                msgEl.classList.add('hidden');
                msgEl.textContent = '';
            }
        };
        inNombre?.addEventListener('input', limpiarError);
        inNeto?.addEventListener('input', limpiarError);
        inStockEl?.addEventListener('input', limpiarError);
        inUnidadEl?.addEventListener('change', limpiarError);

        // Sin stock checkbox
        const chkSinStock = document.getElementById('prod-sin-stock') as HTMLInputElement | null;
        const boxStock = document.getElementById('box-stock-inicial');
        chkSinStock?.addEventListener('change', () => {
            limpiarError();
            if (boxStock) {
                boxStock.style.opacity = chkSinStock.checked ? '0.3' : '1';
                (boxStock.querySelector('input') as HTMLInputElement).disabled = chkSinStock.checked;
            }
        });

        // Empaque / Caja checkbox y conversión automática
        const chkEsCaja = document.getElementById('prod-es-caja') as HTMLInputElement | null;
        const boxCajaConfig = document.getElementById('box-caja-config');
        const inUnidadesCaja = document.getElementById('prod-unidades-caja') as HTMLInputElement | null;
        const inStockCajas = document.getElementById('prod-stock-cajas') as HTMLInputElement | null;

        chkEsCaja?.addEventListener('change', () => {
            limpiarError();
            if (boxCajaConfig) {
                if (chkEsCaja.checked) {
                    boxCajaConfig.classList.remove('hidden');
                } else {
                    boxCajaConfig.classList.add('hidden');
                }
            }
        });

        const recalcularStockDesdeCajas = () => {
            if (chkEsCaja?.checked && inStockCajas && inUnidadesCaja && inStockEl) {
                const cajas = parseInt(inStockCajas.value, 10);
                const unPorCaja = parseInt(inUnidadesCaja.value, 10);
                if (Number.isFinite(cajas) && cajas >= 0 && Number.isFinite(unPorCaja) && unPorCaja > 1) {
                    inStockEl.value = String(cajas * unPorCaja);
                }
            }
        };

        if (inUnidadesCaja) sanitizarInputEntero(inUnidadesCaja, 2, 1000, 4, recalcularStockDesdeCajas);
        if (inStockCajas) sanitizarInputEntero(inStockCajas, 0, 9999, 4, recalcularStockDesdeCajas);

        inStockCajas?.addEventListener('input', recalcularStockDesdeCajas);
        inUnidadesCaja?.addEventListener('input', recalcularStockDesdeCajas);

        // Form alta producto
        document.getElementById('form-nuevo-producto')?.addEventListener('submit', (e) => {
            e.preventDefault();
            void this.guardarProducto();
        });

        // Buscador catálogo lateral
        document.getElementById('cat-buscar-filtro')?.addEventListener('input', (e) => {
            this.busquedaCatalogo = (e.target as HTMLInputElement).value.trim().toLowerCase();
            this.paginaCat = 1;
            this.renderCatalogoLista();
        });

        // Filtro por categoría en panel lateral de catálogo
        document.getElementById('cat-filtro-lateral')?.addEventListener('change', (e) => {
            this.filtroCategoriaCatalogo = (e.target as HTMLSelectElement).value;
            this.paginaCat = 1;
            this.renderCatalogoLista();
        });

        // Buscador de reposición
        document.getElementById('repo-buscar')?.addEventListener('input', (e) => {
            this.busquedaRepo = (e.target as HTMLInputElement).value.trim().toLowerCase();
            this.paginaRepo = 1;
            this.renderRepoLista();
        });


        // Chips de categoría en reposición
        this.contenedor.querySelectorAll('[data-cat-chip]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const catId = (btn as HTMLElement).dataset.catChip || 'todas';
                this.filtroCategoriaRepo = catId;
                this.paginaRepo = 1;
                // Actualizar estilo visual de los chips
                this.contenedor.querySelectorAll('[data-cat-chip]').forEach((b) => {
                    const c = (b as HTMLElement).dataset.catChip || 'todas';
                    if (c === catId) {
                        b.className = 'px-3 py-1 rounded text-xs font-heading font-black border-2 border-brand-black shrink-0 transition-colors bg-brand-black text-white';
                    } else {
                        b.className = 'px-3 py-1 rounded text-xs font-heading font-black border-2 border-brand-black shrink-0 transition-colors bg-gray-100 text-brand-black hover:bg-gray-200';
                    }
                });
                this.renderRepoLista();
            });
        });

        // Categorías
        document.getElementById('form-crear-cat')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('cat-nombre') as HTMLInputElement | null;
            if (input?.value.trim()) {
                void api.crearCategoria(input.value.trim()).then(() => void this.render('ajustes'));
            }
        });

        this.contenedor.querySelectorAll('[data-del-cat]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = (btn as HTMLElement).dataset.delCat;
                if (id) void api.eliminarCategoria(id).then(() => void this.render('ajustes'));
            });
        });

        // Impuestos
        document.getElementById('form-crear-tax')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const inNom = document.getElementById('tax-nombre') as HTMLInputElement | null;
            const inPct = document.getElementById('tax-pct') as HTMLInputElement | null;
            if (inNom?.value.trim() && inPct) {
                void api.crearTasaImpuesto(inNom.value.trim(), Number(inPct.value)).then(() => void this.render('ajustes'));
            }
        });

        this.contenedor.querySelectorAll('[data-del-tax]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = (btn as HTMLElement).dataset.delTax;
                if (id) void api.eliminarTasaImpuesto(id).then(() => void this.render('ajustes'));
            });
        });
    }

    private renderCatalogoLista(): void {
        const box = document.getElementById('cat-lista-items');
        if (!box) return;

        const filtrados = this.productos.filter((p) => {
            const coincideTexto = !this.busquedaCatalogo
                || p.nombre.toLowerCase().includes(this.busquedaCatalogo)
                || p.sku.toLowerCase().includes(this.busquedaCatalogo);
            const coincideCat = this.filtroCategoriaCatalogo === 'todas'
                || (p.categoriaId || 'cat-general') === this.filtroCategoriaCatalogo;
            return coincideTexto && coincideCat;
        });

        if (filtrados.length === 0) {
            box.innerHTML = '<p class="py-4 text-center text-gray-400 font-bold text-xs">Sin coincidencias en esta categoría.</p>';
            document.getElementById('paginacion-cat')?.remove();
            return;
        }

        const totalPag = Math.ceil(filtrados.length / this.POR_PAGINA_CAT);
        if (this.paginaCat > totalPag) this.paginaCat = totalPag;
        const inicio = (this.paginaCat - 1) * this.POR_PAGINA_CAT;
        const pagina = filtrados.slice(inicio, inicio + this.POR_PAGINA_CAT);

        box.innerHTML = pagina.map((p) => {
            const st = Number(p.stock);
            const badgeClass = p.sinStock
                ? 'bg-purple-100 text-purple-900'
                : st > 15
                ? 'bg-green-100 text-green-900'
                : st >= 10
                ? 'bg-yellow-100 text-yellow-900'
                : 'bg-red-100 text-red-900';
            const unitLabel = this.getUnitLabel(p);
            const catNombre = this.getNombreCategoria(p.categoriaId);
            return `
            <div class="border border-brand-black rounded p-2 bg-gray-50 flex justify-between items-center text-xs">
                <div class="min-w-0 flex-1 pr-2">
                    <p class="font-bold truncate text-brand-black" title="${p.nombre}">${p.nombre}</p>
                    <p class="text-[10px] text-gray-500 font-bold">
                        <span class="text-brand-purple font-black">${catNombre}</span> · $${Number(p.precioUsd).toFixed(2)} · IVA ${p.impuestoPct}%
                    </p>
                </div>
                <div class="text-right shrink-0">
                    <span class="font-black px-2 py-0.5 rounded border border-brand-black text-[10px] inline-block ${badgeClass}">
                        ${p.sinStock ? 'LIBRE' : (p.esCaja && p.unidadesPorCaja && p.unidadesPorCaja > 1 ? `${Math.floor(st / p.unidadesPorCaja)} cj. + ${st % p.unidadesPorCaja} un. (${st} un.)` : `${st} ${unitLabel}`)}
                    </span>
                </div>
            </div>`;
        }).join('');

        // Controles de paginación
        document.getElementById('paginacion-cat')?.remove();
        if (totalPag > 1) {
            const pagDiv = document.createElement('div');
            pagDiv.id = 'paginacion-cat';
            pagDiv.className = 'flex items-center justify-between mt-2 gap-2 flex-wrap';
            pagDiv.innerHTML = `
                <span class="text-[10px] font-bold text-gray-500">Pag. ${this.paginaCat} de ${totalPag} · ${filtrados.length} productos</span>
                <div class="flex gap-1">
                    <button id="cat-pag-ant" class="border-2 border-brand-black px-2 py-0.5 rounded text-[10px] font-heading font-black shadow-brutal-sm ${this.paginaCat === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-100'}">ANT.</button>
                    <button id="cat-pag-sig" class="border-2 border-brand-black px-2 py-0.5 rounded text-[10px] font-heading font-black shadow-brutal-sm ${this.paginaCat === totalPag ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-100'}">SIG.</button>
                </div>`;
            box.insertAdjacentElement('afterend', pagDiv);
            document.getElementById('cat-pag-ant')?.addEventListener('click', () => {
                if (this.paginaCat > 1) { this.paginaCat--; this.renderCatalogoLista(); }
            });
            document.getElementById('cat-pag-sig')?.addEventListener('click', () => {
                if (this.paginaCat < totalPag) { this.paginaCat++; this.renderCatalogoLista(); }
            });
        }
    }



    private renderRepoLista(): void {
        const box = document.getElementById('repo-lista');
        if (!box) return;

        const filtrados = this.productos.filter((p) => {
            const coincideTexto = !this.busquedaRepo
                || p.nombre.toLowerCase().includes(this.busquedaRepo)
                || p.sku.toLowerCase().includes(this.busquedaRepo);
            const coincideCat = this.filtroCategoriaRepo === 'todas'
                || (p.categoriaId || 'cat-general') === this.filtroCategoriaRepo;
            return coincideTexto && coincideCat;
        });

        const estadoEl = document.getElementById('repo-contador-estado');
        if (estadoEl) {
            const nombreCat = this.filtroCategoriaRepo === 'todas' ? 'en depósito' : `en ${this.getNombreCategoria(this.filtroCategoriaRepo)}`;
            estadoEl.textContent = `${filtrados.length} de ${this.productos.length} artículos ${nombreCat}`;
        }

        if (filtrados.length === 0) {
            box.innerHTML = '<p class="col-span-full py-8 text-center text-gray-500 font-bold">No se encontraron productos en la categoría seleccionada.</p>';
            return;
        }

        const semaforo = this.semaforoStock;
        const totalPag = Math.ceil(filtrados.length / this.POR_PAGINA_REPO);
        if (this.paginaRepo > totalPag) this.paginaRepo = totalPag;
        const inicio = (this.paginaRepo - 1) * this.POR_PAGINA_REPO;
        const pagina = filtrados.slice(inicio, inicio + this.POR_PAGINA_REPO);

        box.innerHTML = pagina.map((p) => {
            const st = Number(p.stock);
            const colorStock = p.sinStock
                ? 'text-purple-700'
                : st <= semaforo.rojoMax
                ? 'text-red-600'
                : st <= semaforo.amarilloMax
                ? 'text-amber-600'
                : 'text-emerald-700';
            const unitLabel = this.getUnitLabel(p);
            const catNombre = this.getNombreCategoria(p.categoriaId);
            const textoStock = p.sinStock
                ? 'Venta libre'
                : p.esCaja && p.unidadesPorCaja && p.unidadesPorCaja > 1
                ? `${Math.floor(st / p.unidadesPorCaja)} cajas y ${st % p.unidadesPorCaja} un. (${st} un.)`
                : `${st} ${unitLabel}`;
            return `
            <div class="border-2 border-brand-black rounded-lg p-3 bg-white shadow-sm flex flex-col justify-between h-[175px] min-h-[175px] max-h-[175px] box-border overflow-hidden">
                <div class="min-w-0">
                    <div class="flex justify-between items-start gap-1">
                        <div class="min-w-0 flex-1">
                            <span class="text-[9px] font-black uppercase tracking-wider text-brand-purple bg-purple-50 border border-purple-200 rounded px-1.5 py-0.2 inline-block mb-0.5 truncate max-w-[150px]">${catNombre}</span>
                            <h4 class="font-heading font-black text-sm truncate" title="${p.nombre}">${p.nombre}</h4>
                        </div>
                        <button data-repo-del="${p.sku}" title="Eliminar producto del catálogo" class="w-5 h-5 rounded border border-brand-black text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center font-black text-xs shrink-0">&times;</button>
                    </div>
                    <p class="text-xs font-bold text-gray-500 mt-0.5">Precio: $${Number(p.precioUsd).toFixed(2)} · Stock: <span class="font-black ${colorStock}">${textoStock}</span></p>
                </div>
                ${p.sinStock ? '<p class="text-[11px] text-purple-700 font-bold mt-auto">Sin control de existencias físicas.</p>' : `
                <div class="flex items-center gap-1 mt-auto pt-2 border-t border-gray-100">
                    <input type="number" step="${unitLabel === 'kg' || unitLabel === 'ml' ? '0.1' : '1'}" min="${unitLabel === 'kg' || unitLabel === 'ml' ? '0.01' : '1'}" max="9999" maxlength="5" placeholder="Cant." data-repo-cant="${p.sku}" class="w-14 h-8 border-2 border-brand-black rounded px-1.5 py-0.5 font-bold text-xs shrink-0" />
                    <button data-repo-in="${p.sku}" title="Sumar stock por reposición de compra" class="h-8 bg-green-200 hover:bg-green-300 border border-brand-black rounded px-1.5 text-[10px] font-black font-heading flex-1 truncate shrink-0">+ ENTRADA</button>
                    <button data-repo-red="${p.sku}" title="Reducir stock por ajuste de inventario regular" class="h-8 bg-amber-200 hover:bg-amber-300 border border-brand-black rounded px-1.5 text-[10px] font-black font-heading flex-1 truncate shrink-0">- REDUCIR</button>
                    <button data-repo-out="${p.sku}" title="Registrar como merma o daño físico" class="h-8 bg-red-200 hover:bg-red-300 border border-brand-black rounded px-1.5 text-[10px] font-black font-heading flex-1 truncate shrink-0">- MERMA</button>
                </div>`}
            </div>`;
        }).join('');

        // Controles de paginación
        document.getElementById('paginacion-repo')?.remove();
        if (totalPag > 1) {
            const pagDiv = document.createElement('div');
            pagDiv.id = 'paginacion-repo';
            pagDiv.className = 'col-span-full flex items-center justify-between mt-3 gap-3 flex-wrap';
            pagDiv.innerHTML = `
                <span class="text-xs font-bold text-gray-500">Pagina ${this.paginaRepo} de ${totalPag} · ${filtrados.length} productos</span>
                <div class="flex gap-2">
                    <button id="repo-pag-ant" class="border-2 border-brand-black px-3 py-1 rounded text-xs font-heading font-black shadow-brutal-sm ${this.paginaRepo === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-100'}">ANTERIOR</button>
                    <button id="repo-pag-sig" class="border-2 border-brand-black px-3 py-1 rounded text-xs font-heading font-black shadow-brutal-sm ${this.paginaRepo === totalPag ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-100'}">SIGUIENTE</button>
                </div>`;
            box.insertAdjacentElement('afterend', pagDiv);
            document.getElementById('repo-pag-ant')?.addEventListener('click', () => {
                if (this.paginaRepo > 1) { this.paginaRepo--; this.renderRepoLista(); }
            });
            document.getElementById('repo-pag-sig')?.addEventListener('click', () => {
                if (this.paginaRepo < totalPag) { this.paginaRepo++; this.renderRepoLista(); }
            });
        }

        // Sanitización de inputs de cantidad en reposición
        box.querySelectorAll<HTMLInputElement>('input[data-repo-cant]').forEach((inp) => {
            sanitizarInputDecimal(inp, 9999, 5);
        });

        box.querySelectorAll('[data-repo-del]').forEach((btn) => {

            btn.addEventListener('click', () => {
                const sku = (btn as HTMLElement).dataset.repoDel;
                const prod = this.productos.find((x) => x.sku === sku);
                if (!sku || !prod) return;
                const confirmar = window.confirm(`¿Seguro que deseas eliminar permanentemente el producto "${prod.nombre}" del catálogo?`);
                if (confirmar) {
                    void api.eliminarProducto(sku).then(() => {
                        void api.productos().then((prods) => {
                            this.productos = prods;
                            this.renderRepoLista();
                            this.renderCatalogoLista();
                            const contEl = document.getElementById('repo-contador-estado');
                            if (contEl) contEl.textContent = `${this.productos.length} artículos en depósito`;
                        });
                    });
                }
            });
        });

        box.querySelectorAll('[data-repo-in]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const sku = (btn as HTMLElement).dataset.repoIn;
                const inp = box.querySelector<HTMLInputElement>(`input[data-repo-cant="${sku}"]`);
                const cant = inp?.value;
                if (sku && cant && Number(cant) > 0 && Number(cant) <= 9999) {
                    void api.compraStock(sku, cant).then(() => {
                        void api.productos().then((prods) => {
                            this.productos = prods;
                            this.renderRepoLista();
                            this.renderCatalogoLista();
                        });
                    });
                }
            });
        });

        box.querySelectorAll('[data-repo-red]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const sku = (btn as HTMLElement).dataset.repoRed;
                const inp = box.querySelector<HTMLInputElement>(`input[data-repo-cant="${sku}"]`);
                const cant = inp?.value;
                if (sku && cant && Number(cant) > 0 && Number(cant) <= 9999) {
                    void api.reducirStock(sku, cant).then(() => {
                        void api.productos().then((prods) => {
                            this.productos = prods;
                            this.renderRepoLista();
                            this.renderCatalogoLista();
                        });
                    });
                }
            });
        });

        box.querySelectorAll('[data-repo-out]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const sku = (btn as HTMLElement).dataset.repoOut;
                const inp = box.querySelector<HTMLInputElement>(`input[data-repo-cant="${sku}"]`);
                const cant = inp?.value;
                if (sku && cant && Number(cant) > 0 && Number(cant) <= 9999) {
                    void api.merma(sku, cant, null).then(() => {
                        void api.productos().then((prods) => {
                            this.productos = prods;
                            this.renderRepoLista();
                            this.renderCatalogoLista();
                        });
                    });
                }
            });
        });
    }

    private async guardarProducto(): Promise<void> {
        const inNombre = document.getElementById('prod-nombre') as HTMLInputElement | null;
        const inCat = document.getElementById('prod-categoria') as HTMLSelectElement | null;
        const inImp = document.getElementById('prod-impuesto') as HTMLSelectElement | null;
        const inBruto = document.getElementById('prod-precio-bruto') as HTMLInputElement | null;
        const inMargen = document.getElementById('prod-margen') as HTMLInputElement | null;
        const inNeto = document.getElementById('prod-precio-neto') as HTMLInputElement | null;
        const inStock = document.getElementById('prod-stock') as HTMLInputElement | null;
        const inUnidad = (document.getElementById('prod-unidad') as HTMLSelectElement | null)?.value as 'un' | 'kg' | 'ml' || 'un';
        const chkSinStock = document.getElementById('prod-sin-stock') as HTMLInputElement | null;
        const msgEl = document.getElementById('alta-prod-msg');

        const parseVal = (str?: string): number => {
            if (!str) return 0;
            const clean = str.trim().replace(',', '.');
            const n = parseFloat(clean);
            return Number.isFinite(n) && !isNaN(n) ? n : 0;
        };

        if (msgEl) {
            msgEl.classList.add('hidden');
            msgEl.textContent = '';
        }

        if (!inNombre?.value.trim()) {
            if (msgEl) {
                msgEl.textContent = 'El nombre del producto o servicio es obligatorio.';
                msgEl.style.color = '#C60C15';
                msgEl.classList.remove('hidden');
                inNombre?.focus();
            }
            return;
        }

        const precioNetoNum = parseVal(inNeto?.value);
        if (precioNetoNum <= 0 || precioNetoNum > 99999.99) {
            if (msgEl) {
                msgEl.textContent = 'El precio neto final debe ser un monto positivo entre $0.01 y $99,999.99 USD.';
                msgEl.style.color = '#C60C15';
                msgEl.classList.remove('hidden');
                inNeto?.focus();
            }
            return;
        }

        const stockNum = parseVal(inStock?.value);
        const esSinStock = chkSinStock?.checked || false;

        if (!esSinStock && (stockNum < 0 || stockNum > 99999)) {
            if (msgEl) {
                msgEl.textContent = 'El stock inicial debe estar comprendido entre 0 y 99,999 unidades.';
                msgEl.style.color = '#C60C15';
                msgEl.classList.remove('hidden');
                inStock?.focus();
            }
            return;
        }

        // Validación guiada para unidades enteras
        if (!esSinStock && inUnidad === 'un') {
            const tieneFraccion = !Number.isInteger(stockNum) || (stockNum % 1 !== 0);
            if (tieneFraccion) {
                if (msgEl) {
                    msgEl.textContent = 'Los productos vendidos por Unidad (un.) deben tener un stock entero exacto (ej: 10). Para registrar fracciones o decimales, seleccione Tipo de Medida "Por Peso (kg)" o "Por Volumen (ml)".';
                    msgEl.style.color = '#C60C15';
                    msgEl.classList.remove('hidden');
                    inStock?.focus();
                }
                return;
            }
        }

        const impPct = parseVal(inImp?.value || '0');
        const margenPct = parseVal(inMargen?.value || '30');
        let brutoNum = parseVal(inBruto?.value);
        if (brutoNum <= 0) {
            // Deducción automática de costo bruto para que el comerciante no quede bloqueado
            const baseSinImp = precioNetoNum / (1 + impPct / 100);
            brutoNum = baseSinImp / (1 + margenPct / 100);
        }

        const chkEsCaja = document.getElementById('prod-es-caja') as HTMLInputElement | null;
        const inUnidadesCaja = document.getElementById('prod-unidades-caja') as HTMLInputElement | null;
        const esCaja = chkEsCaja?.checked || false;
        const unidadesPorCaja = esCaja && inUnidadesCaja ? Math.max(2, parseInt(inUnidadesCaja.value, 10) || 12) : undefined;

        try {
            await api.crearProducto({
                nombre: inNombre.value.trim(),
                precioBrutoUsd: brutoNum.toFixed(2),
                margenPct: String(margenPct),
                precioUsd: precioNetoNum.toFixed(2),
                impuestoPct: String(impPct),
                stockInicial: chkSinStock?.checked ? '0' : String(stockNum),
                categoriaId: inCat?.value || '',
                sinStock: chkSinStock?.checked || false,
                pesable: inUnidad === 'kg' || inUnidad === 'ml',
                unidad: inUnidad,
                alcoholica: false,
                esCaja,
                unidadesPorCaja,
            });

            if (msgEl) {
                msgEl.textContent = 'Producto o servicio registrado exitosamente.';
                msgEl.style.color = '#00823B';
                msgEl.classList.remove('hidden');
            }
            setTimeout(() => void this.render('alta'), 800);
        } catch (e) {
            if (msgEl) {
                msgEl.textContent = e instanceof Error ? e.message : String(e);
                msgEl.style.color = '#C60C15';
                msgEl.classList.remove('hidden');
            }
        }
    }
}
