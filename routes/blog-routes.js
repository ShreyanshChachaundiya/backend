const express = require("express");
const blogsController = require("../controllers/blogs-controllers");
const { auth } = require("../middlewares/auth-middle");
const { check } = require("express-validator");

const router = express.Router();

module.exports = router;

router.post(
  "/add",
  [
    check("name").not().isEmpty(),
    check("title").not().isEmpty(),
    check("body").not().isEmpty(),
    check("date").not().isEmpty().isDate(),
  ],
  blogsController.createBlog
);

router.get("/get/blogs", auth, blogsController.AllBlogs);

router.get("/get/blogs/:bid", auth, blogsController.getBlogById);
