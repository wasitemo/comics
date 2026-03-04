import express from "express";

import { authentication } from "../../middleware/auth-middleware.js";
import {
  presentAccount,
  presentAccountById,
  refreshToken,
  logoutAccount,
  changeAccount,
} from "../../controllers/account-controller.js";

export const protectedAccountRouter = express.Router();

protectedAccountRouter.get("/get-account", authentication, presentAccount);
protectedAccountRouter.get(
  "/get-account/:account_id",
  authentication,
  presentAccountById,
);
protectedAccountRouter.post("/refresh", refreshToken);
protectedAccountRouter.patch(
  "/update-account/:account_id",
  authentication,
  changeAccount,
);
protectedAccountRouter.delete("/logout", authentication, logoutAccount);
