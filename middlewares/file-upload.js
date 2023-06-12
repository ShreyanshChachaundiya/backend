const multer = require("multer");
const HttpError = require("../models/http-error");

const fileUpload = multer({
  limit:5000000,
    storage:multer.diskStorage({
        // destination: (req, file, cb) => {
        //   cb(null, './uploads/videos'); // Set the destination folder for storing uploaded videos
        // },
        // filename: (req, file, cb) => {
        //   cb(null, Date.now() + '-' + file.originalname); // Set the filename to include the current timestamp
        // },
      }),
    fileFilter: (req, file, cb) => {
        // Check the file mimetype
        if (file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(new HttpError('Invalid file type. Only video files are allowed.'));
        }
      }
    })

module.exports = fileUpload;