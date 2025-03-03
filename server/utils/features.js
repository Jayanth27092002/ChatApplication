import mongoose from "mongoose"
import jwt from "jsonwebtoken";
const cookieOptions={
    maxAge:60*60*24*1000*15,
    httpOnly:true,
    secure:true,
    sameSite:"none"
}

const connectDB=(uri)=>{

    mongoose.connect(uri,{dbName:"ChatApp"}).then((data)=>console.log(`Connected to DB:${data.connection.host}`)).catch((error)=>{throw error});
}



const setCookie=async (res,user,message,statusCode)=>{

    const secret_key=process.env.JWT_SECRETKEY

    const token=jwt.sign({_id:user._id},process.env.JWT_SECRETKEY);

    return res.status(statusCode).cookie("Chat-token",token,cookieOptions).json({
        success:true,
        message
    })
  
}


const emitEvent=(req,event,users,data)=>{
    console.log("emitting event",event);
}


export {
    connectDB,setCookie,emitEvent
}

