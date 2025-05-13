import { configureStore } from "@reduxjs/toolkit";
import authSlice from  "../redux/auth"; 
import  apiSlice  from "../redux/api/api"

import miscSlice from "../redux/misc";
import chatSlice from "./chat";

const store=configureStore({
    reducer:{
      [authSlice.name]: authSlice.reducer,
      [miscSlice.name]:miscSlice.reducer,
      [apiSlice.reducerPath]:apiSlice.reducer,
      [chatSlice.name]:chatSlice.reducer,
      
    },
    middleware:(defaultMiddleware)=>[...defaultMiddleware(),apiSlice.middleware],

    
})


export default store;