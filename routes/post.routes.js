const express = require('express');
const postController = require('../controllers/post.controller.js');
const upload = require("../middleware/upload.middleware");


const router = express.Router();

router.get('/search/:titre/:categorie/:ville/:delegation', postController.SearchPost);
router.get('/', postController.readPost);
router.get('/posts', postController.readAllPosts);
router.get('/accepted-posts', postController.readAcceptedPosts);
router.get('/my-posts/:id', postController.myPosts);
router.post('/', upload, postController.createPost);
router.put('/:id', postController.updatePost);
router.put('/accept-post/:id', postController.acceptPost);
router.delete('/:id', postController.deletePost);
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);

// comments
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);
// Video POST handler.
router.post('/video-upload', postController.UploadVideo);

module.exports = router;