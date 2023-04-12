const { body } = require('express-validator');
const { validationResponse } = require('./validatorResponse');

const validateBudget = [
  body('threshold', 'Threshold is required').notEmpty(),
  body('categoryId', 'CategoryId is required').notEmpty(),
  validationResponse,
];

module.exports = { validateBudget };
