const multer = require("multer");
const HttpError = require("../models/http-error");

const musicUpload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (in bytes)
  },
  storage: multer.diskStorage({
    // destination: (req, file, cb) => {
    //   cb(null, "./uploads/musics"); // Set the destination folder for storing uploaded videos
    // },
    // filename: (req, file, cb) => {
    //   cb(null, Date.now() + "-" + file.originalname); // Set the filename to include the current timestamp
    // },
  }),
  // fileFilter: (req, file, cb) => {
  //   // Check the file mimetype
  //   if (file.mimetype.startsWith("audio/mpeg")) {
  //     cb(null, true);
  //   } else {
  //     cb(new HttpError("Invalid file type. Only mp3 files are allowed."));
  //   }
  // },
});

module.exports = musicUpload;
