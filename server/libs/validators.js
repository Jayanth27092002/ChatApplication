import { body, validationResult, check, param, query } from "express-validator";
import { CustomError } from "../utils/utilityclass.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(",");

  if (errors.isEmpty()) return next();
  else next(new CustomError(errorMessages, 400));
};
const registerValidator = () => [
  body("name", "Please enter name").notEmpty(),
  body("username", "Please enter username").notEmpty(),
  body("bio", "Please enter bio").notEmpty(),
  body("password", "Please give password").notEmpty(),
  
];

const loginValidator = () => [
  body("username", "Please enter username").notEmpty(),

  body("password", "Please give password").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "Please enter  name").notEmpty(),

  body("members")
    .notEmpty()
    .withMessage("Please enter members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members length should be greater than 2 and less than 100"),
];

const addMemberValidator = () => [
  body("chatId", "ChatId is required").notEmpty(),

  body("members")
    .notEmpty()
    .withMessage("Please enter members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members length should be greater than 2 and less than 100"),
];

const removeMemberValidator = () => [
  body("chatId", "ChatId is required").notEmpty(),

  body("userId", "UserId is required").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "ChatId is required").notEmpty(),
 
];

const leaveGroupValidator = () => [
  param("id", "Please enter chat ID").notEmpty(),
];

const chatIdValidator = () => [param("id", "Please enter chat ID").notEmpty()];

const renameValidator = () => [
  param("id", "Please enter chat ID").notEmpty(),
  body("name", "Please enter name").notEmpty(),
];

const sendRequestValidator = () => [
  body("userId", "Please enter userId").notEmpty(),
];

const acceptRequestValidator = () => [
  body("requestId", "Please enter RequestId").notEmpty(),
  body("accept", "Please Add accept")
    .notEmpty()
    .withMessage("Please add accept")
    .isBoolean()
    .withMessage("Accept must be a boolean"),
];


const adminLoginValidator=()=>[
  body("secretKey","Please enter SecretKey").notEmpty()
]

export {
  registerValidator,
  validateHandler,
  loginValidator,
  newGroupValidator,
  addMemberValidator,
  removeMemberValidator,
  sendAttachmentsValidator,
  leaveGroupValidator,
  chatIdValidator,
  renameValidator,
  sendRequestValidator,
  acceptRequestValidator,
  adminLoginValidator
};
