const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticatedUser } = require("../middlewares/authMiddleware");

router.get("/", userController.getLogin);
router.post("/", userController.postSignup);
router.get("/signup", userController.getSignup);
router.post("/home", userController.postLogin);
router.get("/home", authenticatedUser, userController.getHome);
router.post("/logoutuser", userController.logoutUser);

module.exports = router;