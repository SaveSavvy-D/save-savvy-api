const { Profile } = require('../models/index');
const {
  sendSuccessResponse,
  sendServerErrorResponse,
  sendNotFoundResponse,
  sendFailureResponse,
  sendUpdateResponse,
} = require('../utils/response.helper');

const getProfile = async (req, res) => {
  try {
    const { user } = req;
    const profile = await Profile.findOne({ user: user.id });

    if (!profile) {
      return sendNotFoundResponse(res, 'Profile not found');
    }
    return sendSuccessResponse(res, { profile }, 'Profile fetched successfully');
  } catch (error) {
    console.log('error: ', error);
    return sendServerErrorResponse(res, error);
  }
};

const createProfile = async (req, res) => {
  try {
    const { user } = req;
    console.log(user.id);
    const {
      name, image, currency, earningDetails,
    } = req.body;
    const profile = await Profile.findOne({ user: user.id });
    console.log(name, image, currency, earningDetails);
    console.log(profile);
    if (profile) {
      return sendFailureResponse(res, 'Profile already exist');
    }
    const userProfile = await Profile.create({
      name,
      image,
      currency,
      earning_details: earningDetails,
      user: user.id,
    });

    return sendSuccessResponse(res, { userProfile }, 'Profile created successfully');
  } catch (error) {
    console.log('error: ', error);
    return sendServerErrorResponse(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateBody = req.body;
    const profile = await Profile.findByIdAndUpdate(id, updateBody, { new: true });

    if (!profile) {
      return sendNotFoundResponse(res, 'Profile not found');
    }
    return sendUpdateResponse(res, profile, 'Profile updated successfully');
  } catch (error) {
    console.log('error: ', error);
    return sendServerErrorResponse(res, error);
  }
};

module.exports = { getProfile, createProfile, updateProfile };
