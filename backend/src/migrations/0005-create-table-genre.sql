CREATE TABLE IF NOT EXISTS genre (
    genre_id SERIAL NOT NULL PRIMARY KEY,
    account_id INT,
    genre TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id) REFERENCES account (account_id)
)