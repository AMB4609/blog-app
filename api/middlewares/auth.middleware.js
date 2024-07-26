import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../helpers/error-handler.js";

export const islogin = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new UnauthorizedError("authentication required");
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("authentication  token required");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.user = payload;
  console.log(req.user);
  next();
};

export const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    throw new UnauthorizedError("admin role required");
  }
  next();
};
