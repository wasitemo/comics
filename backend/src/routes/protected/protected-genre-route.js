import express from "express";

import { authentication } from "../../middleware/auth-middleware.js";
import {
  presentGenre,
  presentGenreById,
  newGenre,
  changeGenre,
  eraseGenre,
} from "../../controllers/genre-controller.js";

export const genreRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: PROTECTED - GENRE
 */

/**
 * @swagger
 * /protected/genre/get-blog?page={page}&limit={limit}:
 *    get:
 *      summary: ""
 *      tags: [PROTECTED - GENRE]
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
 *                        genre_id:
 *                          type: integer
 *                        account_id:
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
genreRouter.get("/get-genre", authentication, presentGenre);

/**
 * @swagger
 * /protected/genre/get-genre/{genre_id}:
 *    get:
 *      summary: ""
 *      tags: [PROTECTED - GENRE]
 *      parameters:
 *        - in: path
 *          name: genre_id
 *          schema:
 *            type: integer
 *          required: true
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
 *                      genre_id:
 *                        type: integer
 *                      account_id:
 *                        type: integer
 *                      genre:
 *                        type: string
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
genreRouter.get("/get-genre/:genre_id", authentication, presentGenreById);

/**
 * @swagger
 * /protected/genre/add-genre:
 *    post:
 *      description:
 *      tags: [PROTECTED - GENRE]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [genre]
 *              properties:
 *                genre:
 *                  type: string
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
genreRouter.post("/add-genre", authentication, newGenre);

/**
 * @swagger
 * /protected/genre/update-genre/{genre_id}:
 *    put:
 *      description:
 *      tags: [PROTECTED - GENRE]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: params
 *          name: genre_id
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [genre]
 *              properties:
 *                genre:
 *                  type: string
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
genreRouter.put("/update-genre/:genre_id", authentication, changeGenre);

/**
 * @swagger
 * /protected/genre/delete-genre/{genre_id}:
 *    delete:
 *      description:
 *      tags: [PROTECTED - GENRE]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: params
 *          name: genre_id
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
genreRouter.delete("/delete-genre/:genre_id", authentication, eraseGenre);
