use apex_core::error::ApexError;
use serde::Serialize;

#[derive(Serialize)]
pub struct UIError {
    pub message: String,
    pub diagnosis: String,
}

impl From<ApexError> for UIError {
    fn from(err: ApexError) -> Self {
        Self {
            message: err.to_string(),
            diagnosis: err.diagnosis().to_string(),
        }
    }
}

// Para retrocompatibilidad con las partes del sistema que aún escupen Strings.
// Inferimos el tipo de error basándonos en palabras clave del String.
impl From<String> for UIError {
    fn from(err: String) -> Self {
        let apex_err = if err.contains("Sled") || err.contains("SQLite") || err.contains("Ledger") {
            ApexError::Ledger(err)
        } else if err.contains("Seguridad") || err.contains("UID") || err.contains("AUTH") {
            ApexError::Security(err)
        } else if err.contains("Ingesta") || err.contains("Playbook") {
            ApexError::Ingestion(err)
        } else {
            ApexError::System(err)
        };

        Self {
            message: apex_err.to_string(),
            diagnosis: apex_err.diagnosis().to_string(),
        }
    }
}
