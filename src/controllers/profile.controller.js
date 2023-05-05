const { Profile } = require('../models');
const {
  sendSuccessResponse,
  sendFailureResponse,
  sendUpdateResponse,
} = require('../utils/response.helper');
const { serverResponse, notFoundResponse } = require('../middlewares/validators/validatorResponse');

const ProfileController = {
  getProfile: async (req, res) => {
    try {
      const { user } = req;
      const profile = await Profile.findOne({ user: user.id });

      if (!profile) {
        return notFoundResponse(res, 'Profile not found');
      }

      return sendSuccessResponse(
        res,
        { profile },
        'Profile fetched successfully',
      );
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return notFoundResponse(res, 'Profile not found');
      }

      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  createProfile: async (req, res) => {
    try {
      const { user } = req;
      const {
        name, image, currency, earningDetails,
      } = req.body;
      const profile = await Profile.findOne({ user: user.id });

      if (profile) {
        return sendFailureResponse(res, [{ msg: 'Profile already exist' }]);
      }

      const userProfile = await Profile.create({
        name,
        image,
        currency,
        earningDetails,
        user: user.id,
      });

      return sendSuccessResponse(
        res,
        { userProfile },
        'Profile created successfully',
      );
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const updateBody = req.body;
      const profile = await Profile.findOneAndUpdate(
        { _id: id, user: req.user.id },
        updateBody,
        { new: true },
      );

      if (!profile) {
        return notFoundResponse(res, 'Profile not found');
      }

      return sendUpdateResponse(res, { profile }, 'Profile updated successfully');
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return notFoundResponse(res, 'Profile not found');
      }

      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
};

module.exports = ProfileController;
