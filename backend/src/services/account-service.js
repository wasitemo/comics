import bcrypt from "bcrypt";

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
  findAccountByEmail,
  findAccountById,
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
  const result = await getAccount(limit, offset);
  if (result.length === 0) {
    throw new ResponseError(404, "Data account tidak ditemukan");
  }

  return result;
};

export const showTotalAccount = async () => {
  const result = await getTotalAccount();
  if (!result) {
    throw new ResponseError(404, "Data account tidak ditemukan");
  }

  return result;
};

export const register = async (request) => {
  const account = validation(registerValidation, request);
  const existingAccount = await findAccountByEmail(account.email);

  if (existingAccount) {
    throw new ResponseError(409, "Account telah terdaftar");
  }

  const hashPass = await bcrypt.hash(
    account.password,
    parseInt(process.env.SALT),
  );
  await addAccount(account.name, account.email, hashPass, account.status);
};

export const login = async (request) => {
  const account = validation(loginValidation, request);
  const existingAccount = await findAccountByEmail(account.email);

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

  await addToken(refreshToken, existingAccount.account_id);
  return { refresh_token: refreshToken, access_token: accessToken };
};

export const refresh = async (token) => {
  const storedToken = await findToken(token);
  if (!storedToken) {
    throw new ResponseError(401, "Token tidak valid");
  }

  const decoded = verifyRefreshToken(token);
  const newAccessToken = generateAccessToken({ id: decoded.id });

  return newAccessToken;
};

export const logout = async (token) => {
  const existingToken = await findToken(token);
  if (!existingToken) {
    throw new ResponseError(401, "Token tidak valid");
  }

  await deleteToken(token);
};

export const editAccount = async (request, accountId) => {
  const account = validation(updateAccountValidation, request);
  const existingAccount = await findAccountById(accountId);

  if (!existingAccount) {
    throw new ResponseError(404, "Data account tidak ditemukan");
  }

  if (account.password) {
    account.password = await bcrypt.hash(
      account.password,
      parseInt(process.env.SALT),
    );
  }

  const data = {
    name: account.name ?? existingAccount.name,
    email: account.email ?? existingAccount.email,
    password: account.password ?? existingAccount.password,
    status: account.status ?? existingAccount.status,
  };

  await updateAccount(data, accountId);
};
