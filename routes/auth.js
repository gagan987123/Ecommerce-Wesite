const express = require("express");
const authController = require("../controller/auth");
const User = require("../modles/user");
const { check, body } = require("express-validator");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid Email").normalizeEmail(),
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Invalid Email")
    .custom((value, { req }) => {
      // if (value == 'admin@gmail.com') {
      //     throw new Error('this email is forbidden');
      // }
      // return true;
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject(
            "E-Mail exists already, please pick a different one."
          );
        }
      });
    })
    .normalizeEmail(),
  body(
    "password",
    "please enter a password with only number text and at lest 2 special char"
  )
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("password not matching");
    }
    return true;
  }),
  authController.postSignup
);
module.exports = router;
