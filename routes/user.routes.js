const express = require("express");
const authController = require("../controllers/auth.controller.js");
const userController = require("../controllers/user.controller.js");
const uploadController = require('../controllers/upload.controller.js');
const multer = require("multer");
const upload = multer();
const router = express.Router();

// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// user DB
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

// upload
router.post("/upload", upload.single("file"), uploadController.uploadProfil);

module.exports = router;
