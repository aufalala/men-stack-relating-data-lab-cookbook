const jwt = require('jsonwebtoken');
const User = require('../models/Users.js');

const ACCESS_SECRET = process.env.SESSION_SECRET;

const isSignedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
      const decoded = jwt.verify(token, ACCESS_SECRET);
      req.decoded = decoded;

      const user = await User.findOne({ username: decoded.username});
      req.decoded._id = user._id

      next()  
    } catch (error) {
      return res.status(401).json({ error: "not authorised" })
    }
};

module.exports = isSignedIn;