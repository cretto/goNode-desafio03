const express = require('express');
const requireDir = require('require-dir');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');

const controllers = requireDir('./controllers');

/**
 * Auth
 */
routes.post('/signup', controllers.authController.signup);
routes.post('/signin', controllers.authController.signin);

/**
 * Auth routes
 */
routes.use(authMiddleware);

/**
 * Users
 */
routes.get('/users/me', controllers.userController.me);
routes.put('/users', controllers.userController.update);
routes.get('/feed', controllers.userController.feed);

/**
 * Friends
 */
routes.post('/friend/:id', controllers.friendController.create);
routes.delete('/friend/:id', controllers.friendController.destroy);

/**
 * Posts
 */
routes.post('/posts', controllers.postController.create);
routes.delete('/posts/:id', controllers.postController.destroy);

/**
 * Comments
 */
routes.post('/posts/:id/comments', controllers.commentController.create);
routes.delete('/posts/:postId/comments/:id', controllers.commentController.destroy);

/**
 * Likes
 */
routes.post('/like/:id', controllers.likeController.toggle);

module.exports = routes;
