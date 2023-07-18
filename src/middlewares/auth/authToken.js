const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { sendAuthErrorResponse } = require('../../utils/response.helper');

const validateToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, process.env.TOKEN_SECRET, async (error, authData) => {
      if (error) {
        console.log(error, 'error in token verify');

        return sendAuthErrorResponse(res, [{ msg: 'Not Authorized' }]);
      }
      const user = await User.findById(authData.userId);

      if (!user) {
        return sendAuthErrorResponse(res, [{ msg: 'Not Authorized' }]);
      }
      req.user = user;

      return next();
    });
  } else {
    sendAuthErrorResponse(res, [{ msg: 'Not Authorized' }]);
  }
};

module.exports = validateToken;
