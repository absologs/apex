import { api, ConfigInfo, RUBRO_ABASTO, RUBRO_LICORERIA, RUBRO_PANADERIA } from './api';

export class NegocioModel {
    private config: ConfigInfo | null = null;
    private rol: 'caja' | 'panel' = 'caja';
    private tasa: number = 0;
    private oyentes: (() => void)[] = [];

    suscribir(fn: () => void): void {
        this.oyentes.push(fn);
    }

    private notificar(): void {
        this.oyentes.forEach((f) => f());
    }

    async cargarConfig(): Promise<ConfigInfo | null> {
        this.config = await api.config();
        return this.config;
    }

    getConfig(): ConfigInfo | null {
        return this.config;
    }

    async inicializar(nombre: string, rubros: number, pin: string): Promise<void> {
        await api.inicializar(nombre, rubros, pin);
        await this.cargarConfig();
        this.notificar();
    }

    get rubroAbasto(): boolean {
        return (this.config?.rubros ?? 0 & RUBRO_ABASTO) !== 0 || (this.config?.rubros ?? 0) === RUBRO_ABASTO;
    }

    tieneRubro(bit: number): boolean {
        return ((this.config?.rubros ?? 0) & bit) !== 0;
    }

    tieneCapacidad(bit: number): boolean {
        return ((this.config?.capacidades ?? 0) & bit) !== 0;
    }

    setRol(rol: 'caja' | 'panel'): void {
        this.rol = rol;
        this.notificar();
    }

    get rolActual(): 'caja' | 'panel' {
        return this.rol;
    }

    setTasa(valor: number): void {
        this.tasa = valor;
        this.notificar();
    }

    get tasaActual(): number {
        return this.tasa;
    }

    bs(usd: string | number): string {
        const v = Number(usd) * this.tasa;
        return v.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

export { RUBRO_ABASTO, RUBRO_PANADERIA, RUBRO_LICORERIA };
