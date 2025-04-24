import express from "express";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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
import { NEW_MESSAGE } from "./constants/events.js";
import { getSockets } from "./libs/helper.js";
import { Message } from "./models/messageModel.js";

//connecting to mongodb
configDotenv({
  path: "./.env",
});
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

const envMode = process.env.NODE_ENV || "PRODUCTION";

const userSocketIds = new Map();

const adminSecretKey = process.env.ADMIN_SECRET_KEY || "DJVarma";
connectDB(MONGO_URI);

const app = express();

const server = createServer(app);

const io = new Server(server, {});

//MiddleWares

app.use(express.json());

app.use(cors({
  origin:["http://localhost:5173","http://localhost:4000",process.env.CLIENT_URL],
  credentials:true
}))



app.use(cookieParser());

///using different routes as middlewares
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/chats", chatRoutes);

app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello man");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const user = {
    _id: "asdsa",
    name: "Jay",
  };

  userSocketIds.set(user._id.toString(), socket.id);

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

    console.log("NEW MESSAGE", messageForRealTime);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIds.delete(user._id.toString());
  });
});

app.use(errorMiddleware);
server.listen(PORT, () => {
  console.log(`app running at port ${PORT} in ${envMode} mode`);
});

export { adminSecretKey, envMode, userSocketIds };
