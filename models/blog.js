const mongoose = require("mongoose");

const schema = mongoose.Schema;

const blogSchema = new schema({
  name: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  body: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports=new mongoose.model("Blog",blogSchema);
