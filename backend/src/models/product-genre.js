export const getproductGenre = async (db, productId) => {
  const query = await db.query(
    `
    SELECT 
    genre_id
    FROM product_genre
    WHERE product_id = $1
  `,
    [productId],
  );
  const result = query.rows;

  return result;
};

export const addProductGenre = async (db, productId, genreId) => {
  await db.query(
    `
        INSERT INTO product_genre
        (product_id, genre_id)
        VALUES
        ($1, $2)    
    `,
    [productId, genreId],
  );
};

export const updateProductGenre = async (db, genreId, productId) => {
  await db.query(
    `
    UPDATE product_genre
    SET
    genre_id = $1
    WHERE product_id = $2  
  `,
    [genreId, productId],
  );
};

export const deleteProductGenre = async (db, genreId, productId) => {
  await db.query(
    "DELETE FROM product_genre WHERE genre_id = $1 AND product_id = $2",
    [genreId, productId],
  );
};
