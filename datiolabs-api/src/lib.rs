use serde_json::json;
use worker::*;

#[derive(serde::Deserialize)]
#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    let router = Router::new();

    router
        // NODO DatioLabs (Gerencial)
                .get_async("/api/datiolabs/health", |_, _| async move {
            Response::ok("DatioLabs Core Digital Twin (Cloudflare Wasm)")
        })
        .get_async("/api/datiolabs/inventario", |_, env| async move {
            let db = env.env.d1("DB")?;
            #[derive(serde::Serialize, serde::Deserialize)]
            struct InvProduct {
                stock: i64,
            }
            let stmt = db.prepare("SELECT stock FROM inventory_products");
            let result = stmt.all().await?;
            let items = result.results::<InvProduct>()?;
            let total_stock: i64 = items.iter().map(|i| i.stock).sum();

            let mut resp = Response::from_json(&json!({
                "status": "success",
                "total_inventory": total_stock,
                "logistica_activa": 12,
                "infraestructura": 3
            }))?;
            resp.headers_mut().set("Access-Control-Allow-Origin", "*")?;
            Ok(resp)
        })
        .get_async("/api/datiolabs/ventas", |_, env| async move {
            let db = env.env.d1("DB")?;
            #[derive(serde::Serialize, serde::Deserialize)]
            struct SalesRow {
                qty: i64,
            }
            let stmt_digital = db.prepare("SELECT COALESCE(SUM(qty), 0) as qty FROM sales_events WHERE channel = 'digital'");
            let digital_qty = stmt_digital.first::<SalesRow>(None).await.unwrap_or(None).map(|r| r.qty).unwrap_or(0);

            let stmt_phys = db.prepare("SELECT COALESCE(SUM(qty), 0) as qty FROM sales_events WHERE channel = 'physical'");
            let phys_qty = stmt_phys.first::<SalesRow>(None).await.unwrap_or(None).map(|r| r.qty).unwrap_or(0);

            let mut resp = Response::from_json(&json!({
                "status": "success",
                "digital": vec![digital_qty],
                "fisica": vec![phys_qty]
            }))?;
            resp.headers_mut().set("Access-Control-Allow-Origin", "*")?;
            Ok(resp)
        })
        // NODO MARKETPLACE (DatioLabs)
        .get_async("/api/marketplace/catalogo", |_, env| async move {
            let db = env.env.d1("DB")?;
            #[derive(serde::Serialize, serde::Deserialize)]
            struct Product {
                id: String,
                name: String,
                category: String,
                price: f64,
            }
            let stmt = db.prepare("SELECT id, name, category, price_usd as price FROM inventory_products");
            let result = stmt.all().await?;
            let products = result.results::<Product>()?;
            let mut resp = Response::from_json(&products)?;
            resp.headers_mut().set("Access-Control-Allow-Origin", "*")?;
            resp.headers_mut().set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")?;
            Ok(resp)
        })
        .post_async("/api/marketplace/checkout", |mut req, env| async move {
            let db = env.env.d1("DB")?;
            #[derive(serde::Deserialize)]
            struct CartItem {
                id: String,
                qty: i32,
            }
            let mut status = "success".to_string();
            if let Ok(cart) = req.json::<Vec<CartItem>>().await {
                for item in cart {
                    match db.prepare("UPDATE inventory_products SET stock = stock - ?1 WHERE id = ?2 AND stock >= ?1")
                        .bind(&[item.qty.into(), item.id.clone().into()]) {
                        Ok(stmt) => {
                            match stmt.run().await {
                                Ok(result) => {
                                    if result.success() {
                                        match db.prepare("INSERT INTO sales_events (product_id, qty, channel) VALUES (?1, ?2, 'digital')")
                                            .bind(&[item.id.clone().into(), item.qty.into()]) {
                                                Ok(insert_stmt) => {
                                                    if let Err(e) = insert_stmt.run().await {
                                                        status = format!("Insert error: {:?}", e);
                                                    }
                                                },
                                                Err(e) => status = format!("Bind insert error: {:?}", e),
                                        }
                                    }
                                },
                                Err(e) => status = format!("Update run error: {:?}", e),
                            }
                        },
                        Err(e) => status = format!("Bind update error: {:?}", e),
                    }
                }
            } else {
                status = "error_parsing_cart".to_string();
            }

            let mut resp = Response::from_json(&json!({ "status": status, "tx": "retail_purchase" }))?;
            resp.headers_mut().set("Access-Control-Allow-Origin", "*")?;
            Ok(resp)
        })
        // OPTIONS (CORS preflight)
                .options_async("/api/datiolabs/ventas", |_, _| async move {
            let mut resp = Response::empty()?;
            resp.headers_mut().set("Access-Control-Allow-Origin", "*")?;
            resp.headers_mut().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")?;
            Ok(resp)
        })
        .options_async("/api/marketplace/catalogo", |_, _| async move {
            let mut resp = Response::empty()?;
            resp.headers_mut().set("Access-Control-Allow-Origin", "*")?;
            resp.headers_mut().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")?;
            Ok(resp)
        })
        .options_async("/api/marketplace/checkout", |_, _| async move {
            let mut resp = Response::empty()?;
            resp.headers_mut().set("Access-Control-Allow-Origin", "*")?;
            resp.headers_mut().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")?;
            resp.headers_mut().set("Access-Control-Allow-Headers", "Content-Type")?;
            Ok(resp)
        })
        .run(req, env)
        .await
        .map(|mut resp| {
            resp.headers_mut().set("Access-Control-Allow-Origin", "*").unwrap();
            resp
        })
}

#[durable_object]
pub struct DatioLabsRealtimeDO {
    state: State,
    env: Env,
}

#[durable_object]
impl DurableObject for DatioLabsRealtimeDO {
    fn new(state: State, env: Env) -> Self {
        Self { state, env }
    }

    async fn fetch(&mut self, _req: Request) -> Result<Response> {
        Response::ok("DatioLabs Realtime S2C Active")
    }
}
