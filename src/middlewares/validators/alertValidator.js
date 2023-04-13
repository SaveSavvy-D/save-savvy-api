const { body } = require('express-validator');
const { validationResponse } = require('./validatorResponse');

const validateAlert = [
  body('title', 'Title is required').notEmpty(),
  body('thresholdLimit', 'ThresholdLimit is required').notEmpty()
    .isFloat({ min: 0, max: 1 })
    .withMessage('ThresholdLimit must be between 0 and 1')
    .optional(),
  body('thresholdPercentage', 'ThresholdPercentage is required').notEmpty()
    .custom((value) => {
      const percent = parseInt(value.split('%')[0], 10) || 0;
      console.log('Percent: ', percent);
      if (percent <= 0 || percent > 100) {
        throw new Error('Invalid ThresholdPercentage');
      }
      return true;
    }),
  validationResponse,
];

module.exports = { validateAlert };
