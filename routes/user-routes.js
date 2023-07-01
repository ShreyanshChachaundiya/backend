const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controllers");
const authMiddleware = require("../middlewares/auth-middle");

const router = express.Router();

// router.use(authMiddleware);

router.get("/all", usersController.allUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() //Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  usersController.signup
);

router.post(
  "/update-password",
  [check("password").isLength({ min: 8 })],
  usersController.update_password
);

router.post("/login", usersController.login);
router.post("/loginByName", usersController.loginByName);
router.post("/forgot-password", usersController.forgot_password);
router.get("/reset-password/:id/:token", usersController.reset_password);
router.get("/:uid", authMiddleware.auth, usersController.getUserById);


module.exports = router;
