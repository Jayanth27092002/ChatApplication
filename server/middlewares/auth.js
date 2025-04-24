import jwt from "jsonwebtoken";

import { tryCatch } from "./error.js";
import { CustomError } from "../utils/utilityclass.js";
import { adminSecretKey } from "../app.js";

export const isAuntheticated = tryCatch(async (req, res, next) => {
  const token = req.cookies["Chat-token"];

  if (!token) return next(new CustomError("Login first", 401));

  const decoded_data = jwt.verify(token, process.env.JWT_SECRETKEY);
  req.user = decoded_data._id;

  

  next();
});



export const isAdmin = tryCatch(async (req, res, next) => {
  const token = req.cookies["Chattu-admin-token"];

  if (!token) return next(new CustomError("Only Admin can Access", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRETKEY);

  const isMatched= secretKey===adminSecretKey;

  if(!isMatched) return next(new CustomError("Invalid admin key access",401));

  next();

 

  

 
});


