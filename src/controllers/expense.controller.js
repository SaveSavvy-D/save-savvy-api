const { Expense, Category } = require('../models/index');
const {
  sendSuccessResponse,
  sendFailureResponse,
  sendServerErrorResponse,
  sendDeleteResponse,
  sendNotFoundResponse,
  sendUpdateResponse,
} = require('../utils/response.helper');

const ExpenseController = {
  createExpense: async (req, res) => {
    const {
      title, amount, description, images, date, categoryId,
    } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return sendFailureResponse(res, [{ msg: 'Category not found' }]);
    }

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

  deleteExpense: async (req, res) => {
    try {
      const deletedExpense = await Expense.findOneAndRemove({ _id: req.params.id });
      if (!deletedExpense) {
        return sendNotFoundResponse(res, 'Expense not found');
      }
      return sendDeleteResponse(res, 'Expense deleted');
    } catch (error) {
      if (error.kind === 'ObjectId') { return sendNotFoundResponse(res, 'Expense not found'); }
      return sendServerErrorResponse(res, error);
    }
  },

  updateExpense: async (req, res) => {
    const { id } = req.params;
    const {
      title, amount, description, images, date, categoryId,
    } = req.body;

    const updatedAttr = {
      title, amount, description, images, date, category: categoryId, user: req.user.id,
    };

    const category = await Category.findById(categoryId);
    if (!category) {
      return sendFailureResponse(res, [{ msg: 'Category not found' }]);
    }

    try {
      const expense = await Expense.findByIdAndUpdate(id, updatedAttr, { new: true });
      if (!expense) {
        return sendFailureResponse(res, [{ msg: 'Expense not found' }]);
      }

      return sendUpdateResponse(res, expense, 'Expense updated successfully');
    } catch (error) {
      if (error.kind === 'ObjectId') { return sendNotFoundResponse(res, 'Expense not found'); }
      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
};

module.exports = ExpenseController;
