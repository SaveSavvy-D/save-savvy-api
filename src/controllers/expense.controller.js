const { Expense } = require('../models/index');

const {
  sendSuccessResponse,
  sendFailureResponse,
  sendServerErrorResponse,
} = require('../utils/response.helper');

const ExpenseController = {
  createExpense: async (req, res) => {
    const {
      title, amount, description, images, date, categoryId,
    } = req.body;

    const newExpense = {
      title,
      amount: parseFloat(amount),
      description,
      images,
      date: new Date(date),
      user: req.user.id,
      category: categoryId,
    };

    try {
      const expense = await Expense.create(newExpense);

      return sendSuccessResponse(
        res,
        expense,
        'Expense created successfully',
      );
    } catch (err) {
      console.error(err.message);
      return sendServerErrorResponse(res, err.message);
    }
  },

  getAllExpenses: async (req, res) => {
    try {
      const expenses = await Expense.find();

      if (expenses.length === 0) {
        return sendFailureResponse(res, [{ msg: 'Expenses not found' }]);
      }

      return sendSuccessResponse(res, expenses);
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return sendFailureResponse(res, [{ msg: 'Expenses not found' }]);
      }

      return sendServerErrorResponse(res, err.message);
    }
  },

  getExpenseByUserId: async (req, res) => {
    try {
      const expenses = await Expense.find({ user: req.user.id })
        .populate('user', 'email')
        .populate('category', 'title');

      if (expenses.length === 0) {
        return sendFailureResponse(res, [{ msg: 'Expenses not found for current user' }]);
      }

      return sendSuccessResponse(res, expenses);
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return sendFailureResponse(res, [{ msg: 'Expenses not found for current user' }]);
      }

      return sendServerErrorResponse(res, err.message);
    }
  },
};

module.exports = ExpenseController;
