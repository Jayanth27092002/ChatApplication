import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import {
  AttachFile as AttachIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { sample_Chat } from "../constants/sampleData";

import { CustomChatButton } from "../components/Styles/StyledComponent";
import MessageComponent from "../components/specific/MessageComponent";
import { getSocket } from "../Socket";
import { useChatDetailsQuery, useMyMessagesQuery } from "../redux/api/api";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEFT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useSocketEvents } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { useErrors } from "../hooks/hooks";
import { useInfiniteScrollTop } from "6pp";
import { setIsFileMenu } from "../redux/misc";
import FileMenu from "../components/dialogs/FileMenu";
import { getOrSaveFromStorage } from "../components/libs/fileformat";
import { resetNewMessagesAlert } from "../redux/chat";
import TypingLoader from "../components/loaders/TypingLoader";
import { useNavigate } from "react-router-dom";

const Chats = ({ chatId }) => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const navigate=useNavigate();

  const { user } = useSelector((state) => state.auth);

  const containerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const bottomRef = useRef(null);

  const [iAmTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  console.log(userTyping);

  const typingTimeOut = useRef(null);

  const { newMessagesAlert } = useSelector((state) => state.chat);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessageChunk = useMyMessagesQuery({ chatId, skip: !chatId, page });
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessageChunk.isError, error: oldMessageChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  console.log(members);

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessageChunk?.data?.totalPages,
    page,
    setPage,
    oldMessageChunk?.data?.messages
  );

  useEffect(() => {
    getOrSaveFromStorage(NEW_MESSAGE_ALERT, newMessagesAlert, false);
  }, [newMessagesAlert]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(()=>{
    if(chatDetails.isError) return navigate("/");
  },[chatDetails.isError])

  const MessageSubmitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const messageHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);

      console.log("Typing");
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);

      console.log("Stop Typing");
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if(data?.chatId!==chatId) return;
      const messageForRealTime = {
        content: data.message,

        sender: {
          _id: "123143543dfdgdf",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForRealTime]);
    },
    [chatId]
  );

  const messageChangeHandler = (e) => {
    setMessage(e.target.value);

    if (!iAmTyping) {
      setIamTyping(true);
      socket.emit(START_TYPING, { chatId, members });
    }

    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { chatId, members });
      setIamTyping(false);
    }, 2000);
  };

  useEffect(() => {
     if (!members || !user?._id) return
    socket.emit(CHAT_JOINED,{userId:user._id,members});
    dispatch(resetNewMessagesAlert(chatId));

    return () => {

       socket.emit(CHAT_LEFT,{userId:user._id,members});
      

      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId]);

  useSocketEvents(socket, {
    [NEW_MESSAGE]: messageHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
    [ALERT]:alertListener,
  });

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        height={"90%"}
        bgcolor={"lightgray"}
        overflow="auto"
        spacing={2}
        padding={1}
      >
        {allMessages.map((chat) => {
          return <MessageComponent key={chat._id} message={chat} user={user} />;
        })}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>

      <form style={{ height: "10%" }} onSubmit={MessageSubmitHandler}>
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
            onClick={handleFileOpen}
          >
            <AttachIcon />
          </IconButton>

          <CustomChatButton
            placeholder="Type your message..."
            value={message}
            onChange={messageChangeHandler}
          />

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

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chats);
