const { body, validationResult } = require('express-validator');
const { sendValidationErrorResponse } = require('../../utils/response.helper');

const validationResponse = (req, res, next) => {
  const errors = validationResult(req).array();
  const formattedErrors = errors.map(({ value, msg }) => ({ value, msg }));
  if (errors.length) {
    return sendValidationErrorResponse(res, formattedErrors);
  }
  return next();
};

const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validationResponse,
];

const validateUser = [
  validateLogin,
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validationResponse,
];

module.exports = {
  validateLogin,
  validateUser,
  validationResponse,
};
