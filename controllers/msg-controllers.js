const HttpError = require("../models/http-error");
const Message = require("../models/message");
const { validationResult } = require("express-validator");
const Conversation = require("../models/conversation");

const createMessage = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check if date passed in correct format.",
        422
      )
    );
  }

  const { convId, sender, content } = req.body;

  let conversation;

  // try {
  //   conversation = await Conversation.find({
  //     members: { $in: [sender] },
  //   });
  // } catch (err) {
  //   const error = new HttpError("finding conv failed", 500);
  //   return next(error);
  // }

  // if(conversation._id!==convId){
  //   const error = new HttpError("Message can not added", 500);
  //   return next(error);
  // }

  const createdMessage = new Message({
    conversationId: convId,
    sender,
    content,
  });

  try {
    await createdMessage.save();
  } catch (err) {
    const error = new HttpError("creating msg failed", 500);
    return next(error);
  }
  res.status(201).json({ message: createdMessage });
};

const getMessage = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check if date passed in correct format.",
        422
      )
    );
  }

  const cid = req.params.cid;

  let messages;

  try {
    messages = await Message.find({
      conversationId: cid,
    });
  } catch (err) {
    const error = new HttpError("finding msg failed", 500);
    return next(error);
  }
  res
    .status(201)
    .json({ messages: messages.map((item) => item.toObject({ getters: true })) });
};

exports.createMessage = createMessage;
exports.getMessage = getMessage;
