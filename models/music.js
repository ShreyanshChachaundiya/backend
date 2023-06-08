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
  }
});

module.exports = mongoose.model("Music", musicSchema);
