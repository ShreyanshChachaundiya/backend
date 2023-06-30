const express = require("express");
const msgController = require("../controllers/msg-controllers");
const { auth } = require("../middlewares/auth-middle");
const { check } = require("express-validator");

const router = express.Router();

module.exports = router;

router.post("/add", msgController.createMessage);

router.get("/:cid", msgController.getMessage);
