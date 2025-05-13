import express from "express";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { v2 as cloudinary } from "cloudinary";

import adminRoutes from "./routes/adminRoutes.js";
import { connectDB } from "./utils/features.js";
import { configDotenv } from "dotenv";
import { errorMiddleware, tryCatch } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { createFakeUsers } from "./seeders/userFake.js";

import { Server } from "socket.io";
import cors from "cors";

import { v4 as uuid } from "uuid";

import { createServer } from "http";
import { CHAT_JOINED, CHAT_LEFT, NEW_MESSAGE, ONLINE_USERS, START_TYPING, STOP_TYPING } from "./constants/events.js";
import { getSockets } from "./libs/helper.js";
import { Message } from "./models/messageModel.js";
import { corsOption } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

//connecting to mongodb
configDotenv({
  path: "./.env",
});
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

const envMode = process.env.NODE_ENV || "PRODUCTION";

const userSocketIds = new Map();

const onlineUsers=new Set();

const adminSecretKey = process.env.ADMIN_SECRET_KEY || "DJVarma";
connectDB(MONGO_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors:corsOption ,
});


app.set("io",io);
//MiddleWares

app.use(express.json());

app.use(cors(corsOption));

app.use(cookieParser());

///using different routes as middlewares
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/chats", chatRoutes);

app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello man");
});


io.use((socket,next)=>{
  cookieParser()(socket.request,socket.request.res,async(err)=>await socketAuthenticator(err,socket,next)
    
  )
})

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const user = socket.user;
  


  userSocketIds.set(user?._id.toString(), socket.id);

  onlineUsers.add(user._id.toString());
  io.emit(ONLINE_USERS, Array.from(onlineUsers));


  socket.on(START_TYPING,({chatId,members})=>{

    const memberSockets=getSockets(members);

    socket.to(memberSockets).emit(START_TYPING,{chatId});
    
})

socket.on(STOP_TYPING,({chatId,members})=>{
  const memberSockets=getSockets(members);
  socket.to(memberSockets).emit(STOP_TYPING,{chatId});
})

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSockets = getSockets(members);
    console.log(membersSockets);
    io.to(membersSockets).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSockets).emit("NEW_MESSAGE_ALERT", { chatId });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }

   
  });

  socket.on(CHAT_JOINED, ({userId, members}) => {
    // No need to add to onlineUsers again - already done on connection
    const memberSockets = getSockets(members);
    socket.to(memberSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  // When user leaves a specific chat
  socket.on(CHAT_LEFT, ({userId, members}) => {
    const memberSockets = getSockets(members);
    socket.to(memberSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
  });
  

  socket.on("disconnect", () => {
    console.log("user disconnected");
    onlineUsers.delete(user._id.toString());
    userSocketIds.delete(user._id.toString());
    io.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

app.use(errorMiddleware);
server.listen(PORT, () => {
  console.log(`app running at port ${PORT} in ${envMode} mode`);
});

export { adminSecretKey, envMode, userSocketIds };
