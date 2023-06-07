const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Post = require("../models/post");
const User = require("../models/user");


const createPost = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { user, description } = req.body;

  const createdPost = new Post({
    user,
    description,
  });

  let creator;
  try {
    creator = await User.findById(user);
  } catch (err) {
    const error = new HttpError("Creating post failed", 500);
    return next(error);
  }

  if (!creator) {
    const error = new HttpError("Creator does not exist! ", 500);
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdPost.save();
    creator.posts.push(createdPost);
    await creator.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating post failed", 500);
    return next(error);
  }
  res.status(201).json({ post: createdPost });
};

const deletePost = async (req, res, next) => {
  const pId = req.params.pid;

  let post;
  try {
    post = await Post.findById(pId).populate("user"); //this basically help us getting that user object of other schema
    //which has place of provided place id so that we can use by place.creator this refers to that user object
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete post.",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError("Could not find post for this id.", 404);
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    post.deleteOne();
    post.user.posts.pull(post);
    await post.user.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete posts.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted post." });
};

const getPostsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let posts;
  try {
    posts = await Post.find({ user: userId });
    // userWithPlaces = await User.findById(userId).populate('places'); alternate way to get places...
    //we can only use populate once we define relation between schemas..
  } catch (err) {
    const error = new HttpError("could not find a posts", 404);
    return next(error);
  }

  if (!posts || posts.length === 0) {
    const error = new HttpError("could not find a post", 404);
    return next(error);
  }

  res.json({
    posts: posts.map((post) => post.toObject({ getters: true })),
  });
};

const getPostsByPostId = async (req, res, next) => {
  const pId = req.params.pid;
  let posts;
  try {
    posts = await Post.findById(pId);
    // userWithPlaces = await User.findById(userId).populate('places'); alternate way to get places...
    //we can only use populate once we define relation between schemas..
  } catch (err) {
    const error = new HttpError("could not find a posts", 404);
    return next(error);
  }

  if (!posts || posts.length === 0) {
    const error = new HttpError("could not find a post", 404);

    return next(error);
  }

  res.json({
    posts: posts,
  });
};

const like = async (req, res, next) => {
  const id = req.params.uid;
  const pid = req.params.pid;

  try {
    existingUser = await User.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError("User Not Found.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials, could not Found.", 401);
    return next(error);
  }

  let post;
  try {
    post = await Post.findById(pid).populate("user");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete post.",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError("Could not find post for this id.", 404);
    return next(error);
  }
  let isLike = false;
  // post.likes.map((id)=>{
  //   if(id==existingUser._id) isLike=true;
  // })

  if (!post.likes.includes(id)) {
    post.likes.push(existingUser);
  }
  
  await post.save();
  res.status(201).json({ post: post });
};

const getHastags = async (req, res, next) => {
  let posts = {};
  try {
    posts = await Post.find();

    const hashtagCounts = {};

    const hashtagRegex = /#(\w+)/g;

    posts.forEach((post) => {
      const content = post.description;
      const hashtags = content.match(hashtagRegex);
      if (hashtags) {
        hashtags.forEach((hashtag) => {
          if (hashtagCounts[hashtag]) {
            hashtagCounts[hashtag]++;
          } else {
            hashtagCounts[hashtag] = 1;
          }
        });
      }
    });

    const sortedHashtags = Object.keys(hashtagCounts).sort(
      (a, b) => hashtagCounts[b] - hashtagCounts[a]
    );

    const top10Hashtags = sortedHashtags.slice(0, 10);

    res.status(201).json({ hashtags: top10Hashtags });
  } catch (err) {
    const error = new HttpError("Could not find posts.", 404);
    return next(error);
  }
};

const getPostsByHashtag = async (req, res, next) => {
  const hashtag = req.params.hashtag;
  let posts;
  try {
    posts = await Post.find({
      description: { $regex: `#${hashtag}\\b`, $options: "i" },
    });

    if (posts.length == 0) {
      const error = new HttpError("No posts for this hashtag.", 404);
      return next(error);
    }

    res
      .status(201)
      .json({ posts: posts.map((post) => post.toObject({ getters: true })) });
  } catch (err) {
    const error = new HttpError("Netwrok error.", 404);
    return next(error);
  }
};

exports.createPost = createPost;
exports.deletePost = deletePost;
exports.getHastags = getHastags;
exports.like = like;
exports.getPostsByUserId = getPostsByUserId;
exports.getPostsByHashtag = getPostsByHashtag;
exports.getPostsByPostId = getPostsByPostId
