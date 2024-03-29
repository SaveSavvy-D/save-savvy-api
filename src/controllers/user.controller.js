const jwt = require('jsonwebtoken');

const { hashpassword, comparePassword } = require('../utils/user.helper');
const { Profile, User } = require('../models');
const {
  sendSuccessResponse,
  sendFailureResponse,
} = require('../utils/response.helper');
const {
  serverResponse,
  notFoundResponse,
} = require('../middlewares/validators/validatorResponse');

const UserController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await comparePassword(password, user.password))) {
        return sendFailureResponse(res, [{ msg: 'Invalid email or password' }]);
      }

      const token = jwt.sign({ userId: user }, process.env.TOKEN_SECRET, {
        expiresIn: '10h',
      });

      return sendSuccessResponse(res, { token }, 'User logged in successfully');
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },

  fetchUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');

      if (!user) return notFoundResponse(res, 'User not found');

      return sendSuccessResponse(res, { user }, 'User fetched successfully');
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },

  signup: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (user) {
        return sendFailureResponse(res, [{ msg: 'User already exist' }]);
      }

      const hashpass = await hashpassword(password);
      const newUser = await User.create({
        email,
        password: hashpass,
      });
      const token = jwt.sign({ userId: newUser }, process.env.TOKEN_SECRET, {
        expiresIn: '10h',
      });

      return sendSuccessResponse(
        res,
        { token, newUser },
        'User created successfully',
      );
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.user;
      const deletedUser = await User.findByIdAndDelete(id);
      const deletedProfile = await Profile.findOneAndDelete({ user: id });

      if (!deletedProfile) {
        return sendSuccessResponse(
          res,
          { deletedUser },
          'User deleted successfully',
        );
      }

      return sendSuccessResponse(
        res,
        { user_id: deletedUser.id, profile_id: deletedProfile.id },
        'User and Profile deleted successfully',
      );
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
};

module.exports = UserController;
