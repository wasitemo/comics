import { pool } from "../config/database.js";

// MAIN QUERY
export const addToken = async (token) => {
  await pool.query("INSERT INTO refresh_token (token) VALUES ($1)", [token]);
};

export const deleteToken = async (token) => {
  await pool.query("DELETE FROM refresh_token WHERE token = $1", [token]);
};
