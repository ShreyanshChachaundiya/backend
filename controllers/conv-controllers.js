const HttpError = require("../models/http-error");
const Conversation = require("../models/conversation");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const conversation = require("../models/conversation");

const createConversation = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check if date passed in correct format.",
        422
      )
    );
  }

  const { sender, reciever } = req.body;

  const createdConversation = new Conversation({
    members: [sender, reciever],
  });

  try {
    await createdConversation.save();
  } catch (err) {
    const error = new HttpError("creating conv failed", 500);
    return next(error);
  }
  res.status(201).json({ conversation: createdConversation });
};

const getConversation = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check if date passed in correct format.",
        422
      )
    );
  }

  const id = req.params.id;

  let conversation;

  try {
    conversation = await Conversation.find({
      members: { $in: [id] },
    });
  } catch (err) {
    const error = new HttpError("finding conv failed", 500);
    return next(error);
  }
  res.status(201).json({
    conversation: conversation.map((item) => item.toObject({ getters: true })),
  });
};

const checkConversation = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check if date passed in correct format.",
        422
      )
    );
  }

  const p1 = req.params.p1;
  const p2 = req.params.p2;

  let conversation;

  try {
    conversation = await Conversation.find({
      members: { $all: [p1, p2] },
    });
  } catch (err) {
    const error = new HttpError("finding conv failed", 500);
    return next(error);
  }
  res.status(201).json({ conversation: conversation });
};

exports.createConversation = createConversation;
exports.getConversation = getConversation;
exports.checkConversation = checkConversation;
