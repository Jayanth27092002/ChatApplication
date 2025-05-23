import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { emitEvent, setCookie, uploadFilesToCloudinary } from "../utils/features.js";
import { compare } from "bcrypt";
import { tryCatch } from "../middlewares/error.js";
import { CustomError } from "../utils/utilityclass.js";
import { Chat } from "../models/chatModel.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { Request } from "../models/requestModel.js";
import { otherMember,getBase64 } from "../libs/helper.js";
import { ResultWithContextImpl } from "express-validator/lib/chain/context-runner-impl.js";

///register new user and create a cookie for user

const newUser = tryCatch(async (req, res, next) => {
  console.log("This function is called");
  const { name, username, password, bio,contact } = req.body;

  console.log("HOIIIIIIII");


  const file=req.file;

  console.log(file);

  if(!file) return  next(new CustomError("File needed",400));

  console.log("3");

  const result=await uploadFilesToCloudinary([file]);

  

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
    contact
  });

  setCookie(res, user, "User created Successfully", 201);
});

////Login user and save in the cookie

const login = tryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  console.log(username,password);

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new CustomError("Invalid username", 401));

  const isMatch = await compare(password, user.password);

  if (!isMatch) return next(new CustomError("Invalid Password", 401));

  if (isMatch) setCookie(res, user, `Welcome back ${username}`, 201);
});

//////getting the profile

const getMyProfile = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new CustomError("User not found", 404));

  res.json({
    message: "my profile",
    user: user,
  });
});

const logout = (req, res, next) => {
  
  res.clearCookie("Chat-token").json({
    message: "Logout successfully",
    success: true,
  });
};

const sendFriendRequest = tryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, reciever: userId },
      { sender: userId, reciever: req.user },
    ],
  });

  if (request) return next(new CustomError("You have already requested", 400));

  await Request.create({
    sender: req.user,
    reciever: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  res.status(200).json({
    success: true,
    message: "Request sent successfully",
  });
});

const acceptFriendRequest = tryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("reciever", "name");

  if (!request) return next(new CustomError("No request exists", 400));

  if (request.reciever._id.toString() !== req.user.toString())
    return next(new CustomError("you can't accept this request", 404));

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request denied",
    });
  }

  const members = [request.sender._id, request.reciever._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.reciever.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend request accepted",
    senderId: request.sender._id,
  });
});

const searchUser = tryCatch(async (req, res) => {
  const { name } = req.query;

  const myChats = await Chat.find({ groupChat: false, members: req.user });

  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members.filter((id)=>id.toString()!=req.user.toString()));

  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin:[...allUsersFromMyChats,req.user] },
    name: { $regex: name, $options: "i" },
  });

  console.log(allUsersExceptMeAndFriends);

  const users = allUsersExceptMeAndFriends.map(({_id, name, avatar}) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  res.status(200).json({
    success: true,
    users,
  });
});

const getMyNotifications = tryCatch(async (req, res, next) => {
  const request = await Request.find({ reciever: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = request.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

const getmyFriends = tryCatch(async (req, res, next) => {
  const chatId = req.query.chatId;
  console.log(1);

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  console.log(chats);
  console.log(2);

  const friends = chats.map(({ members }) => {
    const otherUser = otherMember(members, req.user);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  console.log(friends);
  console.log(3);
  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend_.id)
    );

    return res.status(200).json({
      success: true,
      availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export {
  logout,
  getMyProfile,
  login,
  newUser,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getmyFriends,
};
