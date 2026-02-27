CREATE TABLE IF NOT EXISTS product (
    product_id SERIAL NOT NULL PRIMARY KEY,
    account_id INT,
    product_title TEXT,
    author TEXT,
    release_date DATE,
    price DECIMAL,
    sypnosis TEXT,
    product_image_id TEXT,
    product_image_url TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id) REFERENCES account (account_id)
)