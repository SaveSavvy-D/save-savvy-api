const express = require('express');

const router = express.Router();

const {
  createExpense,
  getAllExpenses,
  getExpenseByUserId,
} = require('../controllers/expense.controller.js');
const { validateExpense } = require('../middlewares/validators/expenseValidator.js');
const validateToken = require('../middlewares/auth/authToken.js');

// @route   POST api/expenses
// @desc    Creates a new expense
// @access  Private
router.post('/', [validateToken, validateExpense], createExpense);

// @route   GET api/expenses/my
// @desc    Returns an existing category
// @access  Private
router.get('/my', validateToken, getExpenseByUserId);

// @route   GET api/expenses
// @desc    Returns all existing expenses
// @access  Public
router.get('/', getAllExpenses);

module.exports = router;
