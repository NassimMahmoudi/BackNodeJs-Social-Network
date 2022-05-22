const express = require("express");
var path = require("path");
const authController = require("../controllers/auth.controller.js");
const userController = require("../controllers/user.controller.js");
const uploadController = require('../controllers/upload.controller.js');
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();


// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", requireAuth,authController.logout);

// user DB
router.get("/", requireAuth, userController.getAllUsers);
//search user
router.get("/search/:name", userController.SearchUsers);
router.get("/:id",requireAuth, userController.userInfo);
router.put("/:id", requireAuth, userController.updateUser);
router.put("/accept-user/:id", userController.acceptUser);
router.delete("/:id",requireAuth, userController.deleteUser);
router.patch("/follow/:id",requireAuth, userController.follow);
router.patch("/unfollow/:id",requireAuth, userController.unfollow);

// upload
router.post("/upload",requireAuth, uploadController.uploadProfil);


module.exports = router;
