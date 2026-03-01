import express from "express";

import { authentication } from "../middleware/auth-middleware.js";
import {
  presentAccount,
  presentAccountById,
  registerAccount,
  loginAccount,
  refreshToken,
  logoutAccount,
  changeAccount,
} from "../controllers/account-controller.js";

export const accountRouter = express.Router();

accountRouter.get("/get-account", authentication, presentAccount);
accountRouter.get(
  "/get-account/:account_id",
  authentication,
  presentAccountById,
);
accountRouter.post("/register", registerAccount);
accountRouter.post("/login", loginAccount);
accountRouter.post("/refresh", refreshToken);
accountRouter.patch(
  "/update-account/:account_id",
  authentication,
  changeAccount,
);
accountRouter.delete("/logout", authentication, logoutAccount);
