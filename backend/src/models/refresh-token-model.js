import { pool } from "../config/database.js";

// MAIN QUERY
export const addToken = async (token, accountId) => {
  await pool.query(
    "INSERT INTO refresh_token (token, account_id) VALUES ($1, $2)",
    [token, accountId],
  );
};

export const deleteToken = async (token) => {
  await pool.query("DELETE FROM refresh_token WHERE token = $1", [token]);
};

// UTIL QUERY
export const findToken = async (token) => {
  const query = await pool.query(
    "SELECT token FROM refresh_token WHERE token = $1",
    [token],
  );
  const result = query.rows[0];

  return result;
};
