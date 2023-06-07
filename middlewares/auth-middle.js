const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const HttpError = require("../models/http-error");
const User = require("../models/user");

dotenv.config();
const secret = process.env.SECRET;

exports.auth = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      const error = new HttpError("Authentication failed", 401);
      return next(error);
    }
    const decodedToken = jwt.verify(token, secret);

    req.userData = { userId: decodedToken.userId };
    const user = await User.findById(decodedToken.userId);
    req.user = user;
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401);
    return next(error);
  }
};

exports.isAdmin = (req, res, next) => {
  const { user } = req;
  if (user.role !== "admin")
    return next(new HttpError("Unauthorized access", 401));
  next();
};
