import express from "express";

import { authentication } from "../../middleware/auth-middleware.js";
import { productImage } from "../../middleware/product-image-middleware.js";
import {
  presentProduct,
  presentProductById,
  presentGenreAndId,
  newProduct,
  changeProduct,
  eraseProduct,
} from "../../controllers/product-controller.js";

export const protectedProductRoute = express.Router();

protectedProductRoute.get("/get-product", authentication, presentProduct);
protectedProductRoute.get("/get-list-genre", authentication, presentGenreAndId);
protectedProductRoute.get(
  "/get-product/:product_id",
  authentication,
  presentProductById,
);
protectedProductRoute.post(
  "/add-product",
  authentication,
  productImage.single("image"),
  newProduct,
);
protectedProductRoute.patch(
  "/update-product/:product_id",
  authentication,
  productImage.single("image"),
  changeProduct,
);
protectedProductRoute.delete(
  "/delete-product/:product_id",
  authentication,
  eraseProduct,
);
