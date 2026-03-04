import express from "express";

import {
  presentProduct,
  presentProductById,
} from "../../controllers/product-controller.js";

export const publicProductRoute = express.Router();

publicProductRoute.get("/get-product", presentProduct);
publicProductRoute.get("/get-product/:product_id", presentProductById);
