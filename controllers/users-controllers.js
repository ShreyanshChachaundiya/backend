const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
var nodemailer = require("nodemailer");

dotenv.config();

const secret = process.env.SECRET;
const pass = process.env.EMAIL_PASS;

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password, dob, gender, userName } = req.body;
  const date = new Date(dob);

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }).exec();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      502
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch {
    const error = new HttpError(
      "could not create user, please try again.",
      502
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    dob,
    gender,
    userName,
  });

  createdUser.save();

  // try {
  //   await createdUser.save();
  // } catch (err) {
  //   const error = new HttpError("Signing up failed, please try againfdsf.", 500);
  //   return next(error);
  // }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      secret,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({
      userId: createdUser._id,
      email: createdUser.email,
      token: token,
      name:createdUser.name,
      userName: createdUser.userName,
      isAdmin: createdUser.role,
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch {
    const error = new HttpError(
      "Could not log you in, please check the credentials and try again",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      secret,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    name: existingUser.name,
    userName: existingUser.userName,
    isAdmin: existingUser.role,
  });
};

const loginByName = async (req, res, next) => {
  const { name, password } = req.body;

  try {
    existingUser = await User.findOne({ name: name });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};

const dummy = (req, res, next) => {
  res.json({ message: "success" });
};

const forgot_password = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new HttpError("User doesn't exist, sign up please.", 401);
      return next(error);
    }

    const secret1 = secret + existingUser.password;
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser.id },
      secret,
      {
        expiresIn: "1hr",
      }
    );

    const link = `https://intern-ivory.vercel.app/reset-password/${existingUser.id}/${token}`;
    console.log(link);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shreyansh1647@gmail.com",
        pass: pass,
      },
    });

    var mailOptions = {
      from: "shreyansh1647@gmail.com",
      to: email,
      subject: "Password Reset link",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.json({ messaga: "error", status: 500 });
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: "Link sent suceessfully", status: 201 });
      }
    });
  } catch (err) {}
};

const reset_password = async (req, res, next) => {
  const { id, token } = req.params;
  // console.log(req.params);

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    const error = new HttpError("User doesn't exist, sign up please.", 401);
    return next(error);
  }
  const secret1 = secret + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    if (verify && verify.id) {
      res.status(201).json({ message: "valid user", status: 201 });
    }
  } catch (err) {
    const error = new HttpError("Not verified, could not change in.", 401);
    return next(error);
  }
};

const update_password = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { id, password } = req.body;

  try {
    existingUser = await User.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError("failed, please try again later.", 500);
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch {
    const error = new HttpError(
      "could not create user, please try again.",
      502
    );
    return next(error);
  }

  if (existingUser) {
    existingUser.password = hashedPassword;
  } else {
    const error = new HttpError("failed, please try again later.", 500);
    return next(error);
  }

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.json({ status: 201 });
};

const getUserById = async (req, res, next) => {
  const id = req.params.uid;

  try {
    existingUser = await User.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError("User Not Found.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials, could not Found.", 401);
    return next(error);
  }

  res.json({
    user: existingUser.toObject({ getters: true }),
  });
};

exports.signup = signup;
exports.login = login;
exports.loginByName = loginByName;
exports.dummy = dummy;
exports.forgot_password = forgot_password;
exports.reset_password = reset_password;
exports.update_password = update_password;
exports.getUserById = getUserById;
