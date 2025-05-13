import React, { useCallback, useEffect, useRef, useState } from "react";
import Title from "../shared/Title";
import { Drawer, Grid2, Skeleton } from "@mui/material";
import Header from "../shared/Header";
import ChatList from "../shared/ChatList";

import { useNavigate, useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useGetMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu, setIsMobileMenu, setSelectedDeleteChat } from "../../redux/misc";

import { useErrors } from "../../hooks/hooks";
import { getSocket } from "../../Socket";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from "../../constants/events";
import { useSocketEvents } from "6pp";
import { incrementNotification, setNewMessagesAlert } from "../../redux/chat";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const socket=getSocket();

    const [onlineUsers,setOnlineUsers]=useState([]);




 

    const navigate=useNavigate();

   

   


    const { isLoading, data, isError, error, refetch } = useGetMyChatsQuery();
    const dispatch = useDispatch();
    const { isMobileMenu } = useSelector((state) => state.misc);
    const {newMessagesAlert}=useSelector((state)=>state.chat);

    const deleteMenuAnchor=useRef(null);

    


    useErrors([{isError,error}]);


   

 

    const handleMobileClose = () => dispatch(setIsMobileMenu(false));

    const handleDeleteChat = (e, chatId, groupChat) => {

      dispatch(setIsDeleteMenu(true));
      deleteMenuAnchor.current=e.currentTarget;

      dispatch(setSelectedDeleteChat({chatId,groupChat}));

     

     
    };

    const params = useParams();
    const chatId = params.id;


    const newRequestListener=useCallback(()=>{



      dispatch(incrementNotification());

    



    },[dispatch]
  )

  const refetchChatsListener=useCallback((data)=>{

    refetch();
    navigate("/");

  },[navigate])


 const onlineUsersListener = useCallback((data) => {
  console.log("Online users update received:", data);
  setOnlineUsers(data); // Store as Set for efficient lookup
}, []);


  




  


  const newMessageAlertListener=useCallback((data)=>{

    
    if(data.chatId===chatId) return ;

    dispatch(setNewMessagesAlert(data));

   

    console.log("The chats are" ,newMessagesAlert);

    



  },[chatId]);
    const newEvents={
      [NEW_MESSAGE_ALERT]:newMessageAlertListener,
      [NEW_REQUEST]:newRequestListener,
      [REFETCH_CHATS]:refetchChatsListener,
      [ONLINE_USERS]:onlineUsersListener
    }

   

    useSocketEvents(socket,newEvents);

    return (
      <>
        <Title />
        <div>
          <Header />
        </div>

        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor}/>

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobileMenu} onClose={handleMobileClose}>
            <ChatList w="70vw"
              chats={data?.yourchats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              onlineUsers={onlineUsers}

              newMessagesAlert={newMessagesAlert}
              
            />
          </Drawer>
        )}

        <Grid2 container height={"calc(100vh - 4rem)"}>
          <Grid2
            item="true"
            size={{ sm: 4, md: 3, lg: 3 }}
            height={"100%"}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.yourchats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
                
                
              />
            )}
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
            <WrappedComponent {...props} chatId={chatId}  />
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
            <Profile />
          </Grid2>
        </Grid2>
      </>
    );
  };
};

export default AppLayout;
