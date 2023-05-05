const { Budget } = require('../models');
const {
  sendSuccessResponse,
  sendUpdateResponse,
  sendDeleteResponse,
} = require('../utils/response.helper');
const { serverResponse, notFoundResponse } = require('../middlewares/validators/validatorResponse');

const FETCH_LIMIT = 5;

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
      const skip = FETCH_LIMIT * (parseInt(req.query.page) - 1);
      const budgets = await Budget.find({ userId: req.user.id })
        .sort({ startDate: -1, _id: -1 })
        .skip(skip)
        .limit(FETCH_LIMIT)
        .populate('userId', 'email')
        .populate('categoryId', 'title');

      const count = await Budget.countDocuments({ userId: req.user.id });
      const remainingRecords = count - (skip + FETCH_LIMIT);

      if (budgets.length === 0) return notFoundResponse(res, 'Budget not found');

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
      threshold, startDate, endDate, categoryId,
    } = req.body;
    let budgetAttr = {};

    budgetAttr.userId = req.user.id;
    if (startDate) budgetAttr.startDate = startDate;
    if (endDate) budgetAttr.endDate = endDate;
    budgetAttr = { ...budgetAttr, threshold, categoryId };

    try {
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
      startDate, endDate, threshold, categoryId,
    } = req.body;
    const userId = req.user.id;
    let updatedAttr = {};

    if (startDate) updatedAttr.startDate = startDate;
    else updatedAttr.startDate = Date.now();

    if (endDate) updatedAttr.endDate = endDate;
    else {
      updatedAttr.endDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
      );
    }
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
