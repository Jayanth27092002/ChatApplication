import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { setCookie } from "../utils/features.js";
import { compare } from "bcrypt";
import { tryCatch } from "../middlewares/error.js";
import { CustomError } from "../utils/utilityclass.js";

///register new user and create a cookie for user





const newUser = tryCatch(async (req, res) => {
  const { name, username, password, bio } = req.body;

  const avatar = {
    public_id: "sdfd",
    url: "sdef",
  };

  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });

  setCookie(res, user, "User created Successfully", 201);
});


////Login user and save in the cookie

 const login = tryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user)
    return next(new CustomError("Invalid username",401));


  const isMatch = await compare(password, user.password);

  if (!isMatch) return next(new CustomError("Invalid Password",401));

  if (isMatch) setCookie(res, user, `Welcome back ${username}`, 201);
}
) 



//////getting the profile

const getMyProfile=tryCatch(async (req,res,next)=>{

  const user=await User.findById(req.user);

  res.json({
    message:"my profile",
    user:user
  })

})





const logout=(req,res,next)=>{

  res.clearCookie("Chat-token").json({
    message:"Logout successfully",
    success:true
  })


}


const searchUser=(req,res,next)=>{

  const {name}=req.query;

  res.status(201).json({
    message:name,
    success:true,
  })
}


export {logout,getMyProfile,login,newUser,searchUser}