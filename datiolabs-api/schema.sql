DROP TABLE IF EXISTS data_events;
CREATE TABLE data_events (
    id TEXT PRIMARY KEY,
    dataset_id TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    tensor_inertia REAL NOT NULL,
    tensor_elasticity REAL NOT NULL,
    tensor_density REAL NOT NULL,
    tensor_friction REAL NOT NULL,
    tensor_gravity REAL NOT NULL,
    timestamp INTEGER NOT NULL
);

DROP TABLE IF EXISTS lab_workspaces;
CREATE TABLE lab_workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    config_json TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
