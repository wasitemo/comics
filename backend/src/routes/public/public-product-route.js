import express from "express";

import {
  presentProduct,
  presentProductById,
} from "../../controllers/product-controller.js";

export const publicProductRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: PUBLIC - PRODUCT
 */

/**
 * @swagger
 * /public/product/get-product?page={page}&limit={limit}:
 *    get:
 *      summary: ""
 *      tags: [PUBLIC - PRODUCT]
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  page:
 *                    type: integer
 *                  limit:
 *                    type: integer
 *                  total_data:
 *                    type: integer
 *                  total_page:
 *                    type: integer
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        product_id:
 *                          type: integer
 *                        account_id:
 *                          type: integer
 *                        product_title:
 *                          type: string
 *                        genre:
 *                          type: array
 *                          items:
 *                            type: string
 *                        author:
 *                          type: string
 *                        release_date:
 *                          type: string
 *                        price:
 *                          type: string
 *                        sypnosis:
 *                          type: string
 *                        product_image_url:
 *                          type: string
 *        "404":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "500":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 */
publicProductRoute.get("/get-product", presentProduct);

/**
 * @swagger
 * /public/product/get-product/{product_id}:
 *    get:
 *      summary: ""
 *      tags: [PUBLIC - PRODUCT]
 *      parameters:
 *        - in: path
 *          name: product_id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  data:
 *                    type: object
 *                    properties:
 *                      product_id:
 *                        type: integer
 *                      account_id:
 *                        type: integer
 *                      product_title:
 *                        type: string
 *                      genre:
 *                        type: array
 *                        items:
 *                          type: string
 *                      author:
 *                        type: string
 *                      release_date:
 *                        type: string
 *                      price:
 *                        type: string
 *                      sypnosis:
 *                        type: string
 *                      product_image_id:
 *                        type: string
 *                      product_image_url:
 *                        type: string
 *        "404":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "500":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 */
publicProductRoute.get("/get-product/:product_id", presentProductById);
