const { Profile } = require('../models/index');
const {
  sendSuccessResponse,
  sendServerErrorResponse,
  sendNotFoundResponse,
  sendFailureResponse,
  sendUpdateResponse,
} = require('../utils/response.helper');

const ProfileController = {
  getProfile: async (req, res) => {
    try {
      const { user } = req;
      const profile = await Profile.findOne({ user: user.id });
      if (!profile) {
        return sendNotFoundResponse(res, 'Profile not found');
      }

      return sendSuccessResponse(
        res,
        { profile },
        'Profile fetched successfully'
      );
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return sendNotFoundResponse(res, 'Profile not found');
      }

      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
  createProfile: async (req, res) => {
    try {
      const { user } = req;
      const { name, image, currency, earningDetails } = req.body;
      const profile = await Profile.findOne({ user: user.id });
      if (profile) {
        return sendFailureResponse(res, [{ msg: 'Profile already exist' }]);
      }

      const userProfile = await Profile.create({
        name,
        image,
        currency,
        earning_details: earningDetails,
        user: user.id,
      });

      return sendSuccessResponse(
        res,
        { userProfile },
        'Profile created successfully'
      );
    } catch (error) {
      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const updateBody = req.body;
      const profile = await Profile.findByIdAndUpdate(id, updateBody, {
        new: true,
      });
      if (!profile) {
        return sendNotFoundResponse(res, 'Profile not found');
      }

      return sendUpdateResponse(res, profile, 'Profile updated successfully');
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return sendNotFoundResponse(res, 'Profile not found');
      }

      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
};

module.exports = ProfileController;
