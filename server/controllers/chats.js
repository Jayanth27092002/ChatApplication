import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { otherMember } from "../libs/helper.js";
import { tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/features.js";
import { CustomError } from "../utils/utilityclass.js";

const newGroupChat = tryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  const allmembers = [...members, req.user];

  if (allmembers.length < 3)
    return next(
      new CustomError("Group Chat should have 3 or more members", 400)
    );

  await Chat.create({
    name,
    creator: req.user,
    groupChat: true,
    members: allmembers,
  });

  emitEvent(req, ALERT, allmembers, {message:`Welcome to ${name} group chat `});
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    message: "Group created",
    success: true,
  });
});

const myChats = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  const transformedChats = chats.map(({ _id, name, groupChat, members }) => {
    console.log(members.slice(0, 3).map(({ avatar }) => avatar.url));
    const otherMemb = otherMember(members, req.user);
    return {
      _id,
      groupChat,
      name: groupChat ? name : otherMemb.name,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMemb.avatar.url],
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() != req.user.toString()) {
          prev.push(curr._id);
        }

        return prev;
      }, []),
    };
  });

  res.status(200).json({
    success: "true",
    message: "Your chats fetched",
    yourchats:transformedChats,
  });
});

const myGroups = tryCatch(async (req, res, next) => {
  const groups = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const transformedGroups = groups.map(({ _id, name, groupChat, members }) => ({
    _id,
    name,
    groupChat,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    message: transformedGroups,
  });
});

const addMembers = tryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!members || members.length < 1)
    return next(new CustomError("Please provide members", 400));
  const chat = await Chat.findById(chatId);

  if (!chat) return next(new CustomError("Chat not found", 404));

  if (!chat.groupChat)
    return next(new CustomError("This is not group chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(new CustomError("You are not creator .Cannot add", 403));

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100)
    return next(new CustomError("MAx limit reached,400"));
  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    {chatId,message:`${allUsersName} has been added in the group `}
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "members added successfully",
  });
});

const removeMember = tryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new CustomError("Chat not found", 404));

  if (!chat.groupChat)
    return next(new CustomError("This is not group chat", 400));

  if (userId.toString() == chat.creator.toString())
    return next(
      new CustomError("you cannot remove yourself from the group", 404)
    );

  if (chat.creator.toString() !== req.user.toString())
    return next(new CustomError("You are not creator .Cannot remove", 403));

  if (chat.members.length <= 3) {
    return next(new CustomError("Group must have atleast 3 members", 400));
  }


  const allMembers=chat.members.map((i)=>i.toString());

  console.log(allMembers);

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    {chatId,message:`${userThatWillBeRemoved.name} has been removed from the group`}
  );

  emitEvent(req, REFETCH_CHATS, allMembers);

  return res.status(200).json({
    success: true,
    message: "Member removed Successfully",
  });
});

const leaveGroup = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new CustomError("Chat not found", 404));

  if (
    !chat.members.some((member) => member.toString() === req.user.toString())
  ) {
    return next(new CustomError("You are not a member of this group", 400));
  }

  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.user.toString()
  );

  if (remainingMembers.length < 3) {
    return next(new CustomError("Group must have atleast 3 members", 400));
  }

  if (chat.creator.toString() === req.user.toString()) {
    const newCreator = remainingMembers[0];
    chat.creator = newCreator;
  }

  chat.members = remainingMembers;
  const user = await User.findById(req.user, "name");

  await chat.save();

  emitEvent(req, ALERT, chat.members, {chatId,message:`${user.name} left the group`});

  return res.status(200).json({
    success: true,
    message: "You left the group successfully",
  });
});

const sendAttachments = tryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const files = req.files || [];

  console.log(files);

  

  if (files.length < 1)
    return next(new CustomError("Please upload Attachmetns", 400));

  if (files.length > 5)
    return next(new CustomError("Files Cant be more than 5", 400));

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) return next(new CustomError("chat not found", 404));


  //Upload files here

  const attachments =await uploadFilesToCloudinary(files);



  if (files.length < 1)
    return next(new CustomError("please provide Attachments", 400));

  
  const messageForDb = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDb,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDb);

  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({
    success: true,
    message,
  });
});

const getChatDetails = tryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) return next(new CustomError("Chat not found", 404));



    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);

    if (!chat) return next(new CustomError("Chat not found", 404));

    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

const renameGroup = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new CustomError("Chat not found", 404));

  if (!chat.groupChat)
    return next(new CustomError("This is not a group Chat", 400));

  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new CustomError("You are not allowed to rename the group", 400)
    );
  }

  chat.name = name;
  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group name changed successfully",
  });
});

const deleteChat = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);

  if (!chat) return next(new CustomError("Chat not found", 404));

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString())
    return next(
      new CustomError("You are not allowed to delete the group", 403)
    );

  if (!chat.groupChat && !chat.members.includes(req.user.toString()))
    return next(
      new CustomError("you are not allowed to delete the group", 403)
    );

  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: {
      $exists: true,
      $ne: [],
    },
  });

  const public_ids = [];
  messagesWithAttachments.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => public_ids.push(public_id));
  });

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const getMessages = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat=await Chat.findById(chatId);

  if(!chat) return next(new CustomError("Chat not found",404));

  if(!chat?.members.includes(req.user.toString())) return next( new CustomError("You are not part of this chat",401));

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / limit);
  
  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});

export {
  newGroupChat,
  myChats,
  myGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
};
