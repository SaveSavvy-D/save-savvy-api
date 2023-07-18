const { body } = require('express-validator');
const { validationResponse } = require('./validatorResponse');

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
};
