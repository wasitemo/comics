import express from "express";

import { authentication } from "../middleware/auth-middleware.js";
import {
  presentGenre,
  presentGenreById,
  newGenre,
  changeGenre,
  eraseGenre,
} from "../controllers/genre-controller.js";

export const genreRouter = express.Router();

genreRouter.get("/get-genre", authentication, presentGenre);
genreRouter.get("/get-genre/:genre_id", authentication, presentGenreById);
genreRouter.post("/add-genre", authentication, newGenre);
genreRouter.put("/update-genre/:genre_id", authentication, changeGenre);
genreRouter.delete("/delete-genre/:genre_id", authentication, eraseGenre);
