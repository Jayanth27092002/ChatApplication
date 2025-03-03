import jwt from "jsonwebtoken";

import { tryCatch } from "./error.js";
import { CustomError } from "../utils/utilityclass.js";

export const isAuntheticated = tryCatch(async (req, res, next) => {
  const token = req.cookies["Chat-token"];

  if (!token) return next(new CustomError("Login first", 401));

  const decoded_data = jwt.verify(token, process.env.JWT_SECRETKEY);
  req.user = decoded_data._id;

  next();
});


