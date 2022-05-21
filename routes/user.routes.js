const express = require("express");
var path = require("path");
const authController = require("../controllers/auth.controller.js");
const userController = require("../controllers/user.controller.js");
const uploadController = require('../controllers/upload.controller.js');
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
var upload_video = require("../controllers/video_upload");
const router = express.Router();


// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", requireAuth,authController.logout);

// user DB
router.get("/", requireAuth, userController.getAllUsers);
router.get("/:id",requireAuth, userController.userInfo);
router.put("/:id", requireAuth, userController.updateUser);
router.delete("/:id",requireAuth, userController.deleteUser);
router.patch("/follow/:id",requireAuth, userController.follow);
router.patch("/unfollow/:id",requireAuth, userController.unfollow);

// upload
router.post("/upload",requireAuth, uploadController.uploadProfil);
// Video POST handler.
router.post("/video_upload", function (req, res) {

    upload_video(req, function(err, data) {
    
    if (err) {
    return res.status(404).end(JSON.stringify(err));
    }
    
    res.send(data);
    });
});

module.exports = router;
