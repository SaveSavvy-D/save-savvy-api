const { validationResult } = require('express-validator');
const {
  sendValidationErrorResponse,
  sendServerErrorResponse,
  sendNotFoundResponse,
} = require('../../utils/response.helper');

const validationResponse = (req, res, next) => {
  const errors = validationResult(req).array();

  if (errors.length) {
    const formattedErrors = errors.map(({ value, msg }) => ({ value, msg }));

    return sendValidationErrorResponse(res, formattedErrors);
  }

  return next();
};

const serverResponse = (res, value, msg) => {
  const formattedErrors = [{ value, msg }];

  return sendServerErrorResponse(res, formattedErrors);
};

const notFoundResponse = (res, msg) => {
  const formattedErrors = [{ msg }];

  return sendNotFoundResponse(res, formattedErrors);
};

module.exports = { validationResponse, serverResponse, notFoundResponse };
