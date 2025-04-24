import express from "express"
import { acceptFriendRequest, getmyFriends, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuntheticated } from "../middlewares/auth.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from "../libs/validators.js";

const app=express.Router();

app.post("/newUser",singleAvatar,registerValidator(),validateHandler,newUser);

app.post("/login",loginValidator(),validateHandler,login);


app.use(isAuntheticated);

///after here user must be logged in 


app.get("/me",getMyProfile);

app.get("/searchUser",searchUser);


app.put("/sendrequest",sendRequestValidator(),validateHandler,sendFriendRequest);

app.put("/acceptrequest",acceptRequestValidator(),validateHandler,acceptFriendRequest);


app.get("/notification",getMyNotifications);

app.get("/friends",getmyFriends);
app.get("/logout",logout)

export default app;

