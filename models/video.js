const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  caption: {
    type: String,
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  share: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Video", videoSchema);
