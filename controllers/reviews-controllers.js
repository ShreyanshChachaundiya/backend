const HttpError = require("../models/http-error");
const Review = require("../models/review");
const { validationResult } = require("express-validator");
const Item = require("../models/items");

const createReview = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check if date passed in correct format.",
        422
      )
    );
  }

  const { item, review, rating, name, title } = req.body;

  const createdReview = new Review({
    name,
    item,
    title,
    rating,
    review,
  });

  let product;
  try {
    product = await Item.findById(item);
  } catch (err) {
    const error = new HttpError("Creating review failed", 500);
    return next(error);
  }

  if (!product) {
    const error = new HttpError("Item does not exist!", 500);
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdReview.save();
    product.reviews.push(createdReview);
    await product.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating review failed", 500);
    return next(error);
  }
  res.status(201).json({ review: createdReview });
};

const AllReviews = async (req, res, next) => {
  let reviews;
  try {
    reviews = await Review.find();
    // userWithPlaces = await User.findById(userId).populate('places'); alternate way to get places...
    //we can only use populate once we define relation between schemas..
  } catch (err) {
    const error = new HttpError("could not find a reviews", 404);
    return next(error);
  }

  res
    .status(201)
    .json({ reviews: reviews.map((review) => review.toObject({ getters: true })) });
};

const getReviewsById = async (req, res, next) => {
  const id = req.params.pid;
  let reviews;
  try {
    reviews = await Review.find({item:id});
  } catch (err) {
    const error = new HttpError("could not find a reviews", 404);
    return next(error);
  }

  if (!reviews) {
    const error = new HttpError("could not find a blogs", 404);
    return next(error);
  }

  res
  .status(201)
  .json({ reviews: reviews.map((review) => review.toObject({ getters: true })) });
};

exports.createReview = createReview;
exports.AllReviews = AllReviews;
exports.getReviewsById=getReviewsById;