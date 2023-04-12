const { validationResult } = require('express-validator');
const { sendValidationErrorResponse } = require('../../utils/response.helper');

const validationResponse = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length) {
    const formattedErrors = errors.map(({ value, msg }) => ({ value, msg }));
    return sendValidationErrorResponse(res, formattedErrors);
  }
  return next();
};

module.exports = { validationResponse };
