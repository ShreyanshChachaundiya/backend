const express = require("express");
const { check } = require("express-validator");
const postsController = require("../controllers/posts-controllers");
const { auth } = require("../middlewares/auth-middle");

const router = express.Router();

router.get("/get/:hashtag",postsController.getPostsByHashtag);

router.get("/AllHashtags",auth, postsController.getHastags);

router.post("/",auth, postsController.createPost);
 
router.delete("/:pid",auth, postsController.deletePost);

router.get("/:uid",auth, postsController.getPostsByUserId);

router.get("/:uid/:pid",auth, postsController.like);

router.get("/get/post/:pid",auth, postsController.getPostsByPostId);

module.exports = router;