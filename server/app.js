import express from "express"
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import { connectDB } from "./utils/features.js";
import { configDotenv } from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { createFakeUsers } from "./seeders/userFake.js";



//connecting to mongodb
configDotenv({
    path:"./.env"
})
const MONGO_URI=process.env.MONGO_URI
const PORT=process.env.PORT
connectDB(MONGO_URI);




const app=express();

//MiddleWares

app.use(express.json());

app.use(cookieParser());



///using different routes as middlewares
app.use("/users",userRoutes)

app.use("/chats",chatRoutes)









app.get("/",(req,res)=>{
    res.send("Hello man");

})


app.use(errorMiddleware);
app.listen(PORT,()=>{

    console.log(`app running at port ${PORT}`)

})


