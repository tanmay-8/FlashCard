const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, login, getUser } = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post(
    "/register",
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    register
);

router.post(
    "/login",
    body("email").isEmail().withMessage("Invalid email"),
    body("password").exists().withMessage("Password is required"),
    login
);

router.get("/getUser", auth, getUser);

module.exports = router;
