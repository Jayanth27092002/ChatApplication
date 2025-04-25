import { hash } from "bcrypt";
import mongoose from "mongoose";
const { model, models, Schema, Types } = mongoose


const schema= new Schema({


    name:{
        type:String,
        required:true
    },

    username:{
        type:String,
        required:true,
        unique:true,
    },

    bio:{
        type:String
    },

    password:{

        type:String,
        required:true,
        select:false

    },

    contact:{

        type:String,
        required:true,
    },

    avatar:{

        public_id:{
            type:String,
            required:true
        },

        url:{type:String,
        required:true}
        
    }
    


},{timestamps:true})


schema.pre('save',async function(next){

    if(!this.isModified("password")) return next();


    this.password=await hash(this.password,10)

    
})


export const User=model.User || model("User",schema)

