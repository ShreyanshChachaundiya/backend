const HttpError = require("../models/http-error");
const Blog = require("../models/blog");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const createBlog = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check if date passed in correct format.",
        422
      )
    );
  }

  const { user, name, title, body, date } = req.body;

  const createdBlog = new Blog({
    user,
    name,
    title,
    body,
    date,
  });

  let creator;
  try {
    creator = await User.findById(user);
  } catch (err) {
    const error = new HttpError("Creating blog failed", 500);
    return next(error);
  }

  if (!creator) {
    const error = new HttpError("Creator does not exist! ", 500);
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdBlog.save();
    creator.blogs.push(createdBlog);
    await creator.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating blog failed", 500);
    return next(error);
  }
  res.status(201).json({ blog: createdBlog });
};

const AllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
    // userWithPlaces = await User.findById(userId).populate('places'); alternate way to get places...
    //we can only use populate once we define relation between schemas..
  } catch (err) {
    const error = new HttpError("could not find a blogs", 404);
    return next(error);
  }

  res
    .status(201)
    .json({ blogs: blogs.map((blog) => blog.toObject({ getters: true })) });
};

const getBlogById = async (req, res, next) => {
  const id = req.params.bid;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (err) {
    const error = new HttpError("could not find a blogs", 404);
    return next(error);
  }

  if (!blog) {
    const error = new HttpError("could not find a blogs", 404);
    return next(error);
  }

  res.json({
    blog: blog,
  });
};

const updateBlog = async (req, res, next) => {
  const bid = req.params.bid;
  let blog;

  try {
    blog = await Blog.findById(bid);
  } catch (err) {
    const error = new HttpError("could not find a blogs", 404);
    return next(error);
  }

  console.log(req.userData.userId + "  " + blog.user);

  if (blog.user != req.userData.userId) {
    const error = new HttpError("You are not allowed to update...", 404);
    return next(error);
  }

  const { title, body } = req.body;

  blog.title = title;
  blog.body = body;

  try {
    await blog.save();
  } catch (err) {
    const error = new HttpError("creating blog failed", 500);
    return next(error);
  }
  res.status(201).json({ blog: blog });
};

const deleteBlog = async (req, res, next) => {
  const bid = req.params.bid;
  let blog;
 
  try {
    blog = await Blog.findById(bid).populate("user");
  } catch (err) {
    const error = new HttpError("could not find a blog", 404);
    return next(error);
  }

  if (blog.user._id != req.userData.userId) {
    const error = new HttpError("You are not allowed to update...", 404);
    return next(error);
  }

  try {
    await blog.user.blogs.pull(blog);
    await blog.deleteOne();
    await blog.user.save();
  } catch (err) {
    const error = new HttpError("creating blog failed", 500);
    return next(error);
  }
  res.status(201).json({ message: "blog deleted" });
};

exports.createBlog = createBlog;
exports.AllBlogs = AllBlogs;
exports.getBlogById = getBlogById;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
