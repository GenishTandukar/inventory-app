const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });
  res.json({ token });
};