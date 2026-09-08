export class DatioLabsRealtimeDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  async fetch(request) {
    return new Response("DatioLabs Realtime S2C Active", { status: 200 });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    try {
      if (path === "/api/datiolabs/health") {
        return new Response("DatioLabs Core Digital Twin (Cloudflare Edge)", { headers });
      }

      if (path === "/api/datiolabs/dolar") {
        let valor = 36.5; // Fallback
        try {
          const res = await fetch("https://rates.dolarvzla.com/bcv/current.json");
          if (res.ok) {
            const data = await res.json();
            valor = data.current.usd;
          }
        } catch(e) {}
        return Response.json({ status: "success", venta: valor }, { headers });
      }

      if (path === "/api/datiolabs/inventario") {
        const { results } = await env.DB.prepare("SELECT stock FROM inventory_products").all();
        const total = results.reduce((acc, item) => acc + (item.stock || 0), 0);
        return Response.json({ status: "success", total_inventory: total, logistica_activa: 12, infraestructura: 3 }, { headers });
      }

      if (path === "/api/datiolabs/ventas") {
        const resDig = await env.DB.prepare("SELECT COALESCE(SUM(qty), 0) as qty FROM sales_events WHERE channel = 'digital'").all();
        const resPhys = await env.DB.prepare("SELECT COALESCE(SUM(qty), 0) as qty FROM sales_events WHERE channel = 'physical'").all();
        return Response.json({
          status: "success",
          digital: [resDig.results[0]?.qty || 0],
          fisica: [resPhys.results[0]?.qty || 0]
        }, { headers });
      }

      if (path === "/api/marketplace/catalogo") {
        const { results } = await env.DB.prepare("SELECT id, name, category, price_usd as price FROM inventory_products").all();
        return Response.json(results, { headers });
      }

      if (path === "/api/marketplace/checkout" && request.method === "POST") {
        const cart = await request.json();
        for (const item of cart) {
          await env.DB.prepare("UPDATE inventory_products SET stock = stock - ? WHERE id = ? AND stock >= ?")
            .bind(item.qty, item.id, item.qty).run();
          await env.DB.prepare("INSERT INTO sales_events (product_id, qty, channel) VALUES (?, ?, 'digital')")
            .bind(item.id, item.qty).run();
        }
        return Response.json({ status: "success", tx: "retail_purchase" }, { headers });
      }

      return new Response("Not Found", { status: 404, headers });
    } catch (err) {
      return Response.json({ status: "error", message: err.message }, { status: 500, headers });
    }
  },

  async scheduled(event, env, ctx) {
    try {
      // 1. Asegurar catálogo semilla (Seed)
      const { results: catalog } = await env.DB.prepare("SELECT id FROM inventory_products").all();
      if (!catalog || catalog.length === 0) {
        await env.DB.prepare("INSERT INTO inventory_products (id, name, category, stock, price_usd) VALUES ('P001', 'Smartphone X', 'Tech', 500, 799.0), ('P002', 'Auriculares Inalámbricos', 'Tech', 1000, 59.99), ('P003', 'Monitor 27\"', 'Tech', 200, 299.0)").run();
      }

      // 2. Simular venta física usando algoritmo Pseudo-Poisson ligero (estocástico)
      const newCatalog = await env.DB.prepare("SELECT id, stock FROM inventory_products WHERE stock > 0").all();
      if (newCatalog.results && newCatalog.results.length > 0) {
        // Seleccionar producto al azar
        const idx = Math.floor(Math.random() * newCatalog.results.length);
        const item = newCatalog.results[idx];
        
        // Simular cantidad de venta (1 a 3 unidades) con mayor inercia en 1.
        const qty = Math.random() > 0.8 ? (Math.random() > 0.5 ? 3 : 2) : 1;
        const finalQty = Math.min(qty, item.stock);

        // Inyectar evento de venta canal 'physical' (El centinela termodinámico)
        await env.DB.prepare("UPDATE inventory_products SET stock = stock - ? WHERE id = ?").bind(finalQty, item.id).run();
        await env.DB.prepare("INSERT INTO sales_events (product_id, qty, channel) VALUES (?, ?, 'physical')").bind(item.id, finalQty).run();
      }
    } catch (e) {
      console.log("Error termodinámico en simulación cron:", e.message);
    }
  }
};
