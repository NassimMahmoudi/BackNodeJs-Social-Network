const express = require('express');
const postController = require('../controllers/post.controller.js');
const upload = require("../middleware/upload.middleware");
const router = express.Router();

router.get('/search', postController.SearchPost);
router.get('/', postController.readPost);
router.post('/', upload, postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);

// comments
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);

module.exports = router;