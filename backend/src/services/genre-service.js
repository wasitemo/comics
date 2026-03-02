import { pool } from "../config/database.js";
import { ResponseError } from "../error/ResponseError.js";
import { validation } from "../validations/validate.js";
import {
  addGenreValidation,
  updateGenreValidation,
} from "../validations/genre-validation.js";
import {
  getGenre,
  getGenreById,
  addGenre,
  updateGenre,
  deleteGenre,
  getTotalGenre,
} from "../models/genre-model.js";

export const showGenre = async (limit, offset) => {
  const result = await getGenre(pool, limit, offset);
  if (result.length === 0) {
    throw new ResponseError(404, "Genre data tidak ditemukan");
  }

  return result;
};

export const showGenreById = async (genreId) => {
  const result = await getGenreById(pool, genreId);
  if (!result) {
    throw new ResponseError(404, "Genre data tidak ditemukan");
  }

  return result;
};

export const showTotalGenre = async () => {
  const result = await getTotalGenre(pool);
  if (!result) {
    throw new ResponseError(404, "Data genre tidak ditemukan");
  }

  return result;
};

export const saveGenre = async (request, accountId) => {
  const genre = validation(addGenreValidation, request);
  await addGenre(pool, accountId, genre.genre);
};

export const editGenre = async (request, accountId, genreId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const genre = validation(updateGenreValidation, request);
    const existingGenre = await getGenreById(client, genreId);

    if (!existingGenre) {
      throw new ResponseError(404, "Data genre tidak ditemukan");
    }

    await updateGenre(client, accountId, genre.genre, genreId);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
};

export const removeGenre = async (genreId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingGenre = await getGenreById(client, genreId);
    if (!existingGenre) {
      throw new ResponseError(404, "Data genre tidak ditemukan");
    }

    await deleteGenre(client, genreId);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
};
