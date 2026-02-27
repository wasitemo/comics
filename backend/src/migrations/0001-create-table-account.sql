CREATE TABLE IF NOT EXISTS account (
    account_id SERIAL NOT NULL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    status status,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)