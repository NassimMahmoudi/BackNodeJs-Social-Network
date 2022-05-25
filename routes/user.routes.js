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
router.get("/logout", checkUser,authController.logout);

// user DB
router.get("/", checkAdmin, userController.getAllUsers);
//search user
router.get("/search/:name",requireAuth, userController.SearchUsers);
router.get("/:id",requireAuth, userController.userInfo);
router.put("/:id", requireAuth, userController.updateUser);
router.put("/accept-user/:id", checkAdmin, userController.acceptUser);
router.delete("/:id",checkAdmin, userController.deleteUser);
router.patch("/follow/:id",checkUser, userController.follow);
router.patch("/unfollow/:id",checkUser, userController.unfollow);
// Accuiel
router.get("/home/:id",requireAuth, userController.userHome);
// upload
router.patch("/upload/:id", [checkUser,upload], userController.uploadProfil);


module.exports = router;
