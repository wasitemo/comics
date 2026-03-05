// MAIN QUERY
export const getAccount = async (db, limit, offset) => {
  const query = await db.query(
    `
        SELECT
        account_id,
        name,
        email,
        status,
        create_at
        FROM account
        ORDER BY account_id ASC    
        LIMIT $1 OFFSET $2
    `,
    [limit, offset],
  );
  const result = query.rows;

  return result;
};

export const getAccountById = async (db, accountId) => {
  const query = await db.query(
    "SELECT account_id, name, email, status FROM account WHERE account_id = $1",
    [accountId],
  );
  const result = query.rows[0];

  return result;
};

export const addAccount = async (db, name, email, password, status) => {
  await db.query(
    `
        INSERT INTO account
        (name, email, password, status)
        VALUES
        ($1, $2, $3, $4)   
    `,
    [name, email, password, status],
  );
};

export const updateAccount = async (db, data, accountId) => {
  const { name, email, password, status } = data;

  await db.query(
    `
        UPDATE account
        SET
        name = $1,
        email = $2,
        password = $3,
        status = $4
        WHERE account_id = $5    
    `,
    [name, email, password, status, accountId],
  );
};

// UTIL QUERY
export const findAccountByEmail = async (db, email) => {
  const query = await db.query(
    `
        SELECT
        account_id,
        email,
        password,
        status
        FROM account
        WHERE TRIM(email) = TRIM($1)    
    `,
    [email],
  );
  const result = await query.rows[0];

  return result;
};

export const getTotalAccount = async (db) => {
  const query = await db.query(`
        SELECT COUNT(*)
        FROM (
            SELECT
            account_id,
            name,
            status,
            create_at
            FROM account
        )    
    `);
  const result = query.rows[0];

  return result;
};
