const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  filename: {
    type: String,
  },
  title: {
    type: String,
  },
  artist: {
    type: String,
  },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Music", musicSchema);
