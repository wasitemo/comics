import express from "express";
import {
  registerAccount,
  loginAccount,
} from "../../controllers/account-controller.js";

export const publicAccountRouter = express.Router();

publicAccountRouter.post("/register", registerAccount);
publicAccountRouter.post("/login", loginAccount);
