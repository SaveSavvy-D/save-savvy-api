const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const {
  sendSuccessResponse,
  sendFailureResponse,
  sendServerErrorResponse,
} = require('../utils/response.helper');
const { hashpassword, comparePassword } = require('../utils/user.helper');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await comparePassword(password, user.password))) {
      return sendFailureResponse(res, 'Invalid email or password');
    }
    const token = jwt.sign({ userId: user }, process.env.TOKEN_SECRET, { expiresIn: '10h' });

    return sendSuccessResponse(res, { token }, 'User logged in successfully');
  } catch (error) {
    console.log('error: ', error);
    return sendServerErrorResponse(res, error);
  }
};

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return sendFailureResponse(res, 'User already exist');
    }
    const hashpass = await hashpassword(password);
    const newUser = await User.create({
      email,
      password: hashpass,
    });
    const token = jwt.sign({ userId: newUser }, process.env.TOKEN_SECRET, { expiresIn: '10h' });

    return sendSuccessResponse(res, { token, newUser }, 'User created successfully');
  } catch (error) {
    console.log('error: ', error);
    return sendServerErrorResponse(res, error);
  }
};

module.exports = { login, signup };
