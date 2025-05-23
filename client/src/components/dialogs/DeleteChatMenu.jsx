import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/misc";
import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hooks";
import { useDeleteChatMutation, useLeaveGroupMutation } from "../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  console.log(isDeleteMenu,selectedDeleteChat);


const [deleteChat,deleteChatLoader,deleteChatData]=useAsyncMutation(useDeleteChatMutation);

const [leaveGroup,leaveGroupLoader,leaveGroupData]=useAsyncMutation(useLeaveGroupMutation);

  const navigate=useNavigate();

  const isGroup = selectedDeleteChat.groupChat;


  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current=null;
  };

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group....",{chatId:selectedDeleteChat.chatId});
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...",{chatId:selectedDeleteChat.chatId});
  };

  useEffect(()=>{

    if(deleteChatData || leaveGroupData) navigate("/");

  },[deleteChatData,leaveGroupData])
  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor?.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        sx={{
          width: "10rem",
          padding: "0.3rem",
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
      >
        {isGroup ? (
          <>
            <ExitToAppIcon /> <Typography>Leave Group</Typography>{" "}
          </>
        ) : (
          <>
            <DeleteIcon />
            <Typography>Delete Chat</Typography>
          </>
        )}
      </Stack>
    </Menu>
  );
};

export default DeleteChatMenu;
