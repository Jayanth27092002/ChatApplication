export const corsOption={
    origin: [
      "http://localhost:5173",
      "http://localhost:4000",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  };


  export const CHATTUTOKEN= "Chat-token"