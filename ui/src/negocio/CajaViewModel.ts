import {
    api,
    CAP_CUENTA_ABIERTA,
    CAP_PESABLE,
    CAP_SERIE,
    CAP_VARIANTES,
    CuentaAbierta,
    PagoTicket,
    ProductoInfo,
    ResolucionVuelto,
    Ticket,
} from './api';
import { NegocioModel } from './NegocioModel';

interface LineaCarrito {
    sku: string;
    nombre: string;
    precioUsd: number;
    cantidad: number;
    pesable: boolean;
    conSerie: boolean;
    conVariantes: boolean;
    serie?: string;
    variante?: string;
}

export class CajaViewModel {
    private modelo: NegocioModel;
    private productos: ProductoInfo[] = [];
    private carrito: LineaCarrito[] = [];
    private busqueda = '';
    private cuentaSeleccionada: CuentaAbierta | null = null;
    private cuentas: CuentaAbierta[] = [];
    private oyentes: (() => void)[] = [];
    private edadConfirmadaSesion = false;

    constructor(modelo: NegocioModel) {
        this.modelo = modelo;
    }

    suscribir(fn: () => void): void {
        this.oyentes.push(fn);
        fn();
    }

    private notificar(): void {
        this.oyentes.forEach((f) => f());
    }

    async cargar(): Promise<void> {
        this.productos = await api.productos();
        if (this.modelo.tieneCapacidad(CAP_CUENTA_ABIERTA)) {
            this.cuentas = await api.cuentas();
        }
        this.notificar();
    }

    get visibles(): ProductoInfo[] {
        const q = this.busqueda.trim().toLowerCase();
        if (!q) return this.productos.slice(0, 24);
        return this.productos
            .filter((p) => p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
            .slice(0, 24);
    }

    setBusqueda(q: string): void {
        this.busqueda = q;
        this.notificar();
    }

    get lineasCarrito(): LineaCarrito[] {
        return this.carrito;
    }

    private tasaBloqueadaTicket: number | null = null;

    get tasaTicket(): number {
        return this.tasaBloqueadaTicket ?? this.modelo.tasaActual;
    }

    get totalUsd(): number {
        return this.carrito.reduce((a, l) => a + l.precioUsd * l.cantidad, 0);
    }

    get totalBs(): number {
        return this.totalUsd * this.tasaTicket;
    }

    get cuentasAbiertasListado(): CuentaAbierta[] {
        return this.cuentas;
    }

    get cuentaActiva(): CuentaAbierta | null {
        return this.cuentaSeleccionada;
    }

    get modoCuentaAbierta(): boolean {
        return this.cuentaSeleccionada !== null;
    }

    seleccionarCuenta(c: CuentaAbierta | null): void {
        this.cuentaSeleccionada = c;
        this.notificar();
    }

    private requiereEdad(_item: { capacidades: number }): boolean {
        return false;
    }

    marcarEdadConfirmada(v: boolean): void {
        this.edadConfirmadaSesion = v;
    }

    async agregar(sku: string): Promise<string | null> {
        const p = this.productos.find((x) => x.sku === sku);
        if (!p) return 'Producto no encontrado';
        if (this.requiereEdad(p)) return 'EDAD|' + p.nombre;
        return this.empujar(p);
    }

    empujar(p: ProductoInfo, serie?: string, variante?: string): string | null {
        const pesable = (p.capacidades & CAP_PESABLE) !== 0 || p.unidad === 'kg' || p.unidad === 'ml';
        const paso = pesable ? 0.25 : 1;
        const existente = this.carrito.find((l) => l.sku === p.sku && l.serie === serie && l.variante === variante);
        const cantActual = existente ? existente.cantidad : 0;
        const cantDeseada = cantActual + paso;

        // Validación de stock: no permitir si no es servicio o venta libre
        if (!p.sinStock) {
            const stockDisponible = Number(p.stock);
            if (stockDisponible < cantDeseada) {
                return `Stock insuficiente para ${p.nombre}. Disponible: ${stockDisponible}, Solicitado: ${cantDeseada}`;
            }
        }

        if (this.tasaBloqueadaTicket === null) {
            this.tasaBloqueadaTicket = this.modelo.tasaActual;
        }

        if (existente) {
            existente.cantidad = pesable ? Math.round(cantDeseada * 1000) / 1000 : Math.round(cantDeseada);
        } else {
            this.carrito.push({
                sku: p.sku,
                nombre: p.nombre,
                precioUsd: Number(p.precioUsd),
                cantidad: pesable ? paso : Math.round(paso),
                pesable,
                conSerie: (p.capacidades & CAP_SERIE) !== 0,
                conVariantes: (p.capacidades & CAP_VARIANTES) !== 0,
                serie,
                variante,
            });
        }
        this.notificar();
        return null;
    }

    asignarSerie(sku: string, serie: string): void {
        const linea = this.carrito.find((l) => l.sku === sku);
        if (linea) {
            linea.serie = serie.trim().toUpperCase();
            this.notificar();
        }
    }

    asignarVariante(sku: string, variante: string): void {
        const linea = this.carrito.find((l) => l.sku === sku);
        if (linea) {
            linea.variante = variante.trim();
            this.notificar();
        }
    }

    cambiarCantidad(sku: string, valor: number): string | null {
        const linea = this.carrito.find((l) => l.sku === sku);
        if (!linea) return null;
        const prod = this.productos.find((p) => p.sku === sku);
        
        let limpia = Math.max(0, valor);
        if (!linea.pesable) {
            limpia = Math.round(limpia);
        } else {
            limpia = Math.round(limpia * 1000) / 1000;
        }

        if (prod && !prod.sinStock && limpia > Number(prod.stock)) {
            return `Stock insuficiente para ${linea.nombre}. Disponible: ${prod.stock}`;
        }

        linea.cantidad = limpia;
        if (linea.cantidad === 0) this.quitar(sku);
        else this.notificar();
        return null;
    }

    quitar(sku: string): void {
        this.carrito = this.carrito.filter((l) => l.sku !== sku);
        if (this.carrito.length === 0) this.tasaBloqueadaTicket = null;
        this.notificar();
    }

    vaciar(): void {
        this.carrito = [];
        this.tasaBloqueadaTicket = null;
        this.notificar();
    }

    async cobrar(recibidoBs: string, pagos?: PagoTicket[], resolucionVuelto?: ResolucionVuelto): Promise<Ticket> {
        if (this.modoCuentaAbierta && this.cuentaSeleccionada) {
            throw new Error('Hay una cuenta abierta seleccionada. Usa su boton de cobro.');
        }
        if (this.carrito.length === 0) throw new Error('Carrito vacio');
        
        // Verificación previa de existencias
        for (const l of this.carrito) {
            const p = this.productos.find((x) => x.sku === l.sku);
            if (p && !p.sinStock && l.cantidad > Number(p.stock)) {
                throw new Error(`Stock insuficiente para ${p.nombre}. Disponible: ${p.stock}, En carrito: ${l.cantidad}`);
            }
        }

        const ticket = await api.registrarVenta(
            this.carrito.map((l) => ({ sku: l.sku, cantidad: String(l.cantidad) })),
            this.edadConfirmadaSesion,
            recibidoBs || '0',
            pagos,
            resolucionVuelto,
        );
        this.vaciar();
        this.edadConfirmadaSesion = false;
        await this.refrescarInventario();
        return ticket;
    }

    async crearCuenta(etiqueta: string): Promise<void> {
        const c = await api.abrirCuenta(etiqueta);
        if (!this.cuentas.some((x) => x.ventaId === c.ventaId)) {
            this.cuentas.push(c);
        }
        this.cuentaSeleccionada = c;
        this.notificar();
    }

    async agregarACuenta(sku: string): Promise<string | null> {
        if (!this.cuentaSeleccionada) return 'Selecciona una cuenta primero';
        const p = this.productos.find((x) => x.sku === sku);
        if (!p) return 'Producto no encontrado';
        if (this.requiereEdad(p)) return 'EDAD|' + p.nombre;
        const actualizada = await api.agregarConsumo(
            this.cuentaSeleccionada.ventaId,
            p.sku,
            '1',
            this.edadConfirmadaSesion,
        );
        this.cuentaSeleccionada = actualizada;
        this.cuentas = this.cuentas.map((c) => (c.ventaId === actualizada.ventaId ? actualizada : c));
        await this.refrescarInventario();
        return null;
    }

    async cerrarCuentaActual(recibidoBs: string, pagos?: PagoTicket[]): Promise<Ticket> {
        if (!this.cuentaSeleccionada) throw new Error('Ninguna cuenta seleccionada');
        const ticket = await api.cerrarCuenta(this.cuentaSeleccionada.ventaId, recibidoBs || '0', undefined, pagos);
        this.cuentas = this.cuentas.filter((c) => c.ventaId !== ticket.ventaId);
        this.cuentaSeleccionada = null;
        this.edadConfirmadaSesion = false;
        await this.refrescarInventario();
        return ticket;
    }

    private async refrescarInventario(): Promise<void> {
        this.productos = await api.productos();
        this.notificar();
    }
}
