const express = require("express");
var path = require("path");
const authController = require("../controllers/auth.controller.js");
const userController = require("../controllers/user.controller.js");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();
const upload = require("../middleware/uploadProfile.middleware");



// auth
router.post("/register", upload, authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", requireAuth,authController.logout);

// user DB
router.get("/", userController.getAllUsers);
//search user
router.get("/search/:name", userController.SearchUsers);
router.get("/:id",requireAuth, userController.userInfo);
router.put("/:id", requireAuth, userController.updateUser);
router.put("/accept-user/:id", userController.acceptUser);
router.delete("/:id",requireAuth, userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

// upload
router.patch("/upload/:id", upload, userController.uploadProfil);


module.exports = router;
