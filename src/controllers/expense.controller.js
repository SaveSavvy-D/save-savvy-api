/* eslint-disable radix */
const { Expense, Category } = require('../models/index');
const {
  sendSuccessResponse,
  sendFailureResponse,
  sendDeleteResponse,
  sendUpdateResponse,
} = require('../utils/response.helper');
const { serverResponse, notFoundResponse } = require('../middlewares/validators/validatorResponse');
const { getCurrentYearMonth, getPageSkipLimit } = require('../utils/pagination.helper');
const validateExpense = require('../utils/validateExpense.helper');
const sendAlerts = require('../utils/sendAlerts.helper');

const ExpenseController = {
  getAllExpenses: async (req, res) => {
    try {
      const expenses = await Expense.find();

      if (expenses.length === 0) {
        return sendFailureResponse(res, [{ msg: 'Expenses not found' }]);
      }

      return sendSuccessResponse(res, { expenses });
    } catch (error) {
      console.error(error.message);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },

  getExpenseByUserId: async (req, res) => {
    try {
      const { page } = req.query;
      const { id: userId } = req.user;
      const { year, month } = getCurrentYearMonth();
      const { skip = 0, limit = page === 'all' ? 0 : 5 } = getPageSkipLimit(page);
      let count = 0;
      let remainingRecords = 0;

      const expenses = await Expense.find({
        user: userId,
        date: {
          $gte: new Date(`${year}-${month}-01`),
          $lt: new Date(`${year}-${month + 1}-01`),
        },
      })
        .sort({ date: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'email')
        .populate('category', 'title');

      if (expenses.length === 0) {
        return sendFailureResponse(res, [{ msg: 'Expenses not found for current user' }]);
      }

      if (req.query.page !== 'all') {
        count = await Expense.countDocuments({
          user: userId,
          date: {
            $gte: new Date(`${year}-${month}-01`),
            $lt: new Date(`${year}-${month + 1}-01`),
          },
        });
        remainingRecords = count - (skip + limit);
      }

      return sendSuccessResponse(
        res,
        { expenses, remainingRecords },
        'Expenses fetched successfully',
      );
    } catch (error) {
      console.error(error.message);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },

  createExpense: async (req, res) => {
    const {
      title, amount, description, images, date, categoryId,
    } = req.body;

    try {
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

      const expense = await Expense.create(newExpense);
      const alertsToTrigger = await validateExpense(expense, req.user.id);

      if (alertsToTrigger.length > 0) {
        sendAlerts(alertsToTrigger, req.user, category.title);
      }

      return sendSuccessResponse(
        res,
        { expense },
        'Expense created successfully',
      );
    } catch (error) {
      console.error(error.message);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },

  updateExpense: async (req, res) => {
    const { id } = req.params;
    const {
      title, amount, description, images, date, categoryId,
    } = req.body;
    const userId = req.user.id;
    const updatedAttr = {
      title, amount, description, images, date, category: categoryId, user: req.user.id,
    };

    try {
      const category = await Category.findById(categoryId);

      if (!category) {
        return sendFailureResponse(res, [{ msg: 'Category not found' }]);
      }

      const expense = await Expense.findOneAndUpdate(
        { _id: id, user: userId },
        updatedAttr,
        { new: true },
      );

      if (!expense) {
        return sendFailureResponse(res, [{ msg: 'Expense not found' }]);
      }

      return sendUpdateResponse(res, { expense }, 'Expense updated successfully');
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Expense not found'); }
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },

  deleteExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedExpense = await Expense.findOneAndDelete({
        _id: id,
        user: req.user.id,
      });

      if (!deletedExpense) {
        return notFoundResponse(res, 'Expense not found');
      }

      return sendDeleteResponse(res, 'Expense deleted');
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Expense not found'); }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
};

module.exports = ExpenseController;
