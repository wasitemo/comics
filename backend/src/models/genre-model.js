// MAIN QUERY
export const getGenre = async (db, limit, offset) => {
  const query = await db.query(
    `
        SELECT 
        genre_id, 
        account_id, 
        genre 
        FROM genre
        ORDER BY genre_id ASC
        LIMIT $1 OFFSET $2
    `,
    [limit, offset],
  );
  const result = query.rows;

  return result;
};

export const getGenreById = async (db, genreId) => {
  const query = await db.query(
    `
        SELECT
        genre_id,
        account_id,
        genre
        FROM genre
        WHERE genre_id = $1    
    `,
    [genreId],
  );
  const result = query.rows[0];

  return result;
};

export const addGenre = async (db, accountId, genre) => {
  await db.query(
    `
        INSERT INTO genre
        (account_id, genre)
        VALUES
        ($1, $2)    
    `,
    [accountId, genre],
  );
};

export const updateGenre = async (db, accountId, genre, genreId) => {
  await db.query(
    `
        UPDATE genre
        SET
        account_id = $1,
        genre = $2
        WHERE genre_id = $3    
    `,
    [accountId, genre, genreId],
  );
};

export const deleteGenre = async (db, genreId) => {
  await db.query("DELETE FROM genre WHERE genre_id = $1", [genreId]);
};

// UTIL QUERY
export const getTotalGenre = async (db) => {
  const query = await db.query(`
        SELECT COUNT(*)
        FROM (
            SELECT 
            genre_id, 
            account_id, 
            genre 
            FROM genre
        )
    `);
  const result = query.rows[0];

  return result;
};

export const getGenreAndId = async (db) => {
  const query = await db.query(`
    SELECT 
    genre_id,
    genre
    FROM genre
    ORDER BY genre_id ASC  
  `);
  const result = query.rows;

  return result;
};
