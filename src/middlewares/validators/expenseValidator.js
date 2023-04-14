const { body } = require('express-validator');
const { validationResponse } = require('./validatorResponse');

const validateExpense = [
  body('title')
    .notEmpty()
    .withMessage('Expense title can not be empty'),
  body('amount')
    .notEmpty().withMessage('Amount can not be empty')
    .isNumeric()
    .withMessage('Amount must be a number'),
  body('date')
    .notEmpty().withMessage('Date can not be empty')
    .isDate()
    .withMessage('Date must be a valid date'),
  body('categoryId').notEmpty().withMessage('Category ID can not be empty')
    .isMongoId()
    .withMessage('Invalid Category ID'),
  body('images')
    .optional()
    .notEmpty().withMessage('Images can not be empty')
    .isArray()
    .withMessage('Images must be an array')
    .custom((images) => {
      images.map((image) => {
        if (!/^https?:\/\/.*\/.*\.(png|webp|jpeg|jpg)\??.*$/gim.test(image)) {
          throw new Error(`Invalid image file type for image ${image}`);
        }

        return image;
      });

      return true;
    })
    .withMessage('Invalid image'),
  validationResponse,
];

module.exports = { validateExpense };
