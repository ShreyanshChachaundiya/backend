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

  const { title, description, category, cost } = req.body;

  const createdItem = new Item({
    title,
    description,
    category,
    cost,
  });

  try {
    await createdItem.save();
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

exports.createItem = createItem;
exports.AllItems = AllItems;
exports.getItemById = getItemById;
