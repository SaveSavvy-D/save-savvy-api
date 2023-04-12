const { body } = require('express-validator');
const { validationResponse } = require('./validatorResponse');

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

module.exports = {
  validateProfile,
  validateProfileUpdate,
};
