const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, process.env.TOKEN_SECRET, async (err, authData) => {
      if (err) {
        console.log(err, 'error in token verify');
        return res.sendStatus(403);
      }
      const user = await User.findById(authData.userId);
      if (!user) {
        return res.sendStatus(403);
      }
      req.user = user;
      return next();
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

module.exports = validateToken;
