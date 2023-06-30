const express = require("express");
const convsController = require("../controllers/conv-controllers");
const { auth } = require("../middlewares/auth-middle");
const { check } = require("express-validator");

const router = express.Router();

module.exports = router;

router.post("/add", convsController.createConversation);

router.get("/:id", convsController.getConversation);
