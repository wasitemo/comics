import bcrypt from "bcrypt";

import { pool } from "../config/database.js";
import { ResponseError } from "../error/ResponseError.js";
import { validation } from "../validations/validate.js";
import {
  registerValidation,
  loginValidation,
  updateAccountValidation,
} from "../validations/account-validation.js";
import {
  getAccount,
  addAccount,
  updateAccount,
  getAccountById,
  findAccountByEmail,
  getTotalAccount,
} from "../models/account-model.js";
import {
  addToken,
  deleteToken,
  findToken,
} from "../models/refresh-token-model.js";
import {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
} from "../utils/generate-token.js";

export const showAccount = async (limit, offset) => {
  const result = await getAccount(pool, limit, offset);
  if (result.length === 0) {
    throw new ResponseError(404, "Data account tidak ditemukan");
  }

  return result;
};

export const showAccountById = async (accountId) => {
  const result = await getAccountById(pool, accountId);
  if (!result) {
    throw new ResponseError(404, "Data account tidak ditemukan");
  }

  return result;
};

export const showTotalAccount = async () => {
  const result = await getTotalAccount(pool);
  if (!result) {
    throw new ResponseError(404, "Data account tidak ditemukan");
  }

  return result;
};

export const register = async (request) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const account = validation(registerValidation, request);
    const existingAccount = await findAccountByEmail(client, account.email);

    if (existingAccount) {
      throw new ResponseError(409, "Account telah terdaftar");
    }

    const hashPass = await bcrypt.hash(
      account.password,
      parseInt(process.env.SALT),
    );
    await addAccount(
      client,
      account.name,
      account.email,
      hashPass,
      account.status,
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const login = async (request) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const account = validation(loginValidation, request);
    const existingAccount = await findAccountByEmail(client, account.email);

    if (!existingAccount) {
      throw new ResponseError(404, "Email atau password tidak valid");
    }

    const isMatch = await bcrypt.compare(
      account.password,
      existingAccount.password,
    );
    if (!isMatch) {
      throw new ResponseError(404, "Email atau password tidak valid");
    }

    if (existingAccount.status === "non-active") {
      throw new ResponseError(401, "Account ini tidak dapat diakases lagi");
    }

    const payload = { id: existingAccount.account_id };
    const refreshToken = generateRefreshToken(payload);
    const accessToken = generateAccessToken(payload);

    await addToken(client, refreshToken, existingAccount.account_id);

    await client.query("COMMIT");
    return { refresh_token: refreshToken, access_token: accessToken };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const refresh = async (token) => {
  const storedToken = await findToken(pool, token);
  if (!storedToken) {
    throw new ResponseError(401, "Token tidak valid");
  }

  const decoded = verifyRefreshToken(token);
  const newAccessToken = generateAccessToken({ id: decoded.id });

  return newAccessToken;
};

export const logout = async (token) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingToken = await findToken(client, token);
    if (!existingToken) {
      throw new ResponseError(401, "Token tidak valid");
    }

    await deleteToken(client, token);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const editAccount = async (request, accountId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const account = validation(updateAccountValidation, request);
    const existingAccount = await getAccountById(client, accountId);
    const findPass = await findAccountByEmail(client, existingAccount.email);

    if (!existingAccount) {
      throw new ResponseError(404, "Data account tidak ditemukan");
    }

    let updatePass = findPass.password;

    if (
      account.password &&
      account.password !== null &&
      account.password !== undefined
    ) {
      updatePass = await bcrypt.hash(
        account.password,
        parseInt(process.env.SALT),
      );
    }

    const data = {
      name: account.name ?? existingAccount.name,
      email: account.email ?? existingAccount.email,
      password: updatePass,
      status: account.status ?? existingAccount.status,
    };

    await updateAccount(client, data, accountId);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
