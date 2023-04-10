const { body, validationResult } = require('express-validator');
const { sendValidationErrorResponse } = require('../utils/response.helper');

const validateLogin = [
  body('email').notEmpty().withMessage('Email is required').isEmail()
    .withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req).array();
    const formattedErrors = errors.map(({ value, msg }) => ({ value, msg }));
    if (errors.length) {
      return sendValidationErrorResponse(res, formattedErrors);
    }
    return next();
  },
];

const validateUser = [
  validateLogin,
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req).array();
    const formattedErrors = errors.map(({ value, msg }) => ({ value, msg }));
    if (errors.length) {
      return sendValidationErrorResponse(res, formattedErrors);
    }
    return next();
  },
];

const validateProfile = [
  body('name').notEmpty().withMessage('User Name must be provided'),
  body('currency').notEmpty().withMessage('Currency must be provided'),
  body('image').isURL().withMessage('Invalid Url')
    .matches(/^https?:\/\/.*\/.*\.(png|webp|jpeg|jpg)\??.*$/gmi)
    .withMessage('Invalid image file type'),
  (req, res, next) => {
    const errors = validationResult(req).array();
    const formattedErrors = errors.map(({ value, msg }) => ({ value, msg }));
    if (errors.length) {
      return sendValidationErrorResponse(res, formattedErrors);
    }
    return next();
  },
];

const validateProfileUpdate = [
  body('name').notEmpty().withMessage('User Name must be provided').optional(),
  body('currency').notEmpty().withMessage('Currency must be provided').optional(),
  body('image').isURL().withMessage('Invalid Url')
    .matches(/^https?:\/\/.*\/.*\.(png|webp|jpeg|jpg)\??.*$/gmi)
    .withMessage('Invalid image file type')
    .optional(),
  (req, res, next) => {
    const errors = validationResult(req).array();
    const formattedErrors = errors.map(({ value, msg }) => ({ value, msg }));
    if (errors.length) {
      return sendValidationErrorResponse(res, formattedErrors);
    }
    return next();
  },
];

module.exports = {
  validateLogin,
  validateUser,
  validateProfile,
  validateProfileUpdate,
};
