import express from "express"
import { getMyProfile, login, logout, newUser, searchUser } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuntheticated } from "../middlewares/auth.js";

const app=express.Router();

app.post("/newUser",singleAvatar,newUser);

app.post("/login",login);


app.use(isAuntheticated);

///after here user must be logged in 


app.get("/me",getMyProfile)

app.get("/searchUser",searchUser)
app.get("/logout",logout)

export default app;

