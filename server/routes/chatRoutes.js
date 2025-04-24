import express from "express";
import { isAuntheticated } from "../middlewares/auth.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  leaveGroup,
  myChats,
  myGroups,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chats.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {
  addMemberValidator,
  chatIdValidator,
  leaveGroupValidator,
  newGroupValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../libs/validators.js";

const app = express.Router();

app.use(isAuntheticated);

app.post("/newGroup", newGroupValidator(), validateHandler, newGroupChat);
app.get("/myChats", myChats);

app.get("/myGroupChats", myGroups);

app.put("/addmembers", addMemberValidator(), validateHandler, addMembers);

app.put(
  "/removemember",
  removeMemberValidator(),
  validateHandler,
  removeMember
);

app.delete(
  "/leavegroup/:id",
  leaveGroupValidator(),
  validateHandler,
  leaveGroup
);

//Send Attachments

app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);

//Get Messages

app.get("/messages/:id", chatIdValidator(), validateHandler, getMessages);

app
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler, deleteChat);

//Get Chat Details ,rename,delete

export default app;
