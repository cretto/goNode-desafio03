const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');

module.exports = {
  async create(req, res, next) {
    try {
      const post = await Post.findById(req.params.id).populate('comments');
      const owner = await User.findById(post.user);

      if (owner.friends.indexOf(req.userId) === -1 && owner.id !== req.userId) {
        return res.status(400).json({ error: `You don't a friend of ${owner.name}` });
      }

      const comment = await Comment.create({ ...req.body, post: post.id, user: req.userId });

      post.comments.push(comment);
      const updatedPost = await post.save();

      return res.json(updatedPost);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(400).json({ error: 'Comment not found' });
      }

      if (comment.user.toString() !== req.userId.toString()) {
        return res.status(400).json({ error: "You don't allow to delete" });
      }

      const post = await Post.findById(comment.post);
      const postComment = post.comments.indexOf(comment.id);
      if (postComment === -1) {
        return res.status(400).json({ error: 'Comment not found in post' });
      }

      post.comments.splice(postComment, 1);
      await post.save();

      await comment.remove();

      return res.json();
    } catch (err) {
      return next(err);
    }
  },
};
