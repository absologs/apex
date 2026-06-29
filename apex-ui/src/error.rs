
use serde::Serialize;

#[derive(Serialize)]
pub struct UIError {
    pub message: String,
    pub diagnosis: String,
}



// Para retrocompatibilidad con las partes del sistema que aún escupen Strings.
// Inferimos el tipo de error basándonos en palabras clave del String.
impl From<String> for UIError {
    fn from(err: String) -> Self {
        Self {
            message: err.clone(),
            diagnosis: "Error genérico del sistema".to_string(),
        }
    }
}
