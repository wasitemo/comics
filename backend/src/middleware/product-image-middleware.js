import multer from "multer";
import path from "path";

import { ResponseError } from "../error/ResponseError.js";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(
      new ResponseError(400, "Ektensi file harus jpg atau jpeg atau png"),
    );
  }

  cb(null, true);
};

export const productImage = multer({ storage, fileFilter });
