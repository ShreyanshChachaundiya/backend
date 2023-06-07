const mongoose = require("mongoose");

const schema = mongoose.Schema;

const postSchema = new schema({
  user: { type: mongoose.Types.ObjectId, ref:"User", required: true },
  description:{type: String, required: true},
  likes: [{type:mongoose.Types.ObjectId, ref :"User"}],
  comments: [{type:mongoose.Types.ObjectId, ref:"User"}]
});

module.exports = mongoose.model("Post", postSchema);
