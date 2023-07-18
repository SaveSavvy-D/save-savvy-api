const { Profile } = require('../../models');
const { serverResponse, notFoundResponse } = require('./validatorResponse');

const validateProfileExists = async (req, res, next) => {
  try {
    const { user } = req;
    const profile = await Profile.findOne({ user: user.id });

    if (!profile) {
      return notFoundResponse(res, 'You need to create a profile first');
    }

    next();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return notFoundResponse(res, 'You need to create a profile first');
    }

    console.log('error: ', error);

    return serverResponse(res, error.message, 'Internal Server Error');
  }
};

module.exports = validateProfileExists;
