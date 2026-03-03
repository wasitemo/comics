// MAIN QUERY
export const getProduct = async (db, limit, offset) => {
  const query = await db.query(
    `
        SELECT
        product.product_id,
        product.account_id,
        product_title,
        ARRAY_AGG(genre) as genres,
        author,
        release_date,
        price,
        sypnosis,
        product_image_url
        FROM product
        INNER JOIN product_genre ON product.product_id = product_genre.product_id
        INNER JOIN genre ON genre.genre_id = product_genre.genre_id
        GROUP BY product.product_id
        ORDER BY product.product_id ASC
        LIMIT $1 OFFSET $2
    `,
    [limit, offset],
  );
  const result = query.rows;

  return result;
};

export const getProductById = async (db, productId) => {
  const query = await db.query(
    `
        SELECT
        product.product_id,
        product.account_id,
        product_title,
        ARRAY_AGG(genre) as genres,
        author,
        release_date,
        price,
        sypnosis,
        product_image_id,
        product_image_url
        FROM product
        INNER JOIN product_genre ON product.product_id = product_genre.product_id
        INNER JOIN genre ON genre.genre_id = product_genre.genre_id
        WHERE product.product_id = $1
        GROUP BY product.product_id
    `,
    [productId],
  );
  const result = query.rows[0];

  return result;
};
export const addProduct = async (
  db,
  accountId,
  productTitle,
  author,
  releaseDate,
  price,
  sypnosis,
) => {
  const query = await db.query(
    `
        INSERT INTO product
        (account_id, product_title, author, release_date, price, sypnosis)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING product_id
    `,
    [accountId, productTitle, author, releaseDate, price, sypnosis],
  );
  const result = query.rows[0];

  return result;
};

export const updateImage = async (
  db,
  productImageId,
  productImageUrl,
  productId,
) => {
  await db.query(
    `
        UPDATE product
        SET
        product_image_id = $1,
        product_image_url = $2
        WHERE product_id = $3    
    `,
    [productImageId, productImageUrl, productId],
  );
};

export const updateProduct = async (db, data, productId) => {
  const { account_id, product_title, author, release_date, price, sypnosis } =
    data;

  const query = await db.query(
    `
        UPDATE product
        SET
        account_id = $1,
        product_title = $2,
        author = $3,
        release_date = $4,
        price = $5,
        sypnosis = $6
        WHERE product_id = $7
        RETURNING product_id
    `,
    [
      account_id,
      product_title,
      author,
      release_date,
      price,
      sypnosis,
      productId,
    ],
  );
  const result = query.rows[0];

  return result;
};

export const deleteProduct = async (db, productId) => {
  await db.query("DELETE FROM product WHERE product_id = $1", [productId]);
};

// UTIL QUERY
export const getTotalProduct = async (db) => {
  const query = await db.query(`
        SELECT COUNT(*)
        FROM (
            SELECT
            product.product_id,
            product.account_id,
            product_title,
            ARRAY_AGG(genre) as genres,
            author,
            release_date,
            price,
            sypnosis,
            product_image_url
            FROM product
            INNER JOIN product_genre ON product.product_id = product_genre.product_id
            INNER JOIN genre ON genre.genre_id = product_genre.genre_id
            GROUP BY product.product_id
        )    
    `);
  const result = query.rows[0];

  return result;
};
