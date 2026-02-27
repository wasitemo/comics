import express from "express";

import { authentication } from "../middleware/auth-middleware.js";
import {
  presentAccount,
  registerAccount,
  loginAccount,
  refreshToken,
  logoutAccount,
  changeAccount,
} from "../controllers/account-controller.js";

export const accountRouter = express.Router();

accountRouter.get("/get-account", authentication, presentAccount);
accountRouter.post("/register", registerAccount);
accountRouter.post("/login", loginAccount);
accountRouter.post("/refresh", authentication, refreshToken);
accountRouter.patch(
  "/update-account/:account_id",
  authentication,
  changeAccount,
);
accountRouter.delete("/logout", authentication, logoutAccount);
