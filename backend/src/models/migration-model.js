import { pool } from "../config/database.js";

// MAIN QUERY
export const getFilename = async () => {
  const query = await pool.query("SELECT filename FROM migration");
  const result = query.rows;

  return result;
};

export const createMigration = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS migration
        (
            migration_id SERIAL NOT NULL PRIMARY KEY,
            filename TEXT UNIQUE NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )    
    `);
};

export const insertFilename = async (client, filename) => {
  await client.query("INSERT INTO migration (filename) VALUES ($1)", [
    filename,
  ]);
};
