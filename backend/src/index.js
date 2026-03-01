import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { logger } from "./logger/logger.js";
import { requestLogger } from "./middleware/request-logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { accountRouter } from "./routes/account-route.js";
import { connectDB, runMigration } from "../src/config/database.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use("/account", accountRouter);
app.use(errorHandler);

let server;

const start = async () => {
  try {
    await connectDB();
    await runMigration();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    logger.error("FAILED TO START APPLICATION ", err);
    process.exit(1);
  }
};

start();

process.on("uncaughtException", (err) => {
  logger.error("UNCHAUGHT EXCEPTION ", err);
  shutdown();
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION ", err);
  shutdown();
});

function shutdown() {
  if (server) {
    server.close(() => {
      logger.info("Shutting down gracefully...");
      process.exit(1);
    });
  } else {
    process.exit();
  }
}
