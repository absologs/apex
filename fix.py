import re

with open("/root/apex/apex-ui/src/lib.rs", "r") as f:
    content = f.read()

# Replace body of request_sudo
content = re.sub(r'async fn request_sudo\([^)]*\)\s*->\s*Result<String,\s*UIError>\s*\{[^}]*\}', 
                 r'async fn request_sudo() -> Result<String, UIError> { Ok("dummy".to_string()) }', 
                 content, flags=re.DOTALL)

# Replace body of select_data_source
content = re.sub(r'async fn select_data_source\([^)]*\)\s*->\s*Result<Option<String>,\s*UIError>\s*\{[^}]*\}', 
                 r'async fn select_data_source() -> Result<Option<String>, UIError> { Ok(None) }', 
                 content, flags=re.DOTALL)

# Replace execute_agnostic_ingestion
content = re.sub(r'async fn execute_agnostic_ingestion\([^)]*\)\s*->\s*Result<String,\s*UIError>\s*\{.*?\n\}\n', 
                 r'async fn execute_agnostic_ingestion() -> Result<String, UIError> { Ok("dummy".to_string()) }\n', 
                 content, flags=re.DOTALL)

# Replace scan_entropy
content = re.sub(r'async fn scan_entropy\([^)]*\)\s*->\s*Result<DiscoveredStructure,\s*UIError>\s*\{[^}]*\}', 
                 r'', 
                 content, flags=re.DOTALL)

with open("/root/apex/apex-ui/src/lib.rs", "w") as f:
    f.write(content)
