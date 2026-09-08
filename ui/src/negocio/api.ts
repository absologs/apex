export const RUBRO_ABASTO = 1 << 0;
export const RUBRO_PANADERIA = 1 << 1;
export const RUBRO_LICORERIA = 1 << 2;
export const RUBRO_RETAIL = 1 << 3;

export const CAP_UNITARIA = 1 << 0;
export const CAP_PESABLE = 1 << 1;
export const CAP_PERECEDERO = 1 << 2;
export const CAP_CUENTA_ABIERTA = 1 << 3;
export const CAP_SERIE = 1 << 4;
export const CAP_VARIANTES = 1 << 5;
export const CAP_GARANTIA = 1 << 6;
export const CAP_COMISION = 1 << 7;

interface TauriBridge {
    core?: {
        invoke?: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
    };
}

declare global {
    interface Window {
        __TAURI__?: TauriBridge;
    }
}

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

export interface ConfigInfo {
    nombre: string;
    rubros: number;
    capacidades: number;
    tienePin: boolean;
}

export interface TasaImpuesto {
    id: string;
    nombre: string;
    porcentaje: number;
}

export interface Categoria {
    id: string;
    nombre: string;
}

export interface DispositivoRemoto {
    id: string;
    nombre: string;
    ip: string;
    ultimoAcceso: string;
    activo: boolean;
}

export interface RespaldoInfo {
    id: string;
    fecha: string;
    archivoNombre: string;
    registros: number;
    tamanoKb: number;
    checksumSha256: string;
}

export interface LicenciaInfo {
    estado: 'activa' | 'vencida' | 'demo';
    tipo: 'Enterprise Standalone Local' | 'Demo Cloud';
    claveLicencia: string;
    titular: string;
    validez: string;
}

export interface RegistroHistoricoTasa {
    id: string;
    valor: string;
    fechaHora: string;
    tipo: 'automático' | 'manual';
    motivo?: string;
}

export interface OperadorInfo {
    id: string;
    nombre: string;
    activo: boolean;
    creadoUnix: number;
}

export interface JornadaLaboral {
    id: string;
    estado: 'abierta' | 'cerrada';
    inicioUnix: number;
    finUnix?: number;
    inicioStr: string;
    finStr?: string;
    operadorInicial: string;
    operadorActual: string;
    operadoresActivos?: string[];
    operadoresRelevo: string[];
    tasaInicio: string;
    tasaFin?: string;
    ventasTotalUsd: string;
    ventasTotalBs: string;
    ticketsEmitidos: number;
    vueltoPagadoBs: string;
    vueltoRetenidoBs: string;
    deudasLiquidadasUsd: string;
    entradasStockReg: number;
    mermasStockReg: number;
    cambiosPrecioReg: number;
    checksumSha256?: string;
}

export interface ConfigSemaforoStock {
    rojoMax: number;
    amarilloMax: number;
}

export interface ProductoInfo {
    sku: string;
    nombre: string;
    precioBrutoUsd?: string;
    margenPct?: string;
    precioUsd: string; // Precio neto final
    impuestoPct: string;
    stock: string;
    capacidades: number;
    categoriaId?: string;
    sinStock?: boolean;
    unidad?: 'un' | 'kg' | 'ml';
    esCaja?: boolean;
    unidadesPorCaja?: number;
}

export interface LineaTicket {
    sku: string;
    nombre: string;
    cantidad: string;
    precioUsd: string;
    tasaBloqueada: string;
    subtotalUsd: string;
    subtotalBs: string;
}

export type MonedaMetodo = 'USD' | 'BS';

export interface MetodoPagoConfig {
    nombre: string;
    moneda: MonedaMetodo;
}

export interface PagoTicket {
    metodo: string;
    moneda?: MonedaMetodo;
    montoUsd: string;
    montoBs: string;
    tasaCambio?: string;
    referencia?: string;
}

export type EstadoVuelto = 'PAGADO' | 'RETENIDO' | 'SIN_VUELTO';

export interface ResolucionVuelto {
    estado: EstadoVuelto;
    metodo?: string;
    montoBs?: string;
    montoUsd?: string;
    tasa?: string;
}

export interface Ticket {
    ventaId: string;
    lineas: LineaTicket[];
    totalUsd: string;
    totalBs: string;
    montoRecibidoBs: string;
    vueltoBs: string;
    tasaDelDia: string;
    fechaHora?: string;
    canal?: 'VENTA DIRECTA' | 'CONSUMO EN CUENTA' | 'LIQUIDACIÓN DE DEUDA';
    operador?: string;
    saldoAFavorConsolidadoUsd?: string;
    fechaUnix?: number;
    pagos?: PagoTicket[];
    estadoVuelto?: EstadoVuelto;
    metodoVuelto?: string;
    montoVueltoBs?: string;
    montoVueltoUsd?: string;
    tasaVuelto?: string;
}

export interface ConsumoCuenta {
    id: string;
    sku: string;
    nombre: string;
    cantidad: number;
    precioUsd: string;
    subtotalUsd: string;
}

export interface CuentaAbierta {
    ventaId: string;
    etiqueta: string;
    lineas: number;
    totalParcialUsd: string;
    totalParcialBs: string;
    abonosUsd?: string;
    abonosBs?: string;
    consumos?: ConsumoCuenta[];
    tipo?: 'activa' | 'deuda';
    cliente?: string;
    nota?: string;
    fechaCreacionUnix?: number;
    fechaCreacionStr?: string;
    tasaPersonalizadaCobro?: string;
}

export interface Critico {
    sku: string;
    nombre: string;
    stock: string;
}

export interface TopProducto {
    nombre: string;
    cantidad: string;
    totalUsd?: string;
    porcentaje?: string;
}

export interface CategoriaDineroBruto {
    categoriaId: string;
    nombre: string;
    cantidadProductos: number;
    unidadesStock: number;
    dineroBrutoUsd: string;
    dineroBrutoBs: string;
    dineroVentaUsd: string;
    dineroVentaBs: string;
    margenBrutoProyectadoUsd: string;
    margenBrutoPct: string;
    porcentajeCapital: string;
}

export interface PanelDatos {
    ventas24hUsd: string;
    ventas24hBs: string;
    tickets24h: number;
    valorInventarioUsd: string;
    costoTotalUsd?: string;
    gananciaBrutaUsd?: string;
    gananciaNetaUsd?: string;
    gananciaNetaSinImpUsd?: string;
    gananciaNetaBs?: string;
    criticos: Critico[];
    cuentasAbiertas: number;
    deudasAbiertas?: number;
    dineroEnLaCalleUsd?: string;
    dineroEnLaCalleBs?: string;
    topProductos: TopProducto[];
    dineroPorCategoria?: CategoriaDineroBruto[];
}

export interface TasaActual {
    valor: string;
    fechaUnix: number;
    fluctuacionPct: string | null;
    direccion: 'subio' | 'bajo' | 'estable' | null;
}

export class ApiError extends Error {
    constructor(message: string) {
        super(message);
    }
}

function obtenerPerfilInicial(): { config: ConfigInfo; productos: ProductoInfo[]; key: string; claveLicencia: string; titular: string } {
    const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const esRetail = path.includes('retail') || params?.get('rubro') === 'retail';
    const esPanaderia = path.includes('panaderia') || params?.get('rubro') === 'panaderia';

    if (esRetail) {
        return {
            key: 'datiolabs_demo_retail_v3',
            claveLicencia: '0000888833330000',
            titular: 'DatioLabs Retail Demo',
            config: {
                nombre: 'DatioLabs Retail',
                rubros: RUBRO_RETAIL,
                capacidades: CAP_UNITARIA | CAP_SERIE | CAP_VARIANTES | CAP_GARANTIA | CAP_COMISION,
                tienePin: false,
            },
            productos: [
                { sku: 'SMART-PHONE-X', nombre: 'Smartphone X 128GB (Serie/Garantía)', precioBrutoUsd: '180.00', margenPct: '38', precioUsd: '250.00', impuestoPct: '16', stock: '8', capacidades: CAP_UNITARIA | CAP_SERIE | CAP_GARANTIA, unidad: 'un', categoriaId: 'cat-general' },
                { sku: 'AURICULAR-BT', nombre: 'Audífonos Inalámbricos Bluetooth Pro', precioBrutoUsd: '14.00', margenPct: '42', precioUsd: '20.00', impuestoPct: '16', stock: '22', capacidades: CAP_UNITARIA | CAP_GARANTIA, unidad: 'un', categoriaId: 'cat-general' },
                { sku: 'CARGADOR-RAPIDO', nombre: 'Cargador Rápido 30W Tipo-C', precioBrutoUsd: '5.50', margenPct: '45', precioUsd: '8.00', impuestoPct: '16', stock: '30', capacidades: CAP_UNITARIA, unidad: 'un', categoriaId: 'cat-general' },
                { sku: 'CABLE-USB-C', nombre: 'Cable Reforzado Tipo-C a Tipo-C 1.5m', precioBrutoUsd: '2.50', margenPct: '60', precioUsd: '4.00', impuestoPct: '16', stock: '45', capacidades: CAP_UNITARIA, unidad: 'un', categoriaId: 'cat-general' },
                { sku: 'POWERBANK-20K', nombre: 'Batería Portátil PowerBank 20000mAh', precioBrutoUsd: '16.00', margenPct: '40', precioUsd: '22.50', impuestoPct: '16', stock: '12', capacidades: CAP_UNITARIA | CAP_GARANTIA, unidad: 'un', categoriaId: 'cat-general' },
            ],
        };
    }

    if (esPanaderia) {
        return {
            key: 'datiolabs_demo_panaderia_v3',
            claveLicencia: '0000888822220000',
            titular: 'DatioLabs Panadería Demo',
            config: {
                nombre: 'DatioLabs Panadería',
                rubros: RUBRO_PANADERIA,
                capacidades: CAP_UNITARIA | CAP_PESABLE,
                tienePin: false,
            },
            productos: [
                { sku: 'PAN-CANILLA', nombre: 'Pan Canilla Tradicional', precioBrutoUsd: '0.50', margenPct: '60', precioUsd: '0.80', impuestoPct: '0', stock: '60', capacidades: CAP_UNITARIA, unidad: 'un', categoriaId: 'cat-panes' },
                { sku: 'PAN-CAMPESINO', nombre: 'Pan Campesino Rústico', precioBrutoUsd: '0.80', margenPct: '50', precioUsd: '1.20', impuestoPct: '0', stock: '35', capacidades: CAP_UNITARIA, unidad: 'un', categoriaId: 'cat-panes' },
                { sku: 'PAN-SOBADO', nombre: 'Pan Sobado Suave', precioBrutoUsd: '0.65', margenPct: '53', precioUsd: '1.00', impuestoPct: '0', stock: '40', capacidades: CAP_UNITARIA, unidad: 'un', categoriaId: 'cat-panes' },
                { sku: 'QUESO-GUAYANES', nombre: 'Queso Guayanés Fresco', precioBrutoUsd: '3.20', margenPct: '40', precioUsd: '4.50', impuestoPct: '0', stock: '15.00', capacidades: CAP_PESABLE, unidad: 'kg', categoriaId: 'cat-viveres' },
                { sku: 'CAFE-MOLIDO', nombre: 'Café Molido Tostado 250g', precioBrutoUsd: '2.00', margenPct: '50', precioUsd: '3.00', impuestoPct: '0', stock: '25', capacidades: CAP_UNITARIA, unidad: 'un', categoriaId: 'cat-viveres' },
            ],
        };
    }

    // Perfil Licorería (por defecto o /licoreria)
    return {
        key: 'datiolabs_demo_licoreria_v3',
        claveLicencia: '0000888811110000',
        titular: 'DatioLabs Licorería Demo',
        config: {
            nombre: 'DatioLabs Licorería',
            rubros: RUBRO_LICORERIA,
            capacidades: CAP_UNITARIA | CAP_CUENTA_ABIERTA,
            tienePin: false,
        },
        productos: [
            { sku: 'RON-DIPLOMATICO', nombre: 'Ron Reserva Exclusiva 750ml', precioBrutoUsd: '13.50', margenPct: '33', precioUsd: '18.00', impuestoPct: '16', stock: '12', capacidades: CAP_UNITARIA | CAP_CUENTA_ABIERTA, unidad: 'un', categoriaId: 'cat-bebidas' },
            { sku: 'RON-SANTA-TERESA', nombre: 'Ron Santa Teresa Gran Reserva 750ml', precioBrutoUsd: '8.80', margenPct: '36', precioUsd: '12.00', impuestoPct: '16', stock: '16', capacidades: CAP_UNITARIA | CAP_CUENTA_ABIERTA, unidad: 'un', categoriaId: 'cat-bebidas' },
            { sku: 'CERVEZA-POLAR-6P', nombre: 'Six Pack Cerveza Pilsen 330ml', precioBrutoUsd: '3.30', margenPct: '36', precioUsd: '4.50', impuestoPct: '16', stock: '30', capacidades: CAP_UNITARIA | CAP_CUENTA_ABIERTA, unidad: 'un', categoriaId: 'cat-bebidas' },
            { sku: 'WHISKY-12A', nombre: 'Whisky Escocés 12 Años 750ml', precioBrutoUsd: '16.50', margenPct: '33', precioUsd: '22.00', impuestoPct: '16', stock: '8', capacidades: CAP_UNITARIA | CAP_CUENTA_ABIERTA, unidad: 'un', categoriaId: 'cat-bebidas' },
            { sku: 'REFRESCO-COLA', nombre: 'Refresco Cola 2L (Mezclador)', precioBrutoUsd: '1.20', margenPct: '50', precioUsd: '1.80', impuestoPct: '16', stock: '24', capacidades: CAP_UNITARIA | CAP_CUENTA_ABIERTA, unidad: 'un', categoriaId: 'cat-bebidas' },
            { sku: 'HIELO-BOLSA', nombre: 'Bolsa de Hielo 3Kg', precioBrutoUsd: '0.60', margenPct: '66', precioUsd: '1.00', impuestoPct: '16', stock: '40', capacidades: CAP_UNITARIA | CAP_CUENTA_ABIERTA, unidad: 'un', categoriaId: 'cat-viveres' },
        ],
    };
}

class MockDemoStorage {
    config: ConfigInfo | null;
    productos: ProductoInfo[];
    cuentas: CuentaAbierta[] = [
        {
            ventaId: 'CTA-88210',
            etiqueta: 'Mesa 4 (Terraza)',
            tipo: 'activa',
            fechaCreacionUnix: Math.floor(Date.now() / 1000) - 7200,
            fechaCreacionStr: 'Hoy, 02:00 PM',
            lineas: 2,
            totalParcialUsd: '10.00',
            totalParcialBs: '8073.90',
            abonosUsd: '5.00',
            abonosBs: '4036.95',
            consumos: [
                {
                    id: 'con-m4-1',
                    sku: 'CERVEZA-POLAR-6P',
                    nombre: 'Six Pack Cerveza Pilsen 330ml',
                    cantidad: 2,
                    precioUsd: '4.50',
                    subtotalUsd: '9.00',
                },
                {
                    id: 'con-m4-2',
                    sku: 'HIELO-BOLSA',
                    nombre: 'Bolsa de Hielo 3Kg',
                    cantidad: 1,
                    precioUsd: '1.00',
                    subtotalUsd: '1.00',
                },
            ],
        },
        {
            ventaId: 'CTA-88211',
            etiqueta: 'Barra Principal (Carlos)',
            tipo: 'activa',
            fechaCreacionUnix: Math.floor(Date.now() / 1000) - 3600,
            fechaCreacionStr: 'Hoy, 03:00 PM',
            lineas: 2,
            totalParcialUsd: '19.80',
            totalParcialBs: '15986.32',
            abonosUsd: '25.00',
            abonosBs: '20184.75',
            consumos: [
                {
                    id: 'con-bp-1',
                    sku: 'RON-DIPLOMATICO',
                    nombre: 'Ron Reserva Exclusiva 750ml',
                    cantidad: 1,
                    precioUsd: '18.00',
                    subtotalUsd: '18.00',
                },
                {
                    id: 'con-bp-2',
                    sku: 'REFRESCO-COLA',
                    nombre: 'Refresco Cola 2L (Mezclador)',
                    cantidad: 1,
                    precioUsd: '1.80',
                    subtotalUsd: '1.80',
                },
            ],
        },
        {
            ventaId: 'CTA-88212',
            etiqueta: 'Mesa 1 (VIP)',
            tipo: 'activa',
            fechaCreacionUnix: Math.floor(Date.now() / 1000) - 1800,
            fechaCreacionStr: 'Hoy, 03:30 PM',
            lineas: 1,
            totalParcialUsd: '22.00',
            totalParcialBs: '17762.58',
            abonosUsd: '0.00',
            abonosBs: '0.00',
            consumos: [
                {
                    id: 'con-m1-1',
                    sku: 'WHISKY-12A',
                    nombre: 'Whisky Escocés 12 Años 750ml',
                    cantidad: 1,
                    precioUsd: '22.00',
                    subtotalUsd: '22.00',
                },
            ],
        },
        {
            ventaId: 'DEU-99042',
            etiqueta: 'Taller Hermanos Gómez',
            cliente: 'Carlos Gómez (Taller)',
            nota: 'Crédito comercial acordado a cobrar en días',
            tipo: 'deuda',
            fechaCreacionUnix: Math.floor(Date.now() / 1000) - 86400 * 3,
            fechaCreacionStr: '01/09/2026 10:30',
            lineas: 3,
            totalParcialUsd: '34.00',
            totalParcialBs: '27451.26',
            abonosUsd: '10.00',
            abonosBs: '8073.90',
            consumos: [
                {
                    id: 'con-d1',
                    sku: 'RON-SANTA-TERESA',
                    nombre: 'Ron Santa Teresa Gran Reserva 750ml',
                    cantidad: 2,
                    precioUsd: '12.00',
                    subtotalUsd: '24.00',
                },
                {
                    id: 'con-d2',
                    sku: 'CERVEZA-POLAR-6P',
                    nombre: 'Six Pack Cerveza Pilsen 330ml',
                    cantidad: 2,
                    precioUsd: '4.50',
                    subtotalUsd: '9.00',
                },
                {
                    id: 'con-d3',
                    sku: 'HIELO-BOLSA',
                    nombre: 'Bolsa de Hielo 3Kg',
                    cantidad: 1,
                    precioUsd: '1.00',
                    subtotalUsd: '1.00',
                },
            ],
        },
    ];
    categorias: Categoria[] = [
        { id: 'cat-general', nombre: 'General' },
        { id: 'cat-viveres', nombre: 'Víveres' },
        { id: 'cat-bebidas', nombre: 'Bebidas y Licores' },
        { id: 'cat-panes', nombre: 'Panes y Horneados' },
    ];
    tasasImpuestos: TasaImpuesto[] = [
        { id: 'iva-16', nombre: 'IVA General (16%)', porcentaje: 16 },
        { id: 'iva-8', nombre: 'IVA Reducido (8%)', porcentaje: 8 },
        { id: 'iva-0', nombre: 'Exento (0%)', porcentaje: 0 },
    ];
    tasaActual: TasaActual = { valor: '807.39', fechaUnix: Math.floor(Date.now() / 1000), fluctuacionPct: null, direccion: null };
    tickets: Ticket[] = [
        {
            ventaId: 'TRX-94812',
            totalUsd: '23.80',
            totalBs: '19215.88',
            tasaDelDia: '807.39',
            montoRecibidoBs: '20000.00',
            vueltoBs: '784.12',
            fechaHora: 'Hoy, 01:24 PM',
            fechaUnix: Math.floor(Date.now() / 1000) - 3600,
            canal: 'VENTA DIRECTA',
            operador: 'Caja Principal',
            pagos: [
                { metodo: 'PAGO MOVIL', montoUsd: '23.80', montoBs: '19215.88', referencia: 'REF-7892' },
            ],
            lineas: [
                { sku: 'RON-SANTA-TERESA', nombre: 'Ron Santa Teresa Gran Reserva 750ml', cantidad: '1', precioUsd: '12.00', tasaBloqueada: '807.39', subtotalUsd: '12.00', subtotalBs: '9688.68' },
                { sku: 'CERVEZA-POLAR-6P', nombre: 'Six Pack Cerveza Pilsen 330ml', cantidad: '2', precioUsd: '4.50', tasaBloqueada: '807.39', subtotalUsd: '9.00', subtotalBs: '7266.51' },
                { sku: 'HIELO-BOLSA', nombre: 'Bolsa de Hielo 3Kg', cantidad: '1', precioUsd: '1.00', tasaBloqueada: '807.39', subtotalUsd: '1.00', subtotalBs: '807.39' },
                { sku: 'REFRESCO-COLA', nombre: 'Refresco Cola 2L (Mezclador)', cantidad: '1', precioUsd: '1.80', tasaBloqueada: '807.39', subtotalUsd: '1.80', subtotalBs: '1453.30' },
            ],
        },
        {
            ventaId: 'CTA-78104',
            totalUsd: '40.00',
            totalBs: '32295.60',
            tasaDelDia: '807.39',
            montoRecibidoBs: '35000.00',
            vueltoBs: '2704.40',
            fechaHora: 'Hoy, 12:50 PM',
            fechaUnix: Math.floor(Date.now() / 1000) - 7200,
            canal: 'CONSUMO EN CUENTA',
            operador: 'Mesa 4 / Mostrador',
            pagos: [
                { metodo: 'DOL.CASH', moneda: 'USD', montoUsd: '20.00', montoBs: '16147.80', tasaCambio: '807.39' },
                { metodo: 'PUNTOD.VENTA', moneda: 'BS', montoUsd: '20.00', montoBs: '16147.80', referencia: 'LOTE-112' },
            ],
            lineas: [
                { sku: 'RON-DIPLOMATICO', nombre: 'Ron Reserva Exclusiva 750ml', cantidad: '1', precioUsd: '18.00', tasaBloqueada: '807.39', subtotalUsd: '18.00', subtotalBs: '14533.02' },
                { sku: 'WHISKY-12A', nombre: 'Whisky Escocés 12 Años 750ml', cantidad: '1', precioUsd: '22.00', tasaBloqueada: '807.39', subtotalUsd: '22.00', subtotalBs: '17762.58' },
            ],
        },
        {
            ventaId: 'TRX-94811',
            totalUsd: '13.60',
            totalBs: '10980.50',
            tasaDelDia: '807.39',
            montoRecibidoBs: '11000.00',
            vueltoBs: '19.50',
            fechaHora: 'Hoy, 11:35 AM',
            fechaUnix: Math.floor(Date.now() / 1000) - 10800,
            canal: 'VENTA DIRECTA',
            operador: 'Caja Principal',
            pagos: [
                { metodo: 'BS.EFEC.', moneda: 'BS', montoUsd: '13.60', montoBs: '10980.50' },
            ],
            lineas: [
                { sku: 'CERVEZA-POLAR-6P', nombre: 'Six Pack Cerveza Pilsen 330ml', cantidad: '2', precioUsd: '4.50', tasaBloqueada: '807.39', subtotalUsd: '9.00', subtotalBs: '7266.51' },
                { sku: 'REFRESCO-COLA', nombre: 'Refresco Cola 2L (Mezclador)', cantidad: '2', precioUsd: '1.80', tasaBloqueada: '807.39', subtotalUsd: '3.60', subtotalBs: '2906.60' },
                { sku: 'HIELO-BOLSA', nombre: 'Bolsa de Hielo 3Kg', cantidad: '1', precioUsd: '1.00', tasaBloqueada: '807.39', subtotalUsd: '1.00', subtotalBs: '807.39' },
            ],
        },
        {
            ventaId: 'CTA-78103',
            totalUsd: '18.00',
            totalBs: '14533.02',
            tasaDelDia: '807.39',
            montoRecibidoBs: '15000.00',
            vueltoBs: '466.98',
            fechaHora: 'Hoy, 10:15 AM',
            fechaUnix: Math.floor(Date.now() / 1000) - 14400,
            canal: 'CONSUMO EN CUENTA',
            operador: 'Barra Principal',
            pagos: [
                { metodo: 'ZELLE', moneda: 'USD', montoUsd: '18.00', montoBs: '14533.02', tasaCambio: '807.39', referencia: 'ZEL-5501' },
            ],
            lineas: [
                { sku: 'RON-DIPLOMATICO', nombre: 'Ron Reserva Exclusiva 750ml', cantidad: '1', precioUsd: '18.00', tasaBloqueada: '807.39', subtotalUsd: '18.00', subtotalBs: '14533.02' },
            ],
        },
    ];
    ventasTotalUsd = 95.40;
    ventasTotalBs = 77025.00;
    // Jerarquía estricta obligatoria: Bolívares arriba (alta frecuencia), Divisas abajo
    metodosPago: MetodoPagoConfig[] = [
        { nombre: 'PUNTOD.VENTA', moneda: 'BS' },
        { nombre: 'BIOPAGO', moneda: 'BS' },
        { nombre: 'PAGO MOVIL', moneda: 'BS' },
        { nombre: 'TRANSF.BS.', moneda: 'BS' },
        { nombre: 'BS.EFEC.', moneda: 'BS' },
        { nombre: 'DOL.CASH', moneda: 'USD' },
        { nombre: 'ZELLE', moneda: 'USD' },
        { nombre: 'BINAN.USDT', moneda: 'USD' },
    ];
    dispositivos: DispositivoRemoto[] = [
        { id: 'dev-1', nombre: 'iPhone 15 Pro (Dueño)', ip: '192.168.1.45', ultimoAcceso: 'Hace 5 min', activo: true },
        { id: 'dev-2', nombre: 'Tablet Mostrador 1', ip: '192.168.1.80', ultimoAcceso: 'Hace 12 min', activo: true },
    ];
    respaldos: RespaldoInfo[] = [
        { id: 'bk-1', fecha: 'Hoy, 06:00 PM', archivoNombre: 'DATO-DEMO-20260903-180000.datio', registros: 412, tamanoKb: 124, checksumSha256: '9f83a21b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f' },
        { id: 'bk-2', fecha: 'Ayer, 11:30 PM', archivoNombre: 'DATO-DEMO-20260902-233000.datio', registros: 395, tamanoKb: 118, checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    ];
    licencia: LicenciaInfo = {
        estado: 'activa',
        tipo: 'Enterprise Standalone Local',
        claveLicencia: '0000888811110000',
        titular: 'Empresa DatioLabs Cliente Comercial',
        validez: 'Perpetua (Sin caducidad / Portabilidad Total)',
    };
    operadores: OperadorInfo[] = [
        { id: 'op-1', nombre: 'Carlos Mendoza', activo: true, creadoUnix: Math.floor(Date.now() / 1000) - 86400 * 30 },
        { id: 'op-2', nombre: 'María Andrea Silva', activo: true, creadoUnix: Math.floor(Date.now() / 1000) - 86400 * 15 },
        { id: 'op-3', nombre: 'José Gregorio Páez', activo: true, creadoUnix: Math.floor(Date.now() / 1000) - 86400 * 5 },
    ];
    jornadaActual: JornadaLaboral | null = {
        id: 'JOR-20260908-01',
        estado: 'abierta',
        inicioUnix: Math.floor(Date.now() / 1000) - 14400,
        inicioStr: 'Hoy, 08:30 AM',
        operadorInicial: 'Carlos Mendoza',
        operadorActual: 'Carlos Mendoza',
        operadoresActivos: ['Carlos Mendoza'],
        operadoresRelevo: ['Carlos Mendoza'],
        tasaInicio: '807.39',
        ventasTotalUsd: '95.40',
        ventasTotalBs: '77025.00',
        ticketsEmitidos: 6,
        vueltoPagadoBs: '1450.00',
        vueltoRetenidoBs: '784.12',
        deudasLiquidadasUsd: '34.00',
        entradasStockReg: 2,
        mermasStockReg: 0,
        cambiosPrecioReg: 0,
    };
    historicoJornadas: JornadaLaboral[] = [
        {
            id: 'JOR-20260907-01',
            estado: 'cerrada',
            inicioUnix: Math.floor(Date.now() / 1000) - 86400 - 28800,
            finUnix: Math.floor(Date.now() / 1000) - 86400,
            inicioStr: 'Ayer, 08:00 AM',
            finStr: 'Ayer, 09:30 PM',
            operadorInicial: 'María Andrea Silva',
            operadorActual: 'Carlos Mendoza',
            operadoresRelevo: ['María Andrea Silva', 'Carlos Mendoza'],
            tasaInicio: '805.20',
            tasaFin: '807.39',
            ventasTotalUsd: '340.50',
            ventasTotalBs: '274889.70',
            ticketsEmitidos: 24,
            vueltoPagadoBs: '4520.00',
            vueltoRetenidoBs: '1200.00',
            deudasLiquidadasUsd: '68.00',
            entradasStockReg: 4,
            mermasStockReg: 1,
            cambiosPrecioReg: 1,
            checksumSha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        },
    ];
    semaforoStock: ConfigSemaforoStock = {
        rojoMax: 5,
        amarilloMax: 15,
    };
    historicoTasas: RegistroHistoricoTasa[] = [
        { id: 'tx-1', valor: '807.3900', fechaHora: 'Hoy, 04:00 PM', tipo: 'automático', motivo: 'Sondeo oficial BCV' },
        { id: 'tx-2', valor: '805.2000', fechaHora: 'Hoy, 09:00 AM', tipo: 'automático', motivo: 'Apertura de jornada' },
        { id: 'tx-3', valor: '802.1500', fechaHora: 'Ayer, 05:00 PM', tipo: 'automático', motivo: 'Cierre BCV' },
    ];
    pinDueno: string = '';
    private storageKey: string;

    constructor() {
        const perfil = obtenerPerfilInicial();
        this.storageKey = perfil.key;
        this.config = perfil.config;
        this.productos = perfil.productos;
        this.licencia.claveLicencia = perfil.claveLicencia;
        this.licencia.titular = perfil.titular;

        try {
            // Purgar versiones obsoletas de almacenamiento en demo
            ['datiolabs_demo_licoreria_db', 'datiolabs_demo_panaderia_db', 'datiolabs_demo_retail_db', 'datiolabs_demo_licoreria_v2'].forEach((k) => {
                try { localStorage.removeItem(k); } catch (_) {}
            });
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.productos && Array.isArray(parsed.productos)) {
                    this.productos = parsed.productos.map((p: ProductoInfo) => {
                        const original = perfil.productos.find((x) => x.sku === p.sku);
                        const raw = String(p.unidad || (original?.unidad) || '').toLowerCase();
                        const un: 'un' | 'kg' | 'ml' = raw === 'kg' ? 'kg' : raw === 'ml' ? 'ml' : 'un';
                        const catId = p.categoriaId && p.categoriaId.trim()
                            ? p.categoriaId
                            : (original?.categoriaId || 'cat-general');
                        const pUsd = Number(p.precioUsd) || 0;
                        const pBruto = p.precioBrutoUsd && Number(p.precioBrutoUsd) > 0
                            ? p.precioBrutoUsd
                            : (original?.precioBrutoUsd || (pUsd * 0.65).toFixed(2));
                        return {
                            ...p,
                            unidad: un,
                            categoriaId: catId,
                            precioBrutoUsd: pBruto,
                        };
                    });
                }
                if (parsed.cuentas && Array.isArray(parsed.cuentas) && parsed.cuentas.length > 0) {
                    this.cuentas = parsed.cuentas.map((c: CuentaAbierta) => {
                        if (!Array.isArray(c.consumos)) c.consumos = [];
                        if (c.abonosUsd === undefined) c.abonosUsd = '0.00';
                        if (c.abonosBs === undefined) c.abonosBs = '0.00';
                        if (!c.tipo) {
                            c.tipo = (c.etiqueta.toLowerCase().includes('taller') || c.etiqueta.toLowerCase().includes('deuda'))
                                ? 'deuda'
                                : 'activa';
                        }
                        if (!c.fechaCreacionUnix) {
                            c.fechaCreacionUnix = c.tipo === 'deuda'
                                ? Math.floor(Date.now() / 1000) - 86400 * 3
                                : Math.floor(Date.now() / 1000) - 3600;
                        }
                        if (!c.fechaCreacionStr) {
                            c.fechaCreacionStr = c.tipo === 'deuda' ? '01/09/2026 10:30' : 'Hoy';
                        }
                        if (c.consumos.length === 0 && parseNum(c.totalParcialUsd) > 0) {
                            c.consumos.push({
                                id: 'con-' + Math.random().toString(36).slice(2, 8),
                                sku: 'CONSUMO-PREV',
                                nombre: 'Consumos acumulados',
                                cantidad: 1,
                                precioUsd: String(c.totalParcialUsd),
                                subtotalUsd: String(c.totalParcialUsd),
                            });
                        }
                        c.lineas = c.consumos.length;
                        return c;
                    });
                    if (!this.cuentas.some((c) => c.tipo === 'deuda')) {
                        this.cuentas.push({
                            ventaId: 'DEU-99042',
                            etiqueta: 'Taller Hermanos Gómez',
                            cliente: 'Carlos Gómez (Taller)',
                            nota: 'Crédito comercial convenido a pagar en días',
                            tipo: 'deuda',
                            fechaCreacionUnix: Math.floor(Date.now() / 1000) - 86400 * 3,
                            fechaCreacionStr: '01/09/2026 10:30',
                            lineas: 3,
                            totalParcialUsd: '34.00',
                            totalParcialBs: (34 * parseNum(this.tasaActual.valor)).toFixed(2),
                            abonosUsd: '10.00',
                            abonosBs: (10 * parseNum(this.tasaActual.valor)).toFixed(2),
                            consumos: [
                                { id: 'con-d1', sku: 'RON-SANTA-TERESA', nombre: 'Ron Santa Teresa Gran Reserva 750ml', cantidad: 2, precioUsd: '12.00', subtotalUsd: '24.00' },
                                { id: 'con-d2', sku: 'CERVEZA-POLAR-6P', nombre: 'Six Pack Cerveza Pilsen 330ml', cantidad: 2, precioUsd: '4.50', subtotalUsd: '9.00' },
                                { id: 'con-d3', sku: 'HIELO-BOLSA', nombre: 'Bolsa de Hielo 3Kg', cantidad: 1, precioUsd: '1.00', subtotalUsd: '1.00' },
                            ],
                        });
                    }
                }
                if (parsed.metodosPago && Array.isArray(parsed.metodosPago)) {
                    const defaultMetodos: MetodoPagoConfig[] = [
                        { nombre: 'PUNTOD.VENTA', moneda: 'BS' },
                        { nombre: 'BIOPAGO', moneda: 'BS' },
                        { nombre: 'PAGO MOVIL', moneda: 'BS' },
                        { nombre: 'TRANSF.BS.', moneda: 'BS' },
                        { nombre: 'BS.EFEC.', moneda: 'BS' },
                        { nombre: 'DOL.CASH', moneda: 'USD' },
                        { nombre: 'ZELLE', moneda: 'USD' },
                        { nombre: 'BINAN.USDT', moneda: 'USD' },
                    ];
                    const normalizados: MetodoPagoConfig[] = [];
                    const nombresVistos = new Set<string>();

                    const procesarMetodo = (m: unknown) => {
                        let nombre = '';
                        let moneda: MonedaMetodo = 'BS';
                        if (typeof m === 'string') {
                            nombre = m.trim().toUpperCase();
                            if (nombre === 'DOLAR.EFEC.') nombre = 'DOL.CASH';
                            if (nombre === 'USDT BINAN.') nombre = 'BINAN.USDT';
                            if (['DOL.CASH', 'ZELLE', 'BINAN.USDT'].includes(nombre)) {
                                moneda = 'USD';
                            }
                        } else if (m && typeof m === 'object' && 'nombre' in m) {
                            const obj = m as { nombre: string; moneda?: string };
                            nombre = String(obj.nombre || '').trim().toUpperCase();
                            if (nombre === 'DOLAR.EFEC.') nombre = 'DOL.CASH';
                            if (nombre === 'USDT BINAN.') nombre = 'BINAN.USDT';
                            moneda = obj.moneda === 'USD' || ['DOL.CASH', 'ZELLE', 'BINAN.USDT'].includes(nombre) ? 'USD' : 'BS';
                        }
                        if (nombre && !nombresVistos.has(nombre)) {
                            nombresVistos.add(nombre);
                            normalizados.push({ nombre, moneda });
                        }
                    };

                    defaultMetodos.forEach(procesarMetodo);
                    parsed.metodosPago.forEach(procesarMetodo);
                    // Jerarquía estricta obligatoria: Bolívares primero, divisas al final
                    normalizados.sort((a, b) => (a.moneda === b.moneda ? 0 : a.moneda === 'BS' ? -1 : 1));
                    this.metodosPago = normalizados;
                } else {
                    this.metodosPago.sort((a, b) => (a.moneda === b.moneda ? 0 : a.moneda === 'BS' ? -1 : 1));
                }
                if (parsed.operadores && Array.isArray(parsed.operadores)) this.operadores = parsed.operadores;
                if (parsed.jornadaActual !== undefined) this.jornadaActual = parsed.jornadaActual;
                if (parsed.historicoJornadas && Array.isArray(parsed.historicoJornadas)) this.historicoJornadas = parsed.historicoJornadas;
                if (parsed.semaforoStock) this.semaforoStock = parsed.semaforoStock;
                if (parsed.categorias) this.categorias = parsed.categorias;
                if (parsed.tasasImpuestos) this.tasasImpuestos = parsed.tasasImpuestos;
                if (parsed.tasaActual) this.tasaActual = parsed.tasaActual;
                if (parsed.dispositivos) this.dispositivos = parsed.dispositivos;
                if (parsed.respaldos) this.respaldos = parsed.respaldos;
                if (parsed.historicoTasas) this.historicoTasas = parsed.historicoTasas;
                if (parsed.tickets && Array.isArray(parsed.tickets) && parsed.tickets.length > 0) this.tickets = parsed.tickets;
                if (parsed.ventasTotalUsd !== undefined) this.ventasTotalUsd = Number(parsed.ventasTotalUsd);
                if (parsed.ventasTotalBs !== undefined) this.ventasTotalBs = Number(parsed.ventasTotalBs);
                if (parsed.pinDueno !== undefined) this.pinDueno = parsed.pinDueno;
                if (this.config && this.pinDueno) {
                    this.config.tienePin = true;
                }
            }
        } catch (_) {}
        void this.refrescarTasaEnVivo();
    }

    async refrescarTasaEnVivo(): Promise<void> {
        try {
            const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
            if (res.ok) {
                const data = await res.json();
                const prom = Number(data.promedio);
                if (Number.isFinite(prom) && prom > 0) {
                    const ant = Number(this.tasaActual.valor);
                    let diffPct: string | null = null;
                    let dir: 'subio' | 'bajo' | 'estable' | null = null;
                    if (Number.isFinite(ant) && ant > 0 && ant !== prom) {
                        const pct = ((prom - ant) / ant) * 100;
                        diffPct = Math.abs(pct).toFixed(2);
                        dir = pct > 0 ? 'subio' : 'bajo';
                    }
                    this.tasaActual = {
                        valor: prom.toFixed(4),
                        fechaUnix: Math.floor(Date.now() / 1000),
                        fluctuacionPct: diffPct,
                        direccion: dir,
                    };

                    const ahora = new Date();
                    const horaStr = ahora.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
                    this.historicoTasas.unshift({
                        id: 'tx-' + Math.random().toString(36).slice(2, 7),
                        valor: prom.toFixed(4),
                        fechaHora: `Hoy, ${horaStr}`,
                        tipo: 'automático',
                        motivo: 'Sincronización BCV en vivo',
                    });
                    if (this.historicoTasas.length > 50) this.historicoTasas.pop();

                    this.persist();

                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('tasa_actualizada', { detail: prom }));
                    }
                }
            }
        } catch (_) {}
    }

    persist() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                productos: this.productos,
                cuentas: this.cuentas,
                categorias: this.categorias,
                tasasImpuestos: this.tasasImpuestos,
                tasaActual: this.tasaActual,
                dispositivos: this.dispositivos,
                respaldos: this.respaldos,
                historicoTasas: this.historicoTasas,
                tickets: this.tickets,
                ventasTotalUsd: this.ventasTotalUsd,
                ventasTotalBs: this.ventasTotalBs,
                pinDueno: this.pinDueno,
                metodosPago: this.metodosPago,
                operadores: this.operadores,
                jornadaActual: this.jornadaActual,
                historicoJornadas: this.historicoJornadas,
                semaforoStock: this.semaforoStock,
            }));
        } catch (_) {}
    }
}

const demoStore = new MockDemoStorage();

export async function invocar<T>(comando: string, args?: Record<string, unknown>): Promise<T> {
    const puente = window.__TAURI__;
    const invocador = puente?.core?.invoke;
    if (invocador) {
        try {
            return (await invocador(comando, args)) as T;
        } catch (e) {
            throw new ApiError(typeof e === 'string' ? e : JSON.stringify(e));
        }
    }

    // Modo Demo Web en Navegador (Cloudflare Pages /demo)
    return mockInvocar<T>(comando, args);
}

function mockInvocar<T>(comando: string, args?: Record<string, unknown>): Promise<T> {
    switch (comando) {
        case 'obtener_config':
            return Promise.resolve(demoStore.config as unknown as T);
        case 'inicializar_negocio': {
            const pin = args?.pinDueno ? String(args.pinDueno).trim() : '';
            demoStore.pinDueno = pin;
            demoStore.config = {
                nombre: String(args?.nombre || 'Mi Negocio Demo'),
                rubros: Number(args?.rubros || 15),
                capacidades: CAP_UNITARIA | CAP_PESABLE | CAP_CUENTA_ABIERTA | CAP_SERIE | CAP_VARIANTES,
                tienePin: pin.length > 0,
            };
            demoStore.persist();
            return Promise.resolve(undefined as unknown as T);
        }
        case 'validar_pin_dueno': {
            const ingresado = String(args?.pin || '').trim();
            // Si no tiene PIN configurado, siempre entra
            if (!demoStore.pinDueno) return Promise.resolve(true as unknown as T);
            return Promise.resolve((ingresado === demoStore.pinDueno) as unknown as T);
        }
        case 'cambiar_pin_dueno': {
            const anterior = String(args?.pinAnterior || '').trim();
            const nuevo = String(args?.pinNuevo || '').trim();
            // Validar clave anterior si existía
            if (demoStore.pinDueno && anterior !== demoStore.pinDueno) {
                return Promise.reject(new Error('La clave anterior no coincide.'));
            }
            demoStore.pinDueno = nuevo;
            if (demoStore.config) {
                demoStore.config.tienePin = nuevo.length > 0;
            }
            demoStore.persist();
            return Promise.resolve(true as unknown as T);
        }
        case 'listar_productos':
            return Promise.resolve(demoStore.productos as unknown as T);
        case 'crear_producto': {
            const input = args?.input as Record<string, unknown>;
            const rawUnidad = String(input?.unidad || '').toLowerCase();
            const unidad: 'un' | 'kg' | 'ml' = rawUnidad === 'kg' ? 'kg' : rawUnidad === 'ml' ? 'ml' : (input?.pesable ? 'kg' : 'un');
            const esCaja = Boolean(input?.esCaja);
            const unidadesPorCaja = Number(input?.unidadesPorCaja) > 1 ? Math.floor(Number(input.unidadesPorCaja)) : undefined;
            const stockFinal = String(input?.stockInicial || '0');
            const nuevo: ProductoInfo = {
                sku: String(input?.sku || '').toUpperCase(),
                nombre: String(input?.nombre || ''),
                precioBrutoUsd: String(input?.precioBrutoUsd || '0'),
                margenPct: String(input?.margenPct || '0'),
                precioUsd: String(input?.precioUsd || '0'),
                impuestoPct: String(input?.impuestoPct || '0'),
                stock: stockFinal,
                capacidades: CAP_UNITARIA | (unidad === 'kg' || unidad === 'ml' || input?.pesable ? CAP_PESABLE : 0),
                categoriaId: String(input?.categoriaId || ''),
                sinStock: Boolean(input?.sinStock),
                unidad,
                esCaja,
                unidadesPorCaja,
            };
            demoStore.productos.push(nuevo);
            demoStore.persist();
            return Promise.resolve(undefined as unknown as T);
        }
        case 'eliminar_producto': {
            const sku = String(args?.sku || '').toUpperCase();
            demoStore.productos = demoStore.productos.filter((p) => p.sku !== sku);
            demoStore.persist();
            return Promise.resolve(undefined as unknown as T);
        }
        case 'registrar_venta': {
            const items = args?.items as { sku: string; cantidad: string }[];
            const recibido = Number(args?.montoRecibidoBs || '0');
            let totalUsd = 0;
            const tasa = Number(demoStore.tasaActual.valor);
            items.forEach((item) => {
                const prod = demoStore.productos.find((p) => p.sku === item.sku);
                if (prod) {
                    const cant = Number(item.cantidad);
                    totalUsd += Number(prod.precioUsd) * cant;
                    prod.stock = String(Math.max(0, Number(prod.stock) - cant));
                }
            });
            const totalBs = totalUsd * tasa;
            const vueltoBs = Math.max(0, recibido - totalBs);
            demoStore.ventasTotalUsd += totalUsd;
            demoStore.ventasTotalBs += totalBs;
            const ahora = new Date();
            const horaStr = ahora.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
            const pagosRecibidos: PagoTicket[] = Array.isArray(args?.pagos) && args.pagos.length > 0
                ? (args.pagos as PagoTicket[])
                : [
                    {
                        metodo: recibido > 0 ? 'BS.EFEC.' : 'DOL.CASH',
                        moneda: recibido > 0 ? 'BS' : 'USD',
                        montoUsd: totalUsd.toFixed(2),
                        montoBs: totalBs.toFixed(2),
                    },
                ];
            const resVuelto = args?.resolucionVuelto as ResolucionVuelto | undefined;
            const estadoVuelto: EstadoVuelto = vueltoBs > 0.009 ? (resVuelto?.estado || 'PAGADO') : 'SIN_VUELTO';
            const metodoVuelto = estadoVuelto === 'PAGADO' ? (resVuelto?.metodo || 'BS.EFEC.') : undefined;
            const montoVueltoBs = vueltoBs > 0.009 ? (resVuelto?.montoBs || vueltoBs.toFixed(2)) : undefined;
            const montoVueltoUsd = vueltoBs > 0.009 ? (resVuelto?.montoUsd || (tasa > 0 ? (vueltoBs / tasa).toFixed(2) : '0.00')) : undefined;
            const tasaVuelto = estadoVuelto === 'PAGADO' ? resVuelto?.tasa : undefined;

            const opActual = demoStore.jornadaActual?.operadorActual || 'Caja Principal';
            const ticket: Ticket = {
                ventaId: 'TRX-' + Math.floor(10000 + Math.random() * 90000),
                totalUsd: totalUsd.toFixed(2),
                totalBs: totalBs.toFixed(2),
                tasaDelDia: tasa.toFixed(2),
                montoRecibidoBs: recibido.toFixed(2),
                vueltoBs: vueltoBs.toFixed(2),
                fechaHora: `Hoy, ${horaStr}`,
                fechaUnix: Math.floor(ahora.getTime() / 1000),
                canal: 'VENTA DIRECTA',
                operador: opActual,
                pagos: pagosRecibidos,
                estadoVuelto,
                metodoVuelto,
                montoVueltoBs,
                montoVueltoUsd,
                tasaVuelto,
                lineas: items.map((i) => {
                    const p = demoStore.productos.find((x) => x.sku === i.sku);
                    const subUsd = (Number(p?.precioUsd || 0) * Number(i.cantidad)).toFixed(2);
                    const subBs = (Number(subUsd) * tasa).toFixed(2);
                    return {
                        sku: i.sku,
                        nombre: p?.nombre || i.sku,
                        cantidad: i.cantidad,
                        precioUsd: p?.precioUsd || '0',
                        tasaBloqueada: tasa.toFixed(2),
                        subtotalUsd: subUsd,
                        subtotalBs: subBs,
                    };
                }),
            };
            demoStore.tickets.unshift(ticket);
            if (demoStore.jornadaActual) {
                const j = demoStore.jornadaActual;
                j.ventasTotalUsd = (parseNum(j.ventasTotalUsd) + totalUsd).toFixed(2);
                j.ventasTotalBs = (parseNum(j.ventasTotalBs) + totalBs).toFixed(2);
                j.ticketsEmitidos += 1;
                if (estadoVuelto === 'PAGADO') {
                    j.vueltoPagadoBs = (parseNum(j.vueltoPagadoBs) + vueltoBs).toFixed(2);
                } else if (estadoVuelto === 'RETENIDO') {
                    j.vueltoRetenidoBs = (parseNum(j.vueltoRetenidoBs) + vueltoBs).toFixed(2);
                }
            }
            demoStore.persist();
            return Promise.resolve(ticket as unknown as T);
        }
        case 'listar_cuentas':
            return Promise.resolve(demoStore.cuentas as unknown as T);
        case 'abrir_cuenta': {
            const etiqueta = String(args?.etiqueta || 'Mesa Demo').trim();
            const tipo = args?.tipo === 'deuda' ? 'deuda' : 'activa';
            const cliente = typeof args?.cliente === 'string' ? args.cliente.trim() : undefined;
            const nota = typeof args?.nota === 'string' ? args.nota.trim() : undefined;
            const ahora = new Date();
            const horaStr = ahora.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
            const fechaStr = `${ahora.toLocaleDateString('es-VE')} ${horaStr}`;
            const c: CuentaAbierta = {
                ventaId: (tipo === 'deuda' ? 'DEU-' : 'CTA-') + Math.random().toString(36).slice(2, 8).toUpperCase(),
                etiqueta,
                tipo,
                cliente,
                nota,
                fechaCreacionUnix: Math.floor(ahora.getTime() / 1000),
                fechaCreacionStr: fechaStr,
                totalParcialUsd: '0.00',
                totalParcialBs: '0.00',
                abonosUsd: '0.00',
                abonosBs: '0.00',
                lineas: 0,
                consumos: [],
            };
            demoStore.cuentas.push(c);
            demoStore.persist();
            return Promise.resolve(c as unknown as T);
        }
        case 'agregar_consumo': {
            const ventaId = String(args?.ventaId || '');
            const sku = String(args?.sku || '').trim().toUpperCase();
            const cant = parseNum(args?.cantidad) || 1;
            const cuenta = demoStore.cuentas.find((c) => c.ventaId === ventaId);
            const prod = demoStore.productos.find((p) => p.sku.trim().toUpperCase() === sku);
            if (cuenta && prod) {
                // Descuento inmediato de stock físico si el producto controla inventario
                if (!prod.sinStock) {
                    const st = parseNum(prod.stock);
                    if (st < cant) {
                        return Promise.reject(new Error(`Stock insuficiente para "${prod.nombre}". Disponible: ${st} ${prod.unidad || 'un.'}`));
                    }
                    prod.stock = String(Math.max(0, st - cant));
                }

                if (!Array.isArray(cuenta.consumos)) cuenta.consumos = [];
                const precioU = parseNum(prod.precioUsd);
                const subUsd = precioU * cant;
                const tasa = parseNum(demoStore.tasaActual.valor) || 807.39;

                const existente = cuenta.consumos.find((x) => x.sku.trim().toUpperCase() === prod.sku.trim().toUpperCase());
                if (existente) {
                    existente.cantidad += cant;
                    existente.subtotalUsd = (existente.cantidad * parseNum(existente.precioUsd)).toFixed(2);
                } else {
                    cuenta.consumos.push({
                        id: 'con-' + Math.random().toString(36).slice(2, 8),
                        sku: prod.sku,
                        nombre: prod.nombre,
                        cantidad: cant,
                        precioUsd: precioU.toFixed(2),
                        subtotalUsd: subUsd.toFixed(2),
                    });
                }
                const nuevoTotU = cuenta.consumos.reduce((acc, it) => acc + parseNum(it.subtotalUsd), 0);
                cuenta.totalParcialUsd = nuevoTotU.toFixed(2);
                cuenta.totalParcialBs = (nuevoTotU * tasa).toFixed(2);
                cuenta.lineas = cuenta.consumos.length;
                demoStore.persist();
                return Promise.resolve(cuenta as unknown as T);
            }
            return Promise.resolve(cuenta as unknown as T);
        }
        case 'eliminar_consumo': {
            const ventaId = String(args?.ventaId || '');
            const consumoId = String(args?.consumoId || '');
            const cuenta = demoStore.cuentas.find((c) => c.ventaId === ventaId);
            if (cuenta && Array.isArray(cuenta.consumos)) {
                const idx = cuenta.consumos.findIndex((x) => x.id === consumoId);
                if (idx !== -1) {
                    const item = cuenta.consumos[idx];
                    // Reintegrar stock físico al inventario si el producto no es sinStock
                    const prod = demoStore.productos.find((p) => p.sku.trim().toUpperCase() === item.sku.trim().toUpperCase());
                    if (prod && !prod.sinStock) {
                        prod.stock = String(parseNum(prod.stock) + item.cantidad);
                    }
                    cuenta.consumos.splice(idx, 1);
                    const tasa = parseNum(demoStore.tasaActual.valor) || 807.39;
                    const nuevoTotU = cuenta.consumos.reduce((acc, it) => acc + parseNum(it.subtotalUsd), 0);
                    cuenta.totalParcialUsd = nuevoTotU.toFixed(2);
                    cuenta.totalParcialBs = (nuevoTotU * tasa).toFixed(2);
                    cuenta.lineas = cuenta.consumos.length;
                    demoStore.persist();
                }
                return Promise.resolve(cuenta as unknown as T);
            }
            return Promise.resolve(cuenta as unknown as T);
        }
        case 'cerrar_cuenta': {
            const ventaId = String(args?.ventaId || '');
            const idx = demoStore.cuentas.findIndex((c) => c.ventaId === ventaId);
            const cuenta = idx !== -1 ? demoStore.cuentas[idx] : null;
            let totalUsd = '0.00';
            let totalBs = '0.00';
            let lineas: LineaTicket[] = [];
            let saldoAFavorConsolidadoUsd = 0;
            const tasaParam = parseNum(args?.tasaCobro);
            const tasa = tasaParam > 0 ? tasaParam : (Number(demoStore.tasaActual.valor) || 807.39);
            const esDeuda = cuenta?.tipo === 'deuda';
            if (cuenta) {
                const totalConsumosU = Number(cuenta.totalParcialUsd);
                const totalAbonadoU = Number(cuenta.abonosUsd || '0');
                const saldoAFavorU = Math.max(0, totalAbonadoU - totalConsumosU);
                saldoAFavorConsolidadoUsd = saldoAFavorU;

                const ingresoTotalCuentaUsd = Math.max(totalConsumosU, totalAbonadoU);
                totalUsd = ingresoTotalCuentaUsd.toFixed(2);
                totalBs = (ingresoTotalCuentaUsd * tasa).toFixed(2);

                demoStore.cuentas.splice(idx, 1);
                demoStore.ventasTotalUsd += ingresoTotalCuentaUsd;
                demoStore.ventasTotalBs += ingresoTotalCuentaUsd * tasa;

                lineas = (cuenta.consumos || []).map((c) => ({
                    sku: c.sku,
                    nombre: c.nombre,
                    cantidad: String(c.cantidad),
                    precioUsd: c.precioUsd,
                    tasaBloqueada: tasa.toFixed(4),
                    subtotalUsd: c.subtotalUsd,
                    subtotalBs: (Number(c.subtotalUsd) * tasa).toFixed(2),
                }));

                if (saldoAFavorU > 0) {
                    lineas.push({
                        sku: 'GANANCIA-EXCEDENTE',
                        nombre: 'Saldo a Favor Consolidado como Ganancia (Excedente Retenido)',
                        cantidad: '1',
                        precioUsd: saldoAFavorU.toFixed(2),
                        tasaBloqueada: tasa.toFixed(4),
                        subtotalUsd: saldoAFavorU.toFixed(2),
                        subtotalBs: (saldoAFavorU * tasa).toFixed(2),
                    });
                }
            }
            const ahora = new Date();
            const horaStr = ahora.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
            const pagosRecibidos: PagoTicket[] = Array.isArray(args?.pagos) && args.pagos.length > 0
                ? (args.pagos as PagoTicket[])
                : [
                    {
                        metodo: esDeuda ? 'TRANSF.BS.' : 'BS.EFEC.',
                        moneda: 'BS',
                        montoUsd: totalUsd,
                        montoBs: totalBs,
                    },
                ];
            const montoRecibidoBsNum = Number(args?.montoRecibidoBs || totalBs);
            const vueltoBs = Math.max(0, montoRecibidoBsNum - Number(totalBs));
            const resVuelto = args?.resolucionVuelto as ResolucionVuelto | undefined;
            const estadoVuelto: EstadoVuelto = vueltoBs > 0.009 ? (resVuelto?.estado || 'PAGADO') : 'SIN_VUELTO';
            const metodoVuelto = estadoVuelto === 'PAGADO' ? (resVuelto?.metodo || (esDeuda ? 'TRANSF.BS.' : 'BS.EFEC.')) : undefined;
            const montoVueltoBs = vueltoBs > 0.009 ? (resVuelto?.montoBs || vueltoBs.toFixed(2)) : undefined;
            const montoVueltoUsd = vueltoBs > 0.009 ? (resVuelto?.montoUsd || (tasa > 0 ? (vueltoBs / tasa).toFixed(2) : '0.00')) : undefined;
            const tasaVuelto = estadoVuelto === 'PAGADO' ? resVuelto?.tasa : undefined;

            const opActual = demoStore.jornadaActual?.operadorActual || 'Caja Principal';
            const ticket: Ticket = {
                ventaId: ventaId || (esDeuda ? 'DEU-' : 'CTA-') + Math.floor(10000 + Math.random() * 90000),
                totalUsd,
                totalBs,
                tasaDelDia: tasa.toFixed(4),
                montoRecibidoBs: montoRecibidoBsNum.toFixed(2),
                vueltoBs: vueltoBs.toFixed(2),
                fechaHora: `Hoy, ${horaStr}`,
                fechaUnix: Math.floor(ahora.getTime() / 1000),
                canal: esDeuda ? 'LIQUIDACIÓN DE DEUDA' : 'CONSUMO EN CUENTA',
                operador: opActual,
                saldoAFavorConsolidadoUsd: saldoAFavorConsolidadoUsd > 0 ? saldoAFavorConsolidadoUsd.toFixed(2) : undefined,
                pagos: pagosRecibidos,
                estadoVuelto,
                metodoVuelto,
                montoVueltoBs,
                montoVueltoUsd,
                tasaVuelto,
                lineas,
            };
            demoStore.tickets.unshift(ticket);
            if (demoStore.jornadaActual) {
                const j = demoStore.jornadaActual;
                const totU = parseNum(totalUsd);
                const totB = parseNum(totalBs);
                j.ventasTotalUsd = (parseNum(j.ventasTotalUsd) + totU).toFixed(2);
                j.ventasTotalBs = (parseNum(j.ventasTotalBs) + totB).toFixed(2);
                j.ticketsEmitidos += 1;
                if (esDeuda) {
                    j.deudasLiquidadasUsd = (parseNum(j.deudasLiquidadasUsd) + totU).toFixed(2);
                }
                if (estadoVuelto === 'PAGADO') {
                    j.vueltoPagadoBs = (parseNum(j.vueltoPagadoBs) + vueltoBs).toFixed(2);
                } else if (estadoVuelto === 'RETENIDO') {
                    j.vueltoRetenidoBs = (parseNum(j.vueltoRetenidoBs) + vueltoBs).toFixed(2);
                }
            }
            demoStore.persist();
            return Promise.resolve(ticket as unknown as T);
        }
        case 'listar_categorias':
            return Promise.resolve(demoStore.categorias as unknown as T);
        case 'crear_categoria': {
            const nombre = String(args?.nombre || '').trim();
            const id = 'cat-' + Math.random().toString(36).slice(2, 7);
            demoStore.categorias.push({ id, nombre });
            demoStore.persist();
            return Promise.resolve(demoStore.categorias as unknown as T);
        }
        case 'eliminar_categoria': {
            const id = String(args?.id || '');
            demoStore.categorias = demoStore.categorias.filter((c) => c.id !== id);
            demoStore.persist();
            return Promise.resolve(demoStore.categorias as unknown as T);
        }
        case 'listar_tasas_impuestos':
            return Promise.resolve(demoStore.tasasImpuestos as unknown as T);
        case 'crear_tasa_impuesto': {
            const nombre = String(args?.nombre || '').trim();
            const porcentaje = Number(args?.porcentaje || 0);
            const id = 'tax-' + Math.random().toString(36).slice(2, 7);
            demoStore.tasasImpuestos.push({ id, nombre, porcentaje });
            demoStore.persist();
            return Promise.resolve(demoStore.tasasImpuestos as unknown as T);
        }
        case 'eliminar_tasa_impuesto': {
            const id = String(args?.id || '');
            demoStore.tasasImpuestos = demoStore.tasasImpuestos.filter((t) => t.id !== id);
            demoStore.persist();
            return Promise.resolve(demoStore.tasasImpuestos as unknown as T);
        }
        case 'abonar_cuenta': {
            const ventaId = String(args?.ventaId || '');
            const montoUsd = Number(args?.montoUsd || 0);
            const montoBsAporte = Number(args?.montoBs || 0);
            const cuenta = demoStore.cuentas.find((c) => c.ventaId === ventaId);
            if (cuenta && Number.isFinite(montoUsd) && montoUsd > 0 && montoUsd <= 50000) {
                const tasa = Number(demoStore.tasaActual.valor);
                const prevAbonoUsd = Number(cuenta.abonosUsd || '0');
                const prevAbonoBs = Number(cuenta.abonosBs || '0');
                if (montoBsAporte > 0) {
                    const nuevoAbonoBs = prevAbonoBs + montoBsAporte;
                    cuenta.abonosBs = nuevoAbonoBs.toFixed(2);
                    cuenta.abonosUsd = (tasa > 0 ? nuevoAbonoBs / tasa : 0).toFixed(2);
                } else {
                    const nuevoAbonoUsd = prevAbonoUsd + montoUsd;
                    cuenta.abonosUsd = nuevoAbonoUsd.toFixed(2);
                    cuenta.abonosBs = (nuevoAbonoUsd * tasa).toFixed(2);
                }
                demoStore.persist();
            }
            return Promise.resolve(cuenta as unknown as T);
        }
        case 'editar_abono_cuenta': {
            const ventaId = String(args?.ventaId || '');
            const nuevoAbonoUsd = Math.max(0, Math.min(50000, Number(args?.nuevoAbonoUsd || 0)));
            const cuenta = demoStore.cuentas.find((c) => c.ventaId === ventaId);
            if (cuenta && Number.isFinite(nuevoAbonoUsd)) {
                const tasa = Number(demoStore.tasaActual.valor);
                cuenta.abonosUsd = nuevoAbonoUsd.toFixed(2);
                cuenta.abonosBs = (nuevoAbonoUsd * tasa).toFixed(2);
                demoStore.persist();
            }
            return Promise.resolve(cuenta as unknown as T);
        }
        case 'datos_panel': {
            const tasa = Number(demoStore.tasaActual.valor);
            const totalVentasUsd = demoStore.ventasTotalUsd;
            const totalVentasBs = demoStore.ventasTotalBs;
            // Cálculo financiero: margen promedio del 30% e impuestos del 12% sobre ventas
            const costoTotalUsd = totalVentasUsd * 0.65;
            const gananciaBrutaUsd = totalVentasUsd - costoTotalUsd;
            const impuestosUsd = totalVentasUsd * 0.12;
            const gananciaNetaUsd = gananciaBrutaUsd - impuestosUsd;
            const gananciaNetaSinImpUsd = gananciaBrutaUsd;
            const gananciaNetaBs = gananciaNetaUsd * tasa;

            // Auditoría y agregación analítica de todos los productos comercializados
            const conteoPorSku: Record<string, { qty: number; monto: number; nombre: string }> = {};
            // Agregar ventas reales desde los tickets
            demoStore.tickets.forEach((t) => {
                t.lineas.forEach((l) => {
                    if (!conteoPorSku[l.sku]) {
                        conteoPorSku[l.sku] = { qty: 0, monto: 0, nombre: l.nombre };
                    }
                    conteoPorSku[l.sku].qty += Number(l.cantidad) || 1;
                    conteoPorSku[l.sku].monto += Number(l.subtotalUsd) || 0;
                });
            });

            // Complementar con productos del catálogo para que todos sean visibles en la analítica
            demoStore.productos.forEach((p, idx) => {
                if (!conteoPorSku[p.sku]) {
                    const cantEst = Math.max(1, 14 - idx * 2);
                    conteoPorSku[p.sku] = {
                        qty: cantEst,
                        monto: cantEst * Number(p.precioUsd),
                        nombre: p.nombre,
                    };
                }
            });

            const listaArticulos = Object.values(conteoPorSku).sort((a, b) => b.monto - a.monto);
            const sumaTotalMagnitud = listaArticulos.reduce((acc, curr) => acc + curr.monto, 0) || 1;

            const top = listaArticulos.map((item) => ({
                nombre: item.nombre,
                cantidad: String(item.qty),
                totalUsd: item.monto.toFixed(2),
                porcentaje: ((item.monto / sumaTotalMagnitud) * 100).toFixed(1),
            }));

            const tasaActualNum = Number(demoStore.tasaActual.valor) || 807.39;
            let totalGeneralBrutoUsd = 0;
            const mapaCategorias: Record<string, {
                categoriaId: string;
                nombre: string;
                cantidadProductos: number;
                unidadesStock: number;
                brutoUsd: number;
                ventaUsd: number;
            }> = {};

            demoStore.categorias.forEach((c) => {
                mapaCategorias[c.id] = {
                    categoriaId: c.id,
                    nombre: c.nombre,
                    cantidadProductos: 0,
                    unidadesStock: 0,
                    brutoUsd: 0,
                    ventaUsd: 0,
                };
            });
            if (!mapaCategorias['cat-general']) {
                mapaCategorias['cat-general'] = {
                    categoriaId: 'cat-general',
                    nombre: 'General',
                    cantidadProductos: 0,
                    unidadesStock: 0,
                    brutoUsd: 0,
                    ventaUsd: 0,
                };
            }

            demoStore.productos.forEach((p) => {
                const catId = (p.categoriaId && mapaCategorias[p.categoriaId]) ? p.categoriaId : 'cat-general';
                const itemCat = mapaCategorias[catId];
                itemCat.cantidadProductos += 1;
                const stock = p.sinStock ? 0 : (Number(p.stock) || 0);
                const brutoUnit = Number(p.precioBrutoUsd) > 0 ? Number(p.precioBrutoUsd) : (Number(p.precioUsd) * 0.65);
                const ventaUnit = Number(p.precioUsd) || 0;
                const subBruto = stock * brutoUnit;
                const subVenta = stock * ventaUnit;
                itemCat.unidadesStock += stock;
                itemCat.brutoUsd += subBruto;
                itemCat.ventaUsd += subVenta;
                totalGeneralBrutoUsd += subBruto;
            });

            const dineroPorCategoria: CategoriaDineroBruto[] = Object.values(mapaCategorias)
                .filter((c) => c.cantidadProductos > 0 || c.brutoUsd > 0)
                .map((c) => {
                    const margenUsd = Math.max(0, c.ventaUsd - c.brutoUsd);
                    const margenPct = c.ventaUsd > 0 ? ((margenUsd / c.ventaUsd) * 100).toFixed(1) : '0.0';
                    const pctCap = totalGeneralBrutoUsd > 0 ? ((c.brutoUsd / totalGeneralBrutoUsd) * 100).toFixed(1) : '0.0';
                    return {
                        categoriaId: c.categoriaId,
                        nombre: c.nombre,
                        cantidadProductos: c.cantidadProductos,
                        unidadesStock: Math.round(c.unidadesStock * 100) / 100,
                        dineroBrutoUsd: c.brutoUsd.toFixed(2),
                        dineroBrutoBs: (c.brutoUsd * tasaActualNum).toFixed(2),
                        dineroVentaUsd: c.ventaUsd.toFixed(2),
                        dineroVentaBs: (c.ventaUsd * tasaActualNum).toFixed(2),
                        margenBrutoProyectadoUsd: margenUsd.toFixed(2),
                        margenBrutoPct: margenPct,
                        porcentajeCapital: pctCap,
                    };
                })
                .sort((a, b) => Number(b.dineroBrutoUsd) - Number(a.dineroBrutoUsd));

            const deudasLista = demoStore.cuentas.filter((c) => c.tipo === 'deuda');
            const cuentasActivasLista = demoStore.cuentas.filter((c) => c.tipo !== 'deuda');
            const dineroEnLaCalleUsd = deudasLista.reduce((acc, c) => acc + Math.max(0, parseNum(c.totalParcialUsd) - parseNum(c.abonosUsd)), 0);
            const dineroEnLaCalleBs = dineroEnLaCalleUsd * tasaActualNum;

            const panel: PanelDatos = {
                ventas24hUsd: totalVentasUsd.toFixed(2),
                ventas24hBs: totalVentasBs.toFixed(2),
                tickets24h: Math.max(demoStore.tickets.length, 18),
                valorInventarioUsd: demoStore.productos
                    .reduce((a, p) => a + Number(p.precioUsd) * Number(p.stock), 0)
                    .toFixed(2),
                costoTotalUsd: costoTotalUsd.toFixed(2),
                gananciaBrutaUsd: gananciaBrutaUsd.toFixed(2),
                gananciaNetaUsd: gananciaNetaUsd.toFixed(2),
                gananciaNetaSinImpUsd: gananciaNetaSinImpUsd.toFixed(2),
                gananciaNetaBs: gananciaNetaBs.toFixed(2),
                cuentasAbiertas: cuentasActivasLista.length,
                deudasAbiertas: deudasLista.length,
                dineroEnLaCalleUsd: dineroEnLaCalleUsd.toFixed(2),
                dineroEnLaCalleBs: dineroEnLaCalleBs.toFixed(2),
                criticos: demoStore.productos
                    .filter((p) => !p.sinStock && Number(p.stock) <= 5)
                    .map((p) => ({ sku: p.sku, nombre: p.nombre, stock: p.stock })),
                topProductos: top,
                dineroPorCategoria,
            };
            return Promise.resolve(panel as unknown as T);
        }
        case 'compra_stock': {
            const sku = String(args?.sku || '');
            const cant = Number(args?.cantidad || '0');
            const prod = demoStore.productos.find((p) => p.sku === sku);
            if (prod && Number.isFinite(cant) && cant > 0) {
                prod.stock = String(Number(prod.stock) + cant);
                demoStore.persist();
                return Promise.resolve(prod.stock as unknown as T);
            }
            return Promise.resolve('0' as unknown as T);
        }
        case 'reducir_stock': {
            const sku = String(args?.sku || '');
            const cant = Number(args?.cantidad || '0');
            const prod = demoStore.productos.find((p) => p.sku === sku);
            if (prod && Number.isFinite(cant) && cant > 0) {
                prod.stock = String(Math.max(0, Number(prod.stock) - cant));
                demoStore.persist();
                return Promise.resolve(prod.stock as unknown as T);
            }
            return Promise.resolve('0' as unknown as T);
        }
        case 'registrar_merma': {
            const sku = String(args?.sku || '');
            const cant = Number(args?.cantidad || '0');
            const prod = demoStore.productos.find((p) => p.sku === sku);
            if (prod && Number.isFinite(cant) && cant > 0) {
                prod.stock = String(Math.max(0, Number(prod.stock) - cant));
                demoStore.persist();
                return Promise.resolve(prod.stock as unknown as T);
            }
            return Promise.resolve('0' as unknown as T);
        }
        case 'listar_dispositivos':
            return Promise.resolve(demoStore.dispositivos as unknown as T);
        case 'registrar_dispositivo': {
            const nombre = String(args?.nombre || 'Dispositivo Móvil').trim();
            const id = 'dev-' + Math.random().toString(36).slice(2, 7);
            const dev: DispositivoRemoto = {
                id,
                nombre,
                ip: '192.168.1.' + Math.floor(Math.random() * 200 + 20),
                ultimoAcceso: 'Ahora mismo',
                activo: true,
            };
            demoStore.dispositivos.push(dev);
            demoStore.persist();
            return Promise.resolve(demoStore.dispositivos as unknown as T);
        }
        case 'revocar_dispositivo': {
            const id = String(args?.id || '');
            demoStore.dispositivos = demoStore.dispositivos.filter((d) => d.id !== id);
            demoStore.persist();
            return Promise.resolve(demoStore.dispositivos as unknown as T);
        }
        case 'listar_respaldos':
            return Promise.resolve(demoStore.respaldos as unknown as T);
        case 'crear_respaldo': {
            const id = 'bk-' + Math.random().toString(36).slice(2, 7);
            const totalRegs = demoStore.productos.length + demoStore.cuentas.length + demoStore.categorias.length;
            const now = new Date();
            const nomNegocio = (demoStore.config?.nombre || 'DATIOLABS')
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '-')
                .replace(/-+/g, '-')
                .slice(0, 30);
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const hh = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            const archivoNombre = `${nomNegocio}-${yyyy}${mm}${dd}-${hh}${min}${ss}.datio`;

            const resp: RespaldoInfo = {
                id,
                fecha: 'Ahora mismo',
                archivoNombre,
                registros: totalRegs,
                tamanoKb: Math.round(totalRegs * 0.4 + 10),
                checksumSha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            };
            demoStore.respaldos.unshift(resp);
            demoStore.persist();
            return Promise.resolve(resp as unknown as T);
        }
        case 'restaurar_desde_respaldo': {
            // Restaurar datos limpios: catálogo, inventario, categorías, cuentas y tasas
            // IMPORTANTE: Las conexiones móviles y sesiones P2P quedan estrictamente purgadas (dispositivos = [])
            demoStore.dispositivos = [];
            demoStore.persist();
            return Promise.resolve(true as unknown as T);
        }
        case 'obtener_licencia':
            return Promise.resolve(demoStore.licencia as unknown as T);
        case 'obtener_tasa_bcv':
            return Promise.resolve(demoStore.tasaActual as unknown as T);
        case 'forzar_actualizacion_tasa':
            return demoStore.refrescarTasaEnVivo().then(() => demoStore.tasaActual as unknown as T);
        case 'listar_historico_tasas':
            return Promise.resolve(demoStore.historicoTasas as unknown as T);
        case 'fijar_tasa_manual': {
            const nueva = String(args?.tasa || '0');
            const numNueva = Number(nueva);
            const numAnt = Number(demoStore.tasaActual.valor);
            let diffPct: string | null = null;
            let dir: 'subio' | 'bajo' | 'estable' | null = null;
            if (Number.isFinite(numAnt) && numAnt > 0 && Number.isFinite(numNueva) && numNueva > 0 && numAnt !== numNueva) {
                const pct = ((numNueva - numAnt) / numAnt) * 100;
                diffPct = Math.abs(pct).toFixed(2);
                dir = pct > 0 ? 'subio' : 'bajo';
            }
            demoStore.tasaActual = {
                valor: numNueva.toFixed(4),
                fechaUnix: Math.floor(Date.now() / 1000),
                fluctuacionPct: diffPct,
                direccion: dir,
            };
            const ahora = new Date();
            const horaStr = ahora.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
            demoStore.historicoTasas.unshift({
                id: 'tx-' + Math.random().toString(36).slice(2, 7),
                valor: numNueva.toFixed(4),
                fechaHora: `Hoy, ${horaStr}`,
                tipo: 'manual',
                motivo: 'Ajuste manual por el usuario',
            });
            if (demoStore.historicoTasas.length > 50) demoStore.historicoTasas.pop();
            demoStore.persist();
            return Promise.resolve(demoStore.tasaActual as unknown as T);
        }
        case 'listar_ventas':
            return Promise.resolve(demoStore.tickets as unknown as T);
        case 'listar_metodos_pago': {
            demoStore.metodosPago.sort((a, b) => (a.moneda === b.moneda ? 0 : a.moneda === 'BS' ? -1 : 1));
            return Promise.resolve(demoStore.metodosPago as unknown as T);
        }
        case 'crear_metodo_pago': {
            const raw = String(args?.nombre || '').trim().toUpperCase().replace(/[^A-Z0-9. _-]/g, '').slice(0, 25);
            const moneda: MonedaMetodo = args?.moneda === 'USD' ? 'USD' : 'BS';
            if (raw && !demoStore.metodosPago.some((m) => m.nombre === raw)) {
                demoStore.metodosPago.push({ nombre: raw, moneda });
                demoStore.metodosPago.sort((a, b) => (a.moneda === b.moneda ? 0 : a.moneda === 'BS' ? -1 : 1));
                demoStore.persist();
            }
            return Promise.resolve(demoStore.metodosPago as unknown as T);
        }
        case 'eliminar_metodo_pago': {
            const nombre = String(args?.nombre || '').trim().toUpperCase();
            if (nombre) {
                demoStore.metodosPago = demoStore.metodosPago.filter((m) => m.nombre !== nombre);
                // Garantizar al menos un método por contingencia
                if (demoStore.metodosPago.length === 0) {
                    demoStore.metodosPago.push({ nombre: 'PUNTOD.VENTA', moneda: 'BS' });
                }
                demoStore.persist();
            }
            return Promise.resolve(demoStore.metodosPago as unknown as T);
        }
        case 'listar_operadores':
            return Promise.resolve(demoStore.operadores as unknown as T);
        case 'crear_operador': {
            const nombre = String(args?.nombre || '').trim();
            if (nombre) {
                const op: OperadorInfo = {
                    id: 'op-' + Math.random().toString(36).slice(2, 7),
                    nombre,
                    activo: true,
                    creadoUnix: Math.floor(Date.now() / 1000),
                };
                demoStore.operadores.push(op);
                demoStore.persist();
            }
            return Promise.resolve(demoStore.operadores as unknown as T);
        }
        case 'editar_operador': {
            const id = String(args?.id || '');
            const nuevoNombre = String(args?.nombre || '').trim();
            if (id && nuevoNombre) {
                const op = demoStore.operadores.find((o) => o.id === id);
                if (op) {
                    const nombreViejo = op.nombre;
                    op.nombre = nuevoNombre;
                    if (demoStore.jornadaActual) {
                        if (demoStore.jornadaActual.operadorActual === nombreViejo) {
                            demoStore.jornadaActual.operadorActual = nuevoNombre;
                        }
                        if (demoStore.jornadaActual.operadoresActivos) {
                            demoStore.jornadaActual.operadoresActivos = demoStore.jornadaActual.operadoresActivos.map((n) => n === nombreViejo ? nuevoNombre : n);
                        }
                        if (demoStore.jornadaActual.operadoresRelevo) {
                            demoStore.jornadaActual.operadoresRelevo = demoStore.jornadaActual.operadoresRelevo.map((n) => n === nombreViejo ? nuevoNombre : n);
                        }
                    }
                    demoStore.persist();
                }
            }
            return Promise.resolve(demoStore.operadores as unknown as T);
        }
        case 'eliminar_operador': {
            const id = String(args?.id || '');
            if (id) {
                const op = demoStore.operadores.find((o) => o.id === id);
                const nombreEliminado = op?.nombre;
                demoStore.operadores = demoStore.operadores.filter((o) => o.id !== id);
                if (demoStore.jornadaActual && nombreEliminado) {
                    if (demoStore.jornadaActual.operadoresActivos) {
                        demoStore.jornadaActual.operadoresActivos = demoStore.jornadaActual.operadoresActivos.filter((n) => n !== nombreEliminado);
                    }
                    if (demoStore.jornadaActual.operadorActual === nombreEliminado) {
                        demoStore.jornadaActual.operadorActual = demoStore.jornadaActual.operadoresActivos?.[0] || demoStore.operadores[0]?.nombre || 'Cajero Principal';
                    }
                }
                demoStore.persist();
            }
            return Promise.resolve(demoStore.operadores as unknown as T);
        }
        case 'alternar_operador': {
            const id = String(args?.id || '');
            const op = demoStore.operadores.find((o) => o.id === id);
            if (op) {
                op.activo = !op.activo;
                demoStore.persist();
            }
            return Promise.resolve(demoStore.operadores as unknown as T);
        }
        case 'obtener_jornada_actual':
            return Promise.resolve(demoStore.jornadaActual as unknown as T);
        case 'listar_historico_jornadas':
            return Promise.resolve(demoStore.historicoJornadas as unknown as T);
        case 'abrir_jornada': {
            const operador = String(args?.operador || 'Cajero Principal').trim();
            const operadoresLista: string[] = Array.isArray(args?.operadores) && args.operadores.length > 0
                ? args.operadores.map((x: unknown) => String(x).trim()).filter(Boolean)
                : [operador];
            const ahora = new Date();
            const horaStr = ahora.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
            const fechaStr = `${ahora.toLocaleDateString('es-VE')} ${horaStr}`;
            const yyyy = ahora.getFullYear();
            const mm = String(ahora.getMonth() + 1).padStart(2, '0');
            const dd = String(ahora.getDate()).padStart(2, '0');
            const tasaActual = demoStore.tasaActual.valor;
            const jornada: JornadaLaboral = {
                id: `JOR-${yyyy}${mm}${dd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
                estado: 'abierta',
                inicioUnix: Math.floor(Date.now() / 1000),
                inicioStr: `Hoy, ${horaStr} (${fechaStr})`,
                operadorInicial: operadoresLista[0] || operador,
                operadorActual: operadoresLista.join(', '),
                operadoresActivos: operadoresLista,
                operadoresRelevo: [...operadoresLista],
                tasaInicio: tasaActual,
                ventasTotalUsd: '0.00',
                ventasTotalBs: '0.00',
                ticketsEmitidos: 0,
                vueltoPagadoBs: '0.00',
                vueltoRetenidoBs: '0.00',
                deudasLiquidadasUsd: '0.00',
                entradasStockReg: 0,
                mermasStockReg: 0,
                cambiosPrecioReg: 0,
            };
            demoStore.jornadaActual = jornada;
            demoStore.persist();
            return Promise.resolve(jornada as unknown as T);
        }
        case 'asignar_operadores_turno': {
            const ops: string[] = Array.isArray(args?.operadores)
                ? args.operadores.map((x: unknown) => String(x).trim()).filter(Boolean)
                : [];
            if (demoStore.jornadaActual) {
                demoStore.jornadaActual.operadoresActivos = ops;
                demoStore.jornadaActual.operadorActual = ops.length > 0 ? ops.join(', ') : 'Sin operador asignado';
                ops.forEach((o) => {
                    if (!demoStore.jornadaActual?.operadoresRelevo.includes(o)) {
                        demoStore.jornadaActual?.operadoresRelevo.push(o);
                    }
                });
                demoStore.persist();
            }
            return Promise.resolve(demoStore.jornadaActual as unknown as T);
        }
        case 'relevar_operador_jornada': {
            const nuevoOperador = String(args?.operador || '').trim();
            if (demoStore.jornadaActual && nuevoOperador) {
                demoStore.jornadaActual.operadorActual = nuevoOperador;
                demoStore.jornadaActual.operadoresActivos = [nuevoOperador];
                if (!demoStore.jornadaActual.operadoresRelevo.includes(nuevoOperador)) {
                    demoStore.jornadaActual.operadoresRelevo.push(nuevoOperador);
                }
                demoStore.persist();
            }
            return Promise.resolve(demoStore.jornadaActual as unknown as T);
        }
        case 'cerrar_jornada': {
            if (!demoStore.jornadaActual) {
                return Promise.reject(new Error('No existe una jornada laboral abierta para cerrar.'));
            }
            const ahora = new Date();
            const horaStr = ahora.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
            const fechaStr = `${ahora.toLocaleDateString('es-VE')} ${horaStr}`;
            const jor = demoStore.jornadaActual;
            jor.estado = 'cerrada';
            jor.finUnix = Math.floor(Date.now() / 1000);
            jor.finStr = `${fechaStr}`;
            jor.tasaFin = demoStore.tasaActual.valor;
            // Sellado con Checksum SHA-256
            jor.checksumSha256 = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            demoStore.historicoJornadas.unshift(jor);
            demoStore.jornadaActual = null;
            demoStore.persist();
            return Promise.resolve(jor as unknown as T);
        }
        case 'obtener_semaforo_stock':
            return Promise.resolve(demoStore.semaforoStock as unknown as T);
        case 'guardar_semaforo_stock': {
            const rojo = Math.max(1, Number(args?.rojoMax) || 5);
            const amarillo = Math.max(rojo + 1, Number(args?.amarilloMax) || 15);
            demoStore.semaforoStock = { rojoMax: rojo, amarilloMax: amarillo };
            demoStore.persist();
            return Promise.resolve(demoStore.semaforoStock as unknown as T);
        }
        default:
            return Promise.resolve(null as unknown as T);
    }
}

export const api = {
    config: () => invocar<ConfigInfo | null>('obtener_config'),
    inicializar: (nombre: string, rubros: number, pin: string) =>
        invocar<void>('inicializar_negocio', { nombre, rubros, pinDueno: pin || null }),
    validarPin: (pin: string) => invocar<boolean>('validar_pin_dueno', { pin }),
    productos: () => invocar<ProductoInfo[]>('listar_productos'),
    crearProducto: (p: {
        sku?: string; nombre: string; precioBrutoUsd?: string; margenPct?: string;
        precioUsd: string; impuestoPct: string; stockInicial: string;
        pesable: boolean; alcoholica: boolean; categoriaId?: string; sinStock?: boolean;
        unidad?: 'un' | 'kg' | 'ml'; esCaja?: boolean; unidadesPorCaja?: number;
    }) => {
        const sku = p.sku && p.sku.trim() ? p.sku.trim().toUpperCase() : 'PROD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        return invocar<void>('crear_producto', { input: { ...p, sku } });
    },
    eliminarProducto: (sku: string) => invocar<void>('eliminar_producto', { sku }),
    registrarVenta: (
        items: { sku: string; cantidad: string }[],
        mayor: boolean,
        recibido: string,
        pagos?: PagoTicket[],
        resolucionVuelto?: ResolucionVuelto,
    ) =>
        invocar<Ticket>('registrar_venta', { items, clienteMayorEdad: mayor, montoRecibidoBs: recibido, pagos, resolucionVuelto }),
    abrirCuenta: (etiqueta: string, tipo?: 'activa' | 'deuda', nota?: string, cliente?: string) =>
        invocar<CuentaAbierta>('abrir_cuenta', { etiqueta, tipo, nota, cliente }),
    cuentas: () => invocar<CuentaAbierta[]>('listar_cuentas'),
    agregarConsumo: (ventaId: string, sku: string, cantidad: string, mayor: boolean) =>
        invocar<CuentaAbierta>('agregar_consumo', { ventaId, sku, cantidad, clienteMayorEdad: mayor }),
    eliminarConsumo: (ventaId: string, consumoId: string) =>
        invocar<CuentaAbierta>('eliminar_consumo', { ventaId, consumoId }),
    abonarCuenta: (ventaId: string, montoUsd: number, montoBs?: number) =>
        invocar<CuentaAbierta>('abonar_cuenta', { ventaId, montoUsd, montoBs }),
    editarAbonoCuenta: (ventaId: string, nuevoAbonoUsd: number) =>
        invocar<CuentaAbierta>('editar_abono_cuenta', { ventaId, nuevoAbonoUsd }),
    cerrarCuenta: (
        ventaId: string,
        recibido: string,
        tasaCobro?: string,
        pagos?: PagoTicket[],
        resolucionVuelto?: ResolucionVuelto,
    ) =>
        invocar<Ticket>('cerrar_cuenta', { ventaId, montoRecibidoBs: recibido, tasaCobro, pagos, resolucionVuelto }),
    panel: () => invocar<PanelDatos>('datos_panel'),
    compraStock: (sku: string, cantidad: string) =>
        invocar<string>('compra_stock', { sku, cantidad }),
    reducirStock: (sku: string, cantidad: string) =>
        invocar<string>('reducir_stock', { sku, cantidad }),
    merma: (sku: string, cantidad: string, loteId: string | null) =>
        invocar<string>('registrar_merma', { sku, cantidad, loteId }),
    categorias: () => invocar<Categoria[]>('listar_categorias'),
    crearCategoria: (nombre: string) => invocar<Categoria[]>('crear_categoria', { nombre }),
    eliminarCategoria: (id: string) => invocar<Categoria[]>('eliminar_categoria', { id }),
    tasasImpuestos: () => invocar<TasaImpuesto[]>('listar_tasas_impuestos'),
    crearTasaImpuesto: (nombre: string, porcentaje: number) => invocar<TasaImpuesto[]>('crear_tasa_impuesto', { nombre, porcentaje }),
    eliminarTasaImpuesto: (id: string) => invocar<TasaImpuesto[]>('eliminar_tasa_impuesto', { id }),
    dispositivos: () => invocar<DispositivoRemoto[]>('listar_dispositivos'),
    registrarDispositivo: (nombre: string) => invocar<DispositivoRemoto[]>('registrar_dispositivo', { nombre }),
    revocarDispositivo: (id: string) => invocar<DispositivoRemoto[]>('revocar_dispositivo', { id }),
    respaldos: () => invocar<RespaldoInfo[]>('listar_respaldos'),
    crearRespaldo: () => invocar<RespaldoInfo>('crear_respaldo'),
    restaurarRespaldo: (archivo?: string) => invocar<boolean>('restaurar_desde_respaldo', { archivo }),
    licencia: () => invocar<LicenciaInfo>('obtener_licencia'),
    cambiarPinDueno: (pinAnterior: string, pinNuevo: string) =>
        invocar<boolean>('cambiar_pin_dueno', { pinAnterior, pinNuevo }),
    tasa: () => invocar<TasaActual>('obtener_tasa_bcv'),
    historicoTasas: () => invocar<RegistroHistoricoTasa[]>('listar_historico_tasas'),
    forzarTasa: () => invocar<TasaActual>('forzar_actualizacion_tasa'),
    fijarTasaManual: (tasa: string) => invocar<TasaActual>('fijar_tasa_manual', { tasa }),
    ventas: () => invocar<Ticket[]>('listar_ventas'),
    listarMetodosPago: () => invocar<MetodoPagoConfig[]>('listar_metodos_pago'),
    crearMetodoPago: (nombre: string, moneda: MonedaMetodo = 'BS') =>
        invocar<MetodoPagoConfig[]>('crear_metodo_pago', { nombre, moneda }),
    eliminarMetodoPago: (nombre: string) =>
        invocar<MetodoPagoConfig[]>('eliminar_metodo_pago', { nombre }),
    listarOperadores: () => invocar<OperadorInfo[]>('listar_operadores'),
    crearOperador: (nombre: string) => invocar<OperadorInfo[]>('crear_operador', { nombre }),
    editarOperador: (id: string, nombre: string) => invocar<OperadorInfo[]>('editar_operador', { id, nombre }),
    eliminarOperador: (id: string) => invocar<OperadorInfo[]>('eliminar_operador', { id }),
    alternarOperador: (id: string) => invocar<OperadorInfo[]>('alternar_operador', { id }),
    obtenerJornadaActual: () => invocar<JornadaLaboral | null>('obtener_jornada_actual'),
    listarHistoricoJornadas: () => invocar<JornadaLaboral[]>('listar_historico_jornadas'),
    abrirJornada: (operador: string, operadores?: string[]) => invocar<JornadaLaboral>('abrir_jornada', { operador, operadores }),
    relevarOperadorJornada: (operador: string) => invocar<JornadaLaboral>('relevar_operador_jornada', { operador }),
    asignarOperadoresTurno: (operadores: string[]) => invocar<JornadaLaboral>('asignar_operadores_turno', { operadores }),
    cerrarJornada: () => invocar<JornadaLaboral>('cerrar_jornada'),
    obtenerSemaforoStock: () => invocar<ConfigSemaforoStock>('obtener_semaforo_stock'),
    guardarSemaforoStock: (rojoMax: number, amarilloMax: number) =>
        invocar<ConfigSemaforoStock>('guardar_semaforo_stock', { rojoMax, amarilloMax }),
};
