const express = require('express');

const router = express.Router();

const {
  createExpense,
  getAllExpenses,
  deleteExpense,
  getExpenseByUserId,
  updateExpense,
} = require('../controllers/expense.controller.js');
const { validateExpense } = require('../middlewares/validators/expenseValidator.js');
const validateToken = require('../middlewares/auth/authToken.js');

router
  .route('/')
  .get(getAllExpenses)
  .post([validateToken, validateExpense], createExpense)

router
  .route('/:id')
  .patch([validateToken, validateExpense], updateExpense)
  .delete(validateToken, deleteExpense)

router.get('/my', validateToken, getExpenseByUserId);

module.exports = router;
