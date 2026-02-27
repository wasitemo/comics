import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/error-handler.js";
import { accountRouter } from "./routes/account-route.js";
import { connectDB, runMigration } from "../src/config/database.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/account", accountRouter);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  await runMigration();
};

start();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
