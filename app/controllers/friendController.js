const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  async create(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(400).json({ error: 'User does not exists' });
      }

      if (user.friends.indexOf(req.userId) !== -1) {
        return res.status(400).json({ error: `You're already friend of ${user.username}` });
      }

      user.friends.push(req.userId);
      await user.save();

      const me = await User.findById(req.userId);
      me.friends.push(user.id);
      await me.save();

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(400).json({ error: 'User does not exists' });
      }

      const friend = user.friends.indexOf(req.userId);

      if (friend === -1) {
        return res.status(400).json({ error: `You're not friend of ${user.username}` });
      }

      user.friends.splice(friend, 1);
      await user.save();

      const me = await User.findById(req.userId);
      me.friends.splice(me.friends.indexOf(user.id), 1);
      await me.save();

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },
};
