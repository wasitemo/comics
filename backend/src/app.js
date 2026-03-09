import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { requestLogger } from "./middleware/request-logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { protectedAccountRouter } from "./routes/protected/protected-account-route.js";
import { publicAccountRouter } from "./routes/public/public-account-route.js";
import { protectedBlogRouter } from "./routes/protected/protected-blog.route.js";
import { publicBlogRouter } from "./routes/public/public-blog-route.js";
import { genreRouter } from "./routes/protected/protected-genre-route.js";
import { protectedProductRoute } from "./routes/protected/protected-product-route.js";
import { publicProductRoute } from "./routes/public/public-product-route.js";
import { swaggerSpec } from "./utils/swagger.js";

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
  }),
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

// PROTECTED ROUTE
app.use("/protected/account", protectedAccountRouter);
app.use("/protected/blog", protectedBlogRouter);
app.use("/protected/genre", genreRouter);
app.use("/protected/product", protectedProductRoute);

// PUBLIC ROUTE
app.use("/public/account", publicAccountRouter);
app.use("/public/blog", publicBlogRouter);
app.use("/public/product", publicProductRoute);
app.use(
  "/public/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        req.withCredentials = true;
        return true;
      },
      supportedSubmitMethods: [],
    },
  }),
);

app.use(errorHandler);
