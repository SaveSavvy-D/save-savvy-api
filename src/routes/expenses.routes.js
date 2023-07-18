const express = require('express');

const router = express.Router();

const {
  createExpense,
  deleteExpense,
  getExpenseByUserId,
  updateExpense,
} = require('../controllers/expense.controller');
const { validateExpense } = require('../middlewares/validators/expenseValidator');
const validateToken = require('../middlewares/auth/authToken');

router
  .route('/')
  .post([validateToken, validateExpense], createExpense);

router
  .route('/:id')
  .patch([validateToken, validateExpense], updateExpense)
  .delete(validateToken, deleteExpense);

router.get('/my', validateToken, getExpenseByUserId);

module.exports = router;
