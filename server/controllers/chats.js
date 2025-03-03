import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { otherMember } from "../libs/helper.js";
import { tryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { emitEvent } from "../utils/features.js";
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

  emitEvent(req, ALERT, allmembers, `Welcome to ${name} group chat `);
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
    message: transformedChats,
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





export { newGroupChat, myChats, myGroups };
