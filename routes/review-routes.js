const express = require("express");
const reviewsController = require("../controllers/reviews-controllers");
const { auth, isAdmin } = require("../middlewares/auth-middle");
const { check } = require("express-validator");

const router = express.Router();

module.exports = router;

router.post(
  "/add",
  auth,
  [
    check("review").not().isEmpty(),
    check("name").not().isEmpty(),
    check("title").not().isEmpty(),
    check("rating").not().isEmpty(),
  ],
  reviewsController.createReview
);

router.get("/get/allReviews", auth, reviewsController.AllReviews);

router.get("/get/reviews/:pid", auth, reviewsController.getReviewsById);
