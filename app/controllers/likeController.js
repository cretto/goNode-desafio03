const mongoose = require('mongoose');

const Post = mongoose.model('Post');

module.exports = {
  async toggle(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).json({ error: "Post doesn't exists" });
      }

      const liked = post.likes.indexOf(req.userId);

      if (liked === -1) {
        post.likes.push(req.userId);
      } else {
        post.likes.splice(liked, 1);
      }

      await post.save();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },
};
