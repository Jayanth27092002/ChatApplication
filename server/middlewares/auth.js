import jwt from "jsonwebtoken";

import { tryCatch } from "./error.js";
import { CustomError } from "../utils/utilityclass.js";
import { adminSecretKey } from "../app.js";
import { CHATTUTOKEN } from "../constants/config.js";
import { User } from "../models/userModel.js";


export const isAuntheticated = tryCatch(async (req, res, next) => {
  const token = req.cookies["Chat-token"];
  console.log("Authenticated1");

  if (!token) return next(new CustomError("Login first", 401));

  console.log("Autheticated2");

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



export const socketAuthenticator=async(err,socket,next)=>{
  try {
    if (err) return next(err);

    const authToken=socket.request.cookies[CHATTUTOKEN];

    if(!authToken) return next(new CustomError("Please Login to access this route",401));
    
    const decodedData=jwt.verify(authToken,process.env.JWT_SECRETKEY);

    const user =await User.findById(decodedData._id);

    if(!user) return next(new CustomError("User not found"));


    socket.user=user;
    return next();
  } catch (error) {

    console.log(error);
    return next(new CustomError("Please login to access this",401));
    
  }


}


