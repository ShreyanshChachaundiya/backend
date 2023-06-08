const express = require("express");
const musicsController = require("../controllers/musics-controllers");
const { auth } = require("../middlewares/auth-middle");
const musicUpload = require("../middlewares/music-upload");
const { check } = require("express-validator");

const router = express.Router();

module.exports = router;

router.post(
  "/add",
  musicUpload.single("music"),
  [check("title").not().isEmpty(), check("artist").not().isEmpty()],
  musicsController.createMusic
);

router.get("/get/musics", auth, musicsController.AllMusics);

