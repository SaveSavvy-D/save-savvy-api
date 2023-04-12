const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { sendAuthErrorResponse } = require('../../utils/response.helper');

const validateToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, process.env.TOKEN_SECRET, async (err, authData) => {
      if (err) {
        console.log(err, 'error in token verify');
        return sendAuthErrorResponse(res, 'Not Authorized');
      }
      const user = await User.findById(authData.userId);
      if (!user) {
        return sendAuthErrorResponse(res, 'Not Authorized');
      }
      req.user = user;
      return next();
    });
  } else {
    sendAuthErrorResponse(res, 'Not Authorized');
  }
};

module.exports = validateToken;
