import mongoose from "mongoose";
const { model, models, Schema, Types } = mongoose

const schema=Schema({

    name:{
        type:String,
        required:true,
    },

    creator:{
        type:Types.ObjectId,
        ref:"User",
    },

    groupChat:{
        type:Boolean,
        default:false,
    },

    members:[{
        type:Types.ObjectId,
        ref:"User"
    }],

},{timestamps:true})


export const  Chat=models.Chat || model("Chat",schema);