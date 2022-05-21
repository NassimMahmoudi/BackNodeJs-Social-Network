const express = require("express");
const adminController = require("../controllers/admin.controller.js");
const uploadController = require('../controllers/upload.controller.js');
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();

// auth
router.post("/register", adminController.signUp);
router.post("/login", adminController.signIn);
router.get("/logout",checkAdmin, adminController.logout);

// upload
router.post("/upload", uploadController.uploadProfil);

module.exports = router;
