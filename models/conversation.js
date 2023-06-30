const mongoose = require("mongoose");

const schema = mongoose.Schema;

const conversationSchema = new schema({
  members: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model("Conversation", conversationSchema);
