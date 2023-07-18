const { Budget } = require('../models');
const {
  sendSuccessResponse,
  sendUpdateResponse,
  sendDeleteResponse,
  sendFailureResponse,
} = require('../utils/response.helper');
const { serverResponse, notFoundResponse } = require('../middlewares/validators/validatorResponse');
const { getPageSkipLimit } = require('../utils/pagination.helper');

const BudgetController = {
  getAllBudgets: async (req, res) => {
    try {
      const budgets = await Budget.find();

      if (budgets.length === 0) {
        return notFoundResponse(res, 'Budget not found');
      }

      return sendSuccessResponse(res, { budgets }, 'Budgets fetched successfully');
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  getMyBudgets: async (req, res) => {
    try {
      const { page } = req.query;
      const { id: userId } = req.user;
      const { skip = 0, limit = page === 'all' ? 0 : 5 } = getPageSkipLimit(page);
      let count = 0;
      let remainingRecords = 0;

      const budgets = await Budget.find({
        userId,
        month: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        },
      })
        .sort({ month: 1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'email')
        .populate('categoryId', 'title');

      if (budgets.length === 0) return notFoundResponse(res, 'Budgets not found');

      if (req.query.page !== 'all') {
        count = await Budget.countDocuments({
          userId,
          month: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          },
        });
        remainingRecords = count - (skip + limit);
      }

      return sendSuccessResponse(
        res,
        { budgets, remainingRecords },
        'Budgets fetched successfully',
      );
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  getBudgetById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const budget = await Budget.find({
        _id: id,
        userId,
      });

      if (!budget) return notFoundResponse(res, 'Budget not found');

      return sendSuccessResponse(
        res,
        { budget },
        'Budget fetched successfully',
      );
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Budget not found'); }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  getBudgetByUserId: async (req, res) => {
    const { userId } = req.params;

    try {
      const budgets = await Budget.find({
        userId,
      });

      if (budgets.length === 0) return notFoundResponse(res, 'Budget not found');

      return sendSuccessResponse(
        res,
        { budgets },
        'Budgets fetched successfully',
      );
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Budget not found'); }
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  getBudgetByCategoryId: async (req, res) => {
    const { categoryId } = req.params;
    const userId = req.user.id;

    try {
      const budgets = await Budget.find({
        categoryId,
        userId,
      });

      if (budgets.length === 0) return notFoundResponse(res, 'Budget not found');

      return sendSuccessResponse(
        res,
        { budgets },
        'Budgets fetched successfully',
      );
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Category not found'); }
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  createBudget: async (req, res) => {
    const {
      threshold, month, categoryId,
    } = req.body;
    let budgetAttr = {};
    const userId = req.user.id;

    budgetAttr.userId = userId;
    if (month) budgetAttr.month = month;

    budgetAttr = { ...budgetAttr, threshold, categoryId };

    try {
      const budgets = await Budget.find({
        userId,
        categoryId,
        month: {
          $gte: new Date(new Date(month).getFullYear(), new Date(month).getMonth(), 1),
          $lt: new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0),
        },
      });

      if (budgets.length > 0) {
        return sendFailureResponse(
          res,
          [{ msg: 'Budget for this month already exist for this category' }],
        );
      }
      const budget = new Budget(budgetAttr);

      await budget.save();

      return sendSuccessResponse(
        res,
        { budget },
        'Budget created successfully',
      );
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  updateBudget: async (req, res) => {
    const { id } = req.params;
    const {
      month, threshold, categoryId,
    } = req.body;
    const userId = req.user.id;
    let updatedAttr = {};

    if (month) updatedAttr.month = month;
    else updatedAttr.month = Date.now();

    updatedAttr = {
      ...updatedAttr,
      userId: req.user.id,
      threshold,
      categoryId,
    };
    try {
      const budget = await Budget.findOneAndUpdate(
        { _id: id, userId },
        { $set: updatedAttr },
        { new: true },
      );

      return sendUpdateResponse(res, { budget }, 'Budget updated successfully');
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Budget not found'); }
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  deleteBudget: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const deletedBudget = await Budget.findOneAndDelete({ _id: id, userId });

      if (!deletedBudget) {
        return notFoundResponse(res, 'Budget not found');
      }

      return sendDeleteResponse(res, 'Budget deleted successfully');
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Budget not found'); }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
};

module.exports = BudgetController;
