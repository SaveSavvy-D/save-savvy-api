const { Budget } = require('../models');
const {
  sendSuccessResponse,
  sendServerErrorResponse,
  sendNotFoundResponse,
  sendUpdateResponse,
  sendDeleteResponse,
} = require('../utils/response.helper');

const BudgetController = {
  getAllBudgets: async (req, res) => {
    try {
      const budgets = await Budget.find();

      if (budgets.length === 0) {
        return sendNotFoundResponse(res, 'No budget found');
      }

      return sendSuccessResponse(res, { budgets }, 'Budgets fetched successfully');
    } catch (error) {
      console.log('error: ', error);

      return sendServerErrorResponse(res, error);
    }
  },
  getMyBudgets: async (req, res) => {
    try {
      const budgets = await Budget.find({
        userId: req.user.id,
      });

      if (budgets.length === 0) return sendNotFoundResponse(res, 'No budget found');

      return sendSuccessResponse(
        res,
        { budgets },
        'Budgets fetched successfully',
      );
    } catch (error) {
      console.log('error: ', error);

      return sendServerErrorResponse(res, error);
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

      if (!budget) return sendNotFoundResponse(res, 'Budget not found');

      return sendSuccessResponse(
        res,
        { budget },
        'Budget fetched successfully',
      );
    } catch (error) {
      if (error.kind === 'ObjectId') { return sendNotFoundResponse(res, 'Budget not found'); }

      return sendServerErrorResponse(res, error);
    }
  },
  getBudgetByUserId: async (req, res) => {
    const { userId } = req.params;

    try {
      const budgets = await Budget.find({
        userId,
      });

      if (budgets.length === 0) return sendNotFoundResponse(res, 'No budget found');

      return sendSuccessResponse(
        res,
        { budgets },
        'Budgets fetched successfully',
      );
    } catch (error) {
      if (error.kind === 'ObjectId') { return sendNotFoundResponse(res, 'Budget not found'); }
      console.log('error: ', error);

      return sendServerErrorResponse(res, error);
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

      if (budgets.length === 0) return sendNotFoundResponse(res, 'No budget found');

      return sendSuccessResponse(
        res,
        { budgets },
        'Budgets fetched successfully',
      );
    } catch (error) {
      if (error.kind === 'ObjectId') { return sendNotFoundResponse(res, 'Category not found'); }
      console.log('error: ', error);

      return sendServerErrorResponse(res, error);
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

      return sendServerErrorResponse(res, error);
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

      return sendUpdateResponse(res, budget, 'Budget updated successfully');
    } catch (error) {
      if (error.kind === 'ObjectId') { return sendNotFoundResponse(res, 'Budget not found'); }
      console.log('error: ', error);

      return sendServerErrorResponse(res, error);
    }
  },
  deleteBudget: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const deletedBudget = await Budget.findOneAndDelete({ _id: id, userId });

      if (!deletedBudget) {
        return sendNotFoundResponse(res, 'Budget not found');
      }

      return sendDeleteResponse(res, 'Budget deleted');
    } catch (error) {
      if (error.kind === 'ObjectId') { return sendNotFoundResponse(res, 'Budget not found'); }

      return sendServerErrorResponse(res, error);
    }
  },
};

module.exports = BudgetController;
