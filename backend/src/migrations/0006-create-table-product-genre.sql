CREATE TABLE IF NOT EXISTS product_genre (
    product_id INT REFERENCES product (product_id) ON DELETE CASCADE,
    genre_id INT REFERENCES genre (genre_id) ON DELETE CASCADE,

)