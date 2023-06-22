const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  dob: { type: String, required: true },
  gender: { type: String, required: false, enum: ["male", "female", ""] },
  profilePicture: { type: String, default: " " },
  coverPicture: { type: String, default: " " },
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  blogs: [{ type: mongoose.Types.ObjectId, ref: "Blog" }],
  videos: [{ type: mongoose.Types.ObjectId, ref: "Video" }],
  musics: [{ type: mongoose.Types.ObjectId, ref: "Music" }],
  items: [{ type: mongoose.Types.ObjectId, ref: "Item" }],
  role: {
    type: String,
    require: true,
    default: "user",
    enum: ["user", "admin"],
  },
});

module.exports = mongoose.model("User", userSchema);
