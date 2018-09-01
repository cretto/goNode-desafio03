const mongoose = require('mongoose');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

module.exports = {
  async me(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      const postCount = await Post.find({ user: user.id }).countDocuments();

      return res.json({
        user,
        postCount,
        friendsCount: user.friends.length,
      });
    } catch (err) {
      return next(err);
    }
  },

  async feed(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      const { friends } = user;

      const posts = await Post.find({
        user: { $in: [user.id, ...friends] },
      })
        .limit(50)
        .sort('-createdAt')
        .populate('comments');

      return res.json(posts);
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const {
        name, username, password, confirmPassword,
      } = req.body;
      const id = req.userId;

      if (password && password !== confirmPassword) {
        return res.status(400).json({ error: "Password doesn't match" });
      }

      const user = await User.findByIdAndUpdate(id, { name, username }, { new: true });

      if (password) {
        user.password = password;
        await user.save();
      }

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  },
};
