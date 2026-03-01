// MAIN QUERY
export const addToken = async (db, token, accountId) => {
  await db.query(
    "INSERT INTO refresh_token (token, account_id) VALUES ($1, $2)",
    [token, accountId],
  );
};

export const deleteToken = async (db, token) => {
  await db.query("DELETE FROM refresh_token WHERE token = $1", [token]);
};

// UTIL QUERY
export const findToken = async (db, token) => {
  const query = await db.query(
    "SELECT token FROM refresh_token WHERE token = $1",
    [token],
  );
  const result = query.rows[0];

  return result;
};
