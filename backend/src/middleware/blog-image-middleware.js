import multer from "multer";
import path from "path";

import { ResponseError } from "../error/ResponseError.js";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(
      new ResponseError(
        "Hanya dapat menerima ekstensi file jpg, jpeg, dan png",
      ),
    );
  }

  cb(null, true);
};

export const blogImage = multer({ storage, fileFilter });
