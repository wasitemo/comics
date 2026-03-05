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

/**
 * @swagger
 * tags:
 *   name: PROTECTED - PRODUCT
 */

/**
 * @swagger
 * /protected/product/get-product?page={page}&limit={limit}:
 *    get:
 *      summary: ""
 *      tags: [PROTECTED - PRODUCT]
 *      security:
 *        - bearerAuth: []
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
protectedProductRoute.get("/get-product", authentication, presentProduct);

/**
 * @swagger
 * /protected/product/get-list-genre:
 *    get:
 *      summary: ""
 *      tags: [PROTECTED - PRODUCT]
 *      security:
 *        - bearerAuth: []
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
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        genre_id:
 *                          type: integer
 *                        genre:
 *                          type: string
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
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
protectedProductRoute.get("/get-list-genre", authentication, presentGenreAndId);

/**
 * @swagger
 * /public/product/get-product/{product_id}:
 *    get:
 *      summary: ""
 *      tags: [PUBLIC - PRODUCT]
 *      security:
 *        - bearerAuth: []
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
protectedProductRoute.get(
  "/get-product/:product_id",
  authentication,
  presentProductById,
);

/**
 * @swagger
 * /protected/product/add-product:
 *    post:
 *      description: Untuk genre berisi array dengan nilai dari genre_id
 *      tags: [PROTECTED - PRODUCT]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required: [product_title, genre, author, release_date, price, sypnosis, image]
 *              properties:
 *                product_title:
 *                  type: string
 *                genre:
 *                  type: array
 *                  items:
 *                    type: integer
 *                author:
 *                  type: string
 *                release_date:
 *                  type: string
 *                  format: date
 *                price:
 *                  type: number
 *                sypnosis:
 *                  type: string
 *                image:
 *                  type: string
 *                  format: binary
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
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
protectedProductRoute.post(
  "/add-product",
  authentication,
  productImage.single("image"),
  newProduct,
);

/**
 * @swagger
 * /protected/product/update-product/{product_id}:
 *    patch:
 *      description: Untuk genre berisi array dengan nilai dari genre_id
 *      tags: [PROTECTED - PRODUCT]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: params
 *          name: product_id
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: false
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                product_title:
 *                  type: string
 *                genre:
 *                  type: array
 *                  items:
 *                    type: integer
 *                author:
 *                  type: string
 *                release_date:
 *                  type: string
 *                  format: date
 *                price:
 *                  type: number
 *                sypnosis:
 *                  type: string
 *                image:
 *                  type: string
 *                  format: binary
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
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
protectedProductRoute.patch(
  "/update-product/:product_id",
  authentication,
  productImage.single("image"),
  changeProduct,
);

/**
 * @swagger
 * /protected/product/delete-product/{product_id}:
 *    delete:
 *      description:
 *      tags: [PROTECTED - PRODUCT]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: params
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
 *                  message:
 *                    type: string
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: string
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
protectedProductRoute.delete(
  "/delete-product/:product_id",
  authentication,
  eraseProduct,
);
