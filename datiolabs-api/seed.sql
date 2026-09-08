INSERT INTO lab_workspaces VALUES ('lab-001', 'Log Ingestion Sandbox', '{"target": "*", "ml_active": false}', 1700000000);
INSERT INTO data_events VALUES ('ev-100', 'dataset-logs', '{"level": "error", "msg": "timeout"}', 10.5, 0.2, 0.9, 1.1, 0.0, 1700000100);
INSERT INTO data_events VALUES ('ev-101', 'dataset-logs', '{"level": "info", "msg": "started"}', 5.0, 0.1, 0.99, 0.1, 0.0, 1700000105);
