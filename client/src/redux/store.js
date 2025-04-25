import { configureStore } from "@reduxjs/toolkit";
import authSlice from  "../redux/auth"; 
import  apiSlice  from "../redux/api/api"

const store=configureStore({
    reducer:{
      [authSlice.name]: authSlice.reducer,
      [apiSlice.reducerPath]:apiSlice.reducer
    },
    middleware:(defaultMiddleware)=>[...defaultMiddleware(),apiSlice.middleware],

    
})


export default store;