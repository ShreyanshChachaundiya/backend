const HttpError = require("../models/http-error");
const cloudinary = require("cloudinary").v2;
const Music = require("../models/music");
const { validationResult } = require("express-validator");
const User = require("../models/user");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const createMusic = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs passed ", 422));
  }

  const { file } = req;
  const { title, artist } = req.body;

  await cloudinary.uploader.upload(
    file.path,
    { resource_type: "auto", folder: "music" },
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

  const createdMusic = new Music({
    title,
    filename: publicId,
    artist,
  });

  try {
    await createdMusic.save();
  } catch (err) {
    const error = new HttpError("creating music card failed", 500);
    return next(error);
  }

  res.status(201).json({ music: createdMusic });
};

const AllMusics = async (req, res, next) => {
  let musics;
  try {
    musics = await Music.find();
  } catch (err) {
    const error = new HttpError("could not find a musics", 404);
    return next(error);
  }

  musics.reverse();

  res
    .status(201)
    .json({ musics: musics.map((music) => music.toObject({ getters: true })) });
};

exports.createMusic = createMusic;
exports.AllMusics = AllMusics;
