const { body, validationResult } = require('express-validator');
const { sendValidationErrorResponse } = require('../utils/response.helper');

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

const validateProfile = [
  body('name').notEmpty().withMessage('User Name must be provided'),
  body('currency').notEmpty().withMessage('Currency must be provided'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Invalid Url')
    .matches(/^https?:\/\/.*\/.*\.(png|webp|jpeg|jpg)\??.*$/gim)
    .withMessage('Invalid image file type'),
  validationResponse,
];

const validateProfileUpdate = [
  body('name').notEmpty().withMessage('User Name must be provided').optional(),
  body('currency')
    .notEmpty()
    .withMessage('Currency must be provided')
    .optional(),
  body('image')
    .isURL()
    .withMessage('Invalid Url')
    .matches(/^https?:\/\/.*\/.*\.(png|webp|jpeg|jpg)\??.*$/gim)
    .withMessage('Invalid image file type')
    .optional(),
  validationResponse,
];

const validateBudget = [
  body('threshold', 'Threshold is required').notEmpty(),
  body('category_id', 'CategoryId is required').notEmpty(),
  validationResponse,
];

const validateCategory = [
  body('title').notEmpty().withMessage('Category name can not be empty'),
  validationResponse,
];

module.exports = {
  validateLogin,
  validateUser,
  validateProfile,
  validateProfileUpdate,
  validateBudget,
  validateCategory,
};
