const mongoose = require('mongoose');

const Post = mongoose.model('Post');

module.exports = {
  async create(req, res, next) {
    try {
      const post = await Post.create({ ...req.body, user: req.userId });

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      await Post.findByIdAndRemove(req.params.id);

      return res.json();
    } catch (err) {
      return next(err);
    }
  },
};
