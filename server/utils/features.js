import mongoose from "mongoose"
import jwt from "jsonwebtoken";

import {v2 as cloudinary } from 'cloudinary';
import { v4 as uuid} from "uuid"
import { getBase64, getSockets } from "../libs/helper.js";
import { io } from 'socket.io-client';
import { request } from "express";


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
        user,
        message
    })
  
}


const emitEvent=(req,event,users,data)=>{
    const io=req.app.get("io");
    const userSockets=getSockets(users);

    io.to(userSockets).emit(event,data);
}


const uploadFilesToCloudinary=async (files=[])=>{
    const uploadPromises=files.map((file)=>{
        return new Promise((resolve,reject)=>{
            console.log("hello");
            cloudinary.uploader.upload(getBase64(file),{
                resource_type:"auto",
                public_id:uuid(),


            },
            (error,result)=>{
                if (error) return reject(error);
                resolve(result);
            }
        )

        }
    )
}
    )

   

    console.log(uploadPromises);

    try {
        const results=await Promise.all(uploadPromises);
        console.log(results);
        const formattedResults=results.map((result)=>({
            public_id:result.public_id,
            url:result.url

        }))



      
        return formattedResults;
        
    } catch (error) {
        throw new Error("Error uploading files to cloudinary",error);
        
    }

}


const deleteFilesFromCloudinary=async (public_ids)=>{

}


export {
    connectDB,setCookie,emitEvent,deleteFilesFromCloudinary,cookieOptions,uploadFilesToCloudinary
}

