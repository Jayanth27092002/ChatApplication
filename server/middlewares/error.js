import { envMode } from "../app.js";

export const errorMiddleware=(err,req,res,next)=>{

    err.message||="Internal Server Error";

    err.statusCode||=500;

    console.log(err);


    if(err.code===11000){
        const error=Object.keys(err.keyPattern).join(",");
        err.message=`Duplicate Field -${error}`;
        err.statusCode=400;
    }


    if(err.name==="CastError"){
        const path=err.path;
        err.message=`Invalid format of ${path}`;
        err.statusCode=400
    }

    const response={
        success:false,
        message:err.message,
    }


    if(envMode==="DEVELOPMENT"){
        response.error=err;
    }

    return res.status(err.statusCode).json(response);
        

    

}



export const tryCatch=(passedfunction)=>async (req,res,next) => {
    try {
        await passedfunction(req,res,next);
        
    } catch (error) {

        next(error);
        
    }
};
