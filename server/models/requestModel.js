import mongoose from "mongoose";
const { model, models, Schema, Types } = mongoose


const schema=new Schema({
    status:{
        type:String,
        default:"pending",
        enum:["failed","success","pending"]
    },


    sender:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },

    reciever:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})


export const Request=models.Request || model("Request",schema);