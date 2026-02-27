import { ResponseError } from "../error/ResponseError.js";
import { verifyAccessToken } from "../utils/generate-token.js";

export const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ResponseError(401, "Wajib authorization");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ResponseError(401, "Token diperlukan");
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    throw new ResponseError(401, "Token tidak lagi valid");
  }
};
