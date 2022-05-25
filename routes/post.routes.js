const express = require('express');
const postController = require('../controllers/post.controller.js');
const upload = require("../middleware/upload.middleware");
const {checkUser, checkAdmin, requireAuth} = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/search/:titre/:categorie/:ville/:delegation',requireAuth, postController.SearchPost);
router.get('/get-post/:id',requireAuth, postController.readPost);
router.get('/',checkAdmin, postController.readAllPosts);
router.get('/accepted-posts',requireAuth, postController.readAcceptedPosts);
router.get('/my-posts/:id',checkUser, postController.myPosts);
router.post('/', [checkUser,upload], postController.createPost);
router.put('/:id',requireAuth, postController.updatePost);
router.put('/accept-post/:id',checkAdmin, postController.acceptPost);
router.delete('/:id',requireAuth, postController.deletePost);
router.patch('/like-post/:id',checkUser, postController.likePost);
router.patch('/unlike-post/:id',checkUser, postController.unlikePost);

// comments
router.patch('/comment-post/:id',checkUser, postController.commentPost);
router.patch('/edit-comment-post/:id',checkUser, postController.editCommentPost);
router.patch('/delete-comment-post/:id',requireAuth, postController.deleteCommentPost);
// Video POST handler.
router.patch('/video-upload/:id',checkUser, postController.UploadVideo);

module.exports = router;