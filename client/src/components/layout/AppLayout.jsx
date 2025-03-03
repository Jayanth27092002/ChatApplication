import React from "react";
import Title from "../shared/Title";
import { Grid2 } from "@mui/material";
import Header from "../shared/Header";
import ChatList from "../shared/ChatList";
import { sampleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";

const AppLayout = () => (WrappedComponent) => {

 
  

  return (props) => {

    const handleDeleteChat=(e,_id,groupChat)=>{
      e.preventDefault();
      console.log("delete",_id,groupChat);

    }

    const params=useParams();
    const chatId=params.id; 
    console.log(chatId);
    return (
      <>
        <Title />
        <div><Header/></div>

        <Grid2 container  height={"calc(100vh - 4rem)"}>
          <Grid2
            item="true"
            size={{ sm: 4, md: 3, lg: 3 }}
            height={"100%"}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <ChatList chatId={chatId} handleDeleteChat={handleDeleteChat} />
          </Grid2>
          <Grid2
            item="true"
            size={{
              sm: 8,

              md: 5,
              xs: 12,
              lg: 6,
            }}
            height={"100%"}
            bgcolor="primary.color"
          >
           
            <WrappedComponent {...props } />
          </Grid2>
          <Grid2
            item="true"
            size={{
              md: 4,
              lg: 3,
            }}
            
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile/>
          </Grid2>
        </Grid2>
      </>
    );
  };
};

export default AppLayout;
