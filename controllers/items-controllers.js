const HttpError = require("../models/http-error");
const Item = require("../models/items");
const { validationResult } = require("express-validator");

const createItem = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check if date passed in correct format.",
        422
      )
    );
  }

  const { title, description, category, cost, user } = req.body;

  const createdItem = new Item({
    user,
    title,
    description,
    category,
    cost,
  });

  let creator;
  try {
    creator = await User.findById(user);
  } catch (err) {
    const error = new HttpError("Creating item failed", 500);
    return next(error);
  }

  if (!creator) {
    const error = new HttpError("Creator does not exist! ", 500);
    return next(error);
  }

  try {
    await createdItem.save();
    creator.items.push(createdItem);
    await creator.save();
    
  } catch (err) {
    const error = new HttpError("creating Item failed", 500);
    return next(error);
  }
  res.status(201).json({ item: createdItem });
};

const AllItems = async (req, res, next) => {
  let items;
  try {
    items = await Item.find();
  } catch (err) {
    const error = new HttpError("could not find items", 404);
    return next(error);
  }

  res
    .status(201)
    .json({ items: items.map((item) => item.toObject({ getters: true })) });
};

const getItemById = async (req, res, next) => {
  const id = req.params.id;
  let item;
  try {
    item = await Item.findById(id);
  } catch (err) {
    const error = new HttpError("could not find a item", 404);
    return next(error);
  }

  if (!item) {
    const error = new HttpError("could not find a item", 404);
    return next(error);
  }

  res.json({
    item: item,
  });
};

// const updateItem = async (req, res, next) => {
//   const id = req.params.id;
//   let item;

//   try {
//     item = await Item.findById(bid);
//   } catch (err) {
//     const error = new HttpError("could not find a items", 404);
//     return next(error);
//   }

//   // console.log(req.userData.userId + "  " + blog.user);

//   if (blog.user != req.userData.userId) {
//     const error = new HttpError("You are not allowed to update...", 404);
//     return next(error);
//   }

//   const { title, body } = req.body;

//   blog.title = title;
//   blog.body = body;

//   try {
//     await blog.save();
//   } catch (err) {
//     const error = new HttpError("creating blog failed", 500);
//     return next(error);
//   }
//   res.status(201).json({ blog: blog });
// };

// const deleteBlog = async (req, res, next) => {
//   const bid = req.params.bid;
//   let blog;
 
//   try {
//     blog = await Blog.findById(bid).populate("user");
//   } catch (err) {
//     const error = new HttpError("could not find a blog", 404);
//     return next(error);
//   }

//   if (blog.user._id != req.userData.userId) {
//     const error = new HttpError("You are not allowed to update...", 404);
//     return next(error);
//   }

//   try {
//     await blog.user.blogs.pull(blog);
//     await blog.deleteOne();
//     await blog.user.save();
//   } catch (err) {
//     const error = new HttpError("creating blog failed", 500);
//     return next(error);
//   }
//   res.status(201).json({ message: "blog deleted" });
// };


exports.createItem = createItem;
exports.AllItems = AllItems;
exports.getItemById = getItemById;
