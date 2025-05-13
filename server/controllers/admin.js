import { tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { CustomError } from "../utils/utilityclass.js";

import { cookieOptions } from "../utils/features.js";

import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";

const adminLogin = tryCatch(async (req, res, next) => {
  const { secretKey } = req.body;

  

  const isMatch = secretKey ===adminSecretKey;

  if (!isMatch) return next(new CustomError("Invalid Admin Key", 401));

  const token = jwt.sign(secretKey, process.env.JWT_SECRETKEY);

  return res
    .status(200)
    .cookie("Chattu-admin-token", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Welcome Back Boss",
    });
});



const adminLogout = tryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("Chattu-admin-token","", {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
});


const getAdminData=tryCatch(async(req,res,next)=>{
  return res.status(200).json({
    admin:true,
  })
})

const allUsers = tryCatch(async (req, res, next) => {
  const users = await User.find({});

  const transformedUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);
      return {
        name,
        username,
        avatar: avatar.url,
        _id,
        groups,
        friends,
      };
    })
  );

  return res.status(200).json({
    status: "success",
    transformedUsers,
  });
});

const allChats = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });
      return {
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        })),
        creator: {
          name: creator?.name || "None",
          avatar: creator?.avatar.url || " ",
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );

  return res.status(200).json({
    success: true,
    transformedChats,
  });
});

const allMessages = tryCatch(async (req, res, next) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transformedMessages = messages.map(
    ({ _id, content, attachments, sender, createdAt, chat }) => ({
      _id,
      attachments,
      content,
      createdAt,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
      groupChat: chat.groupChat,
      chat: chat._id,
    })
  );

  res.status(200).json({
    success: "true",
    transformedMessages,
  });
});

const getDashboardStats = tryCatch(async (req, res, next) => {
  console.log("1");
  const [groupsCount, usersCount, messagesCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);

   console.log("2");

  const today = new Date();
  const last7Days = new Date();

   console.log("3");

  last7Days.setDate(last7Days.getDate() - 7);
  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");

  const messages = new Array(7).fill(0);
  const dayInMilliSeconds = 1000 * 60 * 60 * 24;

  last7DaysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMilliSeconds;

    const index = Math.floor(indexApprox);
    messages[6 - index]++;
  });

   console.log("4");

  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalChatsCount,
    messages,
  };

  return res.status(200).json({
    success: true,
    stats,
  });
});

export { allUsers, allChats, allMessages, getDashboardStats, adminLogin ,adminLogout,getAdminData};
