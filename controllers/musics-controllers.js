const HttpError = require("../models/http-error");
const Music = require("../models/music");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const createMusic = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs passed ", 422));
  }

  const { title, artist } = req.body;

  const createdMusic = new Music({
    title,
    filename: req.file.path,
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
