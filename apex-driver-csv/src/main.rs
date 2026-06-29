use apex_core::marketplace::MarketplaceTransactionsSoA;
use chrono::Utc;
use rand::Rng;
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use serde::{Deserialize, Serialize};
use std::collections::hash_map::DefaultHasher;
use std::env;
use std::error::Error;
use std::fs::{File, OpenOptions};
use std::hash::{Hash, Hasher};

#[derive(Debug, Serialize, Deserialize)]
struct CsvTransaction {
    pub tx_id: String,
    pub customer_id: String,
    pub item_id: String,
    pub qty: Decimal,
    pub amount: Decimal,
    pub dispatch_margin_hours: u8,
    pub is_layaway: bool,
    pub signature: String, // Pseudo SHA-256 for demo
    pub timestamp: String,
}

fn generate_pseudo_sha256(tx_id: &str, timestamp: &str) -> String {
    // Generación simplificada para demo in-situ sin dependencias externas pesadas.
    let mut hasher = DefaultHasher::new();
    format!("{}{}", tx_id, timestamp).hash(&mut hasher);
    format!("{:x}", hasher.finish())
}

fn simulate_data(file_path: &str, count: usize) -> Result<(), Box<dyn Error>> {
    let file_exists = std::path::Path::new(file_path).exists();

    let file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(file_path)?;

    let mut wtr = csv::WriterBuilder::new()
        .has_headers(!file_exists)
        .from_writer(file);

    let mut rng = rand::thread_rng();
    let base_items = ["A001", "A002", "B015", "C992"];

    println!(
        "Iniciando simulación tensorial. Generando {} transacciones...",
        count
    );

    for i in 0..count {
        let tx_id = format!("TX-{}-{}", Utc::now().timestamp_millis(), i);
        let customer_id = format!("CUST-{:04}", rng.gen_range(1..9999));
        let item_id = base_items[rng.gen_range(0..base_items.len())].to_string();

        let qty_int = rng.gen_range(1..10);
        let qty = Decimal::from(qty_int);

        let base_price = match item_id.as_str() {
            "A001" => dec!(2450.00),
            "A002" => dec!(1850.50),
            "B015" => dec!(450.75),
            "C992" => dec!(120.00),
            _ => dec!(0.0),
        };
        let amount = base_price * qty;

        let margins = [0, 2, 24, 48];
        let dispatch = margins[rng.gen_range(0..margins.len())];
        let is_layaway = rng.gen_bool(0.15); // 15% probabilidad de apartado

        let timestamp = Utc::now().to_rfc3339();

        // Simulación de inmutabilidad criptográfica requerida por GEMINI.md
        let signature = generate_pseudo_sha256(&tx_id, &timestamp);

        let record = CsvTransaction {
            tx_id,
            customer_id,
            item_id,
            qty,
            amount,
            dispatch_margin_hours: dispatch,
            is_layaway,
            signature,
            timestamp,
        };

        wtr.serialize(record)?;
    }

    wtr.flush()?;
    println!(
        "Simulación finalizada con éxito. Datos acoplados en {}",
        file_path
    );
    Ok(())
}

fn ingest_data(file_path: &str) -> Result<(), Box<dyn Error>> {
    println!("Iniciando ingesta determinista hacia el núcleo de APEX...");
    let file = File::open(file_path)?;
    let mut rdr = csv::Reader::from_reader(file);

    let mut soa_txs = MarketplaceTransactionsSoA::new();

    let mut count = 0;
    for result in rdr.deserialize() {
        let record: CsvTransaction = result?;

        soa_txs.record_transaction(
            record.tx_id,
            record.customer_id,
            record.item_id,
            record.qty,
            record.amount,
            record.dispatch_margin_hours,
            record.is_layaway,
            record.signature,
        )?;
        count += 1;
    }

    println!("Ingesta termodinámica completada. {} vectores transaccionales alineados en Memoria Contigua (SoA).", count);
    Ok(())
}

fn main() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        println!("APEX Driver CSV (Marketplace Simulator)");
        println!("Uso: {} <comando> [opciones]", args[0]);
        println!("Comandos:");
        println!("  --generate <cantidad> <archivo.csv>  Genera histórico de datos externo.");
        println!("  --ingest <archivo.csv>               Consume el archivo hacia APEX Core.");
        return Ok(());
    }

    let command = &args[1];

    match command.as_str() {
        "--generate" => {
            if args.len() != 4 {
                println!("Error: --generate requiere <cantidad> y <archivo.csv>");
                return Ok(());
            }
            let count: usize = args[2].parse()?;
            let file_path = &args[3];
            simulate_data(file_path, count)?;
        }
        "--ingest" => {
            if args.len() != 3 {
                println!("Error: --ingest requiere <archivo.csv>");
                return Ok(());
            }
            let file_path = &args[2];
            ingest_data(file_path)?;
        }
        _ => {
            println!("Comando no reconocido.");
        }
    }

    Ok(())
}
