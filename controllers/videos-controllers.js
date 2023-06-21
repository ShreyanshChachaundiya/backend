const HttpError = require("../models/http-error");
const Video = require("../models/video");
const cloudinary = require("cloudinary").v2;
const { validationResult } = require("express-validator");
const User = require("../models/user");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const createVideo = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs passed ", 422));
  }

  const { file } = req;
  const { user, name, caption } = req.body;
  let publicId;

  await cloudinary.uploader.upload(
    file.path,
    { resource_type: "video", folder: "videos" },
    (error, result) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to upload file to Cloudinary" });
      } else {
        //   console.log("Upload Result:", result);
        publicId = result.public_id;
        // res.json({ publicId });
      }
    }
  );

  const createdVideo = new Video({
    name,
    filename: publicId,
    caption,
  });

  let creator;
  try {
    creator = await User.findById(user);
  } catch (err) {
    const error = new HttpError("Creating video failed", 500);
    return next(error);
  }

  if (!creator) {
    const error = new HttpError("Creator does not exist! ", 500);
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdVideo.save();
    creator.videos.push(createdVideo);
    await creator.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating video card failed", 500);
    return next(error);
  }

  res.status(201).json({ video: createdVideo });
};

const AllVideos = async (req, res, next) => {
  let videos;
  try {
    videos = await Video.find();
  } catch (err) {
    const error = new HttpError("could not find a videos", 404);
    return next(error);
  }

  videos.reverse();

  res
    .status(201)
    .json({ videos: videos.map((video) => video.toObject({ getters: true })) });
};

const like = async (req, res, next) => {
  const id = req.params.uid;
  const vid = req.params.vid;

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

  let video;
  try {
    video = await Video.findById(vid);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (!video) {
    const error = new HttpError("Could not find video for this id.", 404);
    return next(error);
  }

  if (!video.likes.includes(id)) {
    video.likes.push(existingUser);
  }

  await video.save();
  res.status(201).json({ video: video });
};

const updateVideo = async (req, res, next) => {
  const id = req.params.id;
  let video;

  try {
    item = await Video.findById(id);
  } catch (err) {
    const error = new HttpError("could not find a video", 404);
    return next(error);
  }

  // console.log(req.userData.userId + "  " + blog.user);

  if (video.user != req.userData.userId) {
    const error = new HttpError("You are not allowed to update...", 404);
    return next(error);
  }

  const { caption } = req.body;

  video.caption = caption;

  try {
    await video.save();
  } catch (err) {
    const error = new HttpError("updating video failed", 500);
    return next(error);
  }
  res.status(201).json({ video: video });
};

exports.createVideo = createVideo;
exports.AllVideos = AllVideos;
// exports.getBlogById = getBlogById;
exports.like = like;
exports.updateVideo = updateVideo;
