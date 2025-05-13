import { createSlice } from "@reduxjs/toolkit";

import { NEW_MESSAGE_ALERT } from "../constants/events";
import { getOrSaveFromStorage } from "../components/libs/fileformat";


const initialState = {
  notificationCount: 0,
  newMessagesAlert: getOrSaveFromStorage(NEW_MESSAGE_ALERT,null,true)|| [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.notificationCount += 1;
    },

    resetNotification: (state) => {
      state.notificationCount = 0;
    },

    setNewMessagesAlert: (state, action) => {
      const chatId = action.payload.chatId;

      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === chatId
      );

      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId,
          count: 1,
        });
      }
    },
    resetNewMessagesAlert:(state,action)=>{
      const chatId=action.payload;
      const index=state.newMessagesAlert.findIndex((item)=>item.chatId===chatId);

      if (index !== -1) {
        state.newMessagesAlert.splice(index, 1); 
      }
      
    }
  },
});

export default chatSlice;

export const { incrementNotification, resetNotification, setNewMessagesAlert,resetNewMessagesAlert } =
  chatSlice.actions;
