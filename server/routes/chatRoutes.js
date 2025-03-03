import express from "express";
import { isAuntheticated } from "../middlewares/auth.js";
import { myChats, myGroups, newGroupChat } from "../controllers/chats.js";

const app=express.Router();

app.use(isAuntheticated);

// chatroutes


app.post("/newGroup",newGroupChat);
app.get("/myChats",myChats)

app.get("/myGroupChats",myGroups)













export default app;