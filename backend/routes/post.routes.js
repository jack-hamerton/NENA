const express = require('express');
const router = express.Router();
const controller = require('../controllers/post.controller');
const authJwt = require('../middleware/authJwt'); // Assuming you have a middleware for JWT

router.get('/', controller.getPosts);
router.post('/', authJwt.verifyToken, controller.createPost);
router.post('/:postId/comments', authJwt.verifyToken, controller.addComment);

module.exports = router;
