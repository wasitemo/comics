import pg from "pg";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
  getFilename,
  createMigration,
  insertFilename,
} from "../models/migration-model.js";

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("DATABASE CONNECTED");
  } catch (err) {
    console.log(`DATABASE CONNECTION ERROR: ${err}`);
    throw err;
  }
};

const createMigrationTable = async () => {
  await createMigration();
};

const getExceutedMigration = async () => {
  const result = await getFilename();
  return result.map((row) => row.filename);
};

export const runMigration = async () => {
  const client = await pool.connect();
  try {
    await createMigrationTable();

    const migrationPath = path.join(__dirname, "../migrations");
    const files = await fs.readdir(migrationPath);
    const executedMigration = await getExceutedMigration();

    for (const file of files) {
      if (!executedMigration.includes(file)) {
        const filePath = path.join(migrationPath, file);
        const sql = await fs.readFile(filePath, "utf-8");

        console.log(`RUNNING MIGRATION FILE: ${file}`);

        try {
          await client.query("BEGIN");

          await client.query(sql);
          await insertFilename(client, file);

          await client.query("COMMIT");
          console.log(`MIGRATION SUCCESS: ${file}`);
        } catch (err) {
          await client.query("ROLLBACK");
          throw err;
        }
      }
    }
  } finally {
    client.release();
  }
};
