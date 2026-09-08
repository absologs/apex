# Reglas de Proyecto DatioLabs (Enterprise Resource Data Product)

- **Propósito**: DatioLabs es un producto de software y datos de gestión empresarial orientado al sector comercial y retail, diseñado para ejecución nativa en Windows y demostración web pública en Cloudflare (`datiolabs.com/demo`).
- **Arquitectura de Dominio**: Gestiona inventarios, catálogo estructurado (SoA), capacidades modulares por rubro (Abasto, Panadería, Licorería, Retail con garantías, números de serie y comisiones) con persistencia local atómica.
- **Rigor Transaccional**: Cero flotantes (`rust_decimal` mandatorio), firmas criptográficas de integridad y control de errores cerrado.
