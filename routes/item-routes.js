const express = require("express");
const itemsController = require("../controllers/items-controllers");
const { auth, isAdmin } = require("../middlewares/auth-middle");
const { check } = require("express-validator");

const router = express.Router();

module.exports = router;

router.get("/get/items", auth, itemsController.AllItems);

router.get("/get/items/:id", auth, itemsController.getItemById);

router.post(
  "/add",
  auth,
  [
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("cost").isNumeric(),
    check("category").not().isEmpty(),
  ],
  itemsController.createItem
);

router.patch(
  "/edit/:id",
  [
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("cost").isNumeric(),
    check("category").not().isEmpty(),
  ],
  auth,
  itemsController.updateItem
);

router.delete("/delete/:id", auth, itemsController.deleteItem);
