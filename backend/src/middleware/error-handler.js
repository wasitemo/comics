import { ResponseError } from "../error/ResponseError.js";

export const errorHandler = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    console.error(err);
    return res
      .status(err.statusCode)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    console.error(err);
    return res
      .status(500)
      .json({
        errors: "Internal server error",
      })
      .end();
  }
};
