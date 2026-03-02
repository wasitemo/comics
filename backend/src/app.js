import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { requestLogger } from "./middleware/request-logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { accountRouter } from "./routes/account-route.js";
import { blogRouter } from "./routes/blog.route.js";
import { genreRouter } from "./routes/genre-route.js";

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use("/account", accountRouter);
app.use("/blog", blogRouter);
app.use("/genre", genreRouter);

app.use(errorHandler);
