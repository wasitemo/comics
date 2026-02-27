CREATE TABLE IF NOT EXISTS refresh_token (
    token_id SERIAL NOT NULL PRIMARY KEY,
    account_id INT,
    token TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id) REFERENCES account (account_id)
)