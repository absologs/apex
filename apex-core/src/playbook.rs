use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub type ColumnId = String;

/// AST de Operaciones de Transformación
/// Representa las reglas discretas y puras para manipular la información ingesada
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum TransformOp {
    TrimWhitespace(ColumnId),
    CastToInteger {
        col: ColumnId,
        fallback: i64,
    },
    FillNull {
        col: ColumnId,
        default_value: String,
    },
    MergeColumns {
        col_a: ColumnId,
        col_b: ColumnId,
        separator: String,
        target: ColumnId,
    },
    Uppercase(ColumnId),
}

/// El "Playbook" o Receta
/// Grafo acíclico dirigido (serializado como vector para procesamiento secuencial) de reglas
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Playbook {
    pub operations: Vec<TransformOp>,
}

/// Fallos manejables dentro del motor de ejecución.
#[derive(Debug, Clone, PartialEq)]
pub enum TransformError {
    // Si se agregan operaciones que fallan categóricamente y no tienen fallbacks
    ColumnNotFound(String),
}

/// Representación conceptual y puramente inmutable de los datos de origen
#[derive(Debug, Clone, PartialEq)]
pub struct DataFrameView {
    pub rows: Vec<HashMap<String, String>>,
}

/// Representación determinista del resultado final tras ejecutar el Playbook
#[derive(Debug, Clone, PartialEq)]
pub struct CleanDataFrame {
    pub rows: Vec<HashMap<String, String>>,
}

/// Motor de Ejecución Determinista
/// Función pura: Toma un View y un Playbook, y retorna un DataFrame 100% limpio e inmutable.
/// Si hay error en los datos crudos, se resuelve al fallback configurado sin colapsar.
pub fn execute_playbook(
    raw_data: &DataFrameView,
    playbook: &Playbook,
) -> Result<CleanDataFrame, TransformError> {
    // Inmutabilidad Absoluta: NUNCA se modifica `raw_data`.
    // Todo ocurre en proyecciones transitorias.
    let mut current_rows = raw_data.rows.clone();

    for op in &playbook.operations {
        let mut next_rows = Vec::with_capacity(current_rows.len());

        for mut row in current_rows.into_iter() {
            match op {
                TransformOp::TrimWhitespace(col_id) => {
                    if let Some(val) = row.get_mut(col_id) {
                        *val = val.trim().to_string();
                    }
                }
                TransformOp::CastToInteger { col, fallback } => {
                    if let Some(val) = row.get_mut(col) {
                        // Cast estricto. Si no es un número entero válido, asume el fallback
                        let parsed = val.trim().parse::<i64>().unwrap_or(*fallback);
                        *val = parsed.to_string();
                    } else {
                        // Si la columna está ausente en la fuente, se inyecta el fallback
                        row.insert(col.clone(), fallback.to_string());
                    }
                }
                TransformOp::FillNull { col, default_value } => {
                    let is_empty = row.get(col).is_none_or(|v| v.trim().is_empty());
                    if is_empty {
                        row.insert(col.clone(), default_value.clone());
                    }
                }
                TransformOp::MergeColumns {
                    col_a,
                    col_b,
                    separator,
                    target,
                } => {
                    let val_a = row.get(col_a).cloned().unwrap_or_default();
                    let val_b = row.get(col_b).cloned().unwrap_or_default();
                    row.insert(target.clone(), format!("{}{}{}", val_a, separator, val_b));
                }
                TransformOp::Uppercase(col_id) => {
                    if let Some(val) = row.get_mut(col_id) {
                        *val = val.to_uppercase();
                    }
                }
            }
            next_rows.push(row);
        }
        current_rows = next_rows;
    }

    Ok(CleanDataFrame { rows: current_rows })
}
