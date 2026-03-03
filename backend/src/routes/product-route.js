import express from "express";

import { authentication } from "../middleware/auth-middleware.js";
import { productImage } from "../middleware/product-image-middleware.js";
import {
  presentProduct,
  presentProductById,
  newProduct,
  changeProduct,
  eraseProduct,
} from "../controllers/product-controller.js";

export const productRouter = express.Router();

productRouter.get("/get-product", authentication, presentProduct);
productRouter.get(
  "/get-product/:product_id",
  authentication,
  presentProductById,
);
productRouter.post(
  "/add-product",
  authentication,
  productImage.single("image"),
  newProduct,
);
productRouter.patch(
  "/update-product/:product_id",
  authentication,
  productImage.single("image"),
  changeProduct,
);
productRouter.delete(
  "/delete-product/:product_id",
  authentication,
  eraseProduct,
);
