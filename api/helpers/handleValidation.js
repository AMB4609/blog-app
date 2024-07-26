import { validationResult } from "express-validator";
import { BadRequestError } from "./error-handler.js";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    throw new BadRequestError(firstError.msg);
  }
  next();
};
