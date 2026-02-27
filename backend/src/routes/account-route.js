import express from "express";

import {
  presentAccount,
  registerAccount,
} from "../controllers/account-controller.js";

export const accountRouter = express.Router();

accountRouter.get("/get-account", presentAccount);
accountRouter.post("/register-account", registerAccount);
