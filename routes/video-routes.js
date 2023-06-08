const express = require("express");
const videosController = require("../controllers/videos-controllers");
const { auth } = require("../middlewares/auth-middle");
const fileUpload = require("../middlewares/file-upload");
const { check } = require("express-validator");

const router = express.Router();

module.exports = router;

// router.post(
//   "/add",
//   // fileUpload.single("video"),
//   [check("name").not().isEmpty(), check("caption").not().isEmpty()],
//   videosController.createVideo
// );

router.post(
  "/add",
  fileUpload.single("video"),
  [check("name").not().isEmpty(), check("caption").not().isEmpty()],
  videosController.createVideo
);

router.get("/get/videos", auth, videosController.AllVideos);

router.get("/:uid/:vid", auth, videosController.like);
