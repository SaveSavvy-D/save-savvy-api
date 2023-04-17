const { body } = require('express-validator');
const { validationResponse } = require('./validatorResponse');

const validateAlert = [
  body('title', 'Title is required').notEmpty(),
  body('thresholdLimit', 'ThresholdLimit is required').notEmpty()
    .isFloat({ min: 0, max: 1 })
    .withMessage('ThresholdLimit must be between 0 and 1')
    .optional(),
  body('date')
    .notEmpty().withMessage('Date can not be empty')
    .isDate()
    .withMessage('Date must be a valid date')
    .optional(),
  body('thresholdPercentage', 'ThresholdPercentage is required').notEmpty()
    .custom((value) => {
      const percent = parseInt(value.split('%')[0], 10) || 0;

      if (percent <= 0 || percent > 100) {
        throw new Error('Threshold percentage must be between 1 and 100');
      }

      return true;
    }),
  validationResponse,
];

module.exports = { validateAlert };
