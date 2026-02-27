import { pool } from "../config/database.js";

// MAIN QUERY
export const getAccount = async (limit, offset) => {
  const query = await pool.query(
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

export const addAccount = async (name, email, password, status) => {
  await pool.query(
    `
        INSERT INTO account
        (name, email, password, status)
        VALUES
        ($1, $2, $3, $4)   
    `,
    [name, email, password, status],
  );
};

export const updateAccount = async (data, accountId) => {
  const { name, email, password, status } = data;

  await pool.query(
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
export const findAccountByEmail = async (email) => {
  const query = await pool.query(
    `
        SELECT
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

export const findAccountById = async (accountId) => {
  const query = await pool.query(
    "SELECT account_id, name, email, password, status FROM account WHERE account_id = $1",
    [accountId],
  );
  const result = query.rows[0];

  return result;
};

export const getTotalAccount = async () => {
  const query = await pool.query(`
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
