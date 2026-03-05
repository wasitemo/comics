import express from "express";

import { authentication } from "../../middleware/auth-middleware.js";
import {
  presentAccount,
  presentAccountById,
  logoutAccount,
  changeAccount,
} from "../../controllers/account-controller.js";

export const protectedAccountRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: PROTECTED - AUTH
 */

/**
 * @swagger
 * /protected/account/get-account?page={page}&limit={limit}:
 *    get:
 *      summary: ""
 *      tags: [PROTECTED - AUTH]
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
 *                        account_id:
 *                          type: integer
 *                        name:
 *                          type: string
 *                        email:
 *                          type: string
 *                        status:
 *                          type: string
 *                        create_at:
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
protectedAccountRouter.get("/get-account", authentication, presentAccount);

/**
 * @swagger
 * /protected/account/get-account/{account_id}:
 *    get:
 *      summary: ""
 *      tags: [PROTECTED - AUTH]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: params
 *          name: account_id
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
 *                      account_id:
 *                        type: integer
 *                      name:
 *                        type: string
 *                      email:
 *                        type: string
 *                      status:
 *                        type: string
 *                      create_at:
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
protectedAccountRouter.get(
  "/get-account/:account_id",
  authentication,
  presentAccountById,
);

/**
 * @swagger
 * /protected/account/update-account/{account_id}:
 *    patch:
 *      description: nilai status pada body bertipe string, namun pada database bertipe enum dengan nilai active dan non-active yang lower case
 *      tags: [PROTECTED - AUTH]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: params
 *          name: account_id
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                status:
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
protectedAccountRouter.patch(
  "/update-account/:account_id",
  authentication,
  changeAccount,
);

/**
 * @swagger
 * /protected/account/delete-account/{account_id}:
 *    delete:
 *      summary: ""
 *      tags: [PROTECTED - AUTH]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: params
 *          name: account_id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        "201":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                  message:
 *                    type: integer
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
protectedAccountRouter.delete("/logout", authentication, logoutAccount);
