const { body } = require('express-validator');
const { validationResponse } = require('./validatorResponse');

const validateCategory = [
  body('title').notEmpty().withMessage('Category name can not be empty'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Invalid Url')
    .matches(/^https?:\/\/.*\/.*\.(png|webp|jpeg|jpg)\??.*$/gim)
    .withMessage('Invalid image file type'),
  validationResponse,
];

module.exports = { validateCategory };
