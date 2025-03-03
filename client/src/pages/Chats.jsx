import React, { Fragment, useRef } from "react";

import AppLayout from "../components/layout/AppLayout";
import { IconButton, Stack } from "@mui/material";
import {
  AttachFile as AttachIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import {sample_Chat} from "../constants/sampleData"

import { CustomChatButton } from "../components/Styles/StyledComponent";
import MessageComponent from "../components/specific/MessageComponent";



const Chats = () => {

  const user={
      _id:"1234",
      name:"jay"
    }
  

  const containerRef = useRef(null);
  const MessageSubmitHandler = () => {};
  return (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        height={"90%"}
        bgcolor={"lightgray"}
      >
        {
          sample_Chat?.map((chat)=>{

            return (
              <MessageComponent key={chat._id} message={chat} user={user} />
            )
          }
            

          )
        }
      </Stack>

      <form style={{ height: "10%" }}>
        <Stack
          padding={"1rem"}
          position={"relative"}
          direction={"row"}
          width={"100%"}
          height={"100%"}
          alignItems={"center"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1rem",
              rotate: "30deg",
            }}
          >
            <AttachIcon />
          </IconButton>

          <CustomChatButton placeholder="Type your message..." />

          <IconButton
            type="submit"
            sx={{
              bgcolor: "#1cbab9",
              color: "white",
              transform: "rotate(-30deg)", // use "transform" for rotation
              marginLeft: "1rem",
              transition: "transform 0.3s ease-in-out", // Add smooth transition for rotation
              ":hover": {
                bgcolor: "blue",
                transform: "rotate(0deg)", // Smoothly rotates back to 0deg
                transitionDelay: "0.3s", // Delay for hover effect
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
    </Fragment>
  );
};

export default AppLayout()(Chats);
