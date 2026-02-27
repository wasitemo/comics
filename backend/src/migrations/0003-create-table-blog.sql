CREATE TABLE IF NOT EXISTS blog (
    blog_id SERIAL NOT NULL PRIMARY KEY,
    account_id INT,
    blog_title TEXT,
    blog_content TEXT,
    blog_image_id TEXT,
    blog_image_url TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id) REFERENCES account (account_id)
)