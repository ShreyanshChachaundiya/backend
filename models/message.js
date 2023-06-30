const mongoose = require("mongoose");

const schema = mongoose.Schema;

const messageSchema = new schema({
  conversationId: {
    type: mongoose.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model("Message", messageSchema);
