const Budget = require('../models/Budget');
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
      if (budgets.length === 0)
        return sendNotFoundResponse(res, 'No budget found');
      return sendSuccessResponse(
        res,
        { budgets },
        'Budgets fetched successfully'
      );
    } catch (error) {
      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
  getMyBudgets: async (req, res) => {
    try {
      const budgets = await Budget.find({
        user_id: req.user.id,
      });
      if (!budgets) return sendNotFoundResponse(res, 'No budget found');
      return sendSuccessResponse(
        res,
        { budgets },
        'Budgets fetched successfully'
      );
    } catch (error) {
      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
  getBudgetById: async (req, res) => {
    const { id } = req.params;
    try {
      const budget = await Budget.findById(id);
      if (!budget) return sendNotFoundResponse(res, 'Budget not found');
      return sendSuccessResponse(
        res,
        { budget },
        'Budgets fetched successfully'
      );
    } catch (error) {
      if (error.kind === 'ObjectId')
        return sendNotFoundResponse(res, 'Budget not found');
      return sendServerErrorResponse(res, error);
    }
  },
  getBudgetByUserId: async (req, res) => {
    const { user_id } = req.params;
    try {
      const budgets = await Budget.find({
        user_id: user_id,
      });
      if (!budgets) return sendNotFoundResponse(res, 'No budget found');
      return sendSuccessResponse(
        res,
        { budgets },
        'Budgets fetched successfully'
      );
    } catch (error) {
      if (error.kind === 'ObjectId')
        return sendNotFoundResponse(res, 'Budget not found');
      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
  getBudgetByCategoryId: async (req, res) => {
    const { category_id } = req.params;
    try {
      const budgets = await Budget.find({
        category_id: category_id,
      });
      if (!budgets) return sendNotFoundResponse(res, 'No budget found');
      return sendSuccessResponse(
        res,
        { budgets },
        'Budgets fetched successfully'
      );
    } catch (error) {
      if (error.kind === 'ObjectId')
        return sendNotFoundResponse(res, 'Budget not found');
      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
  createBudget: async (req, res) => {
    const { threshold, start_date, end_date, category_id } = req.body;
    const budgetAttr = {};
    budgetAttr.user_id = req.user.id;
    if (start_date) budgetAttr.start_date = start_date;
    if (end_date) budgetAttr.end_date = end_date;
    budgetAttr = { ...budgetAttr, threshold, category_id };

    try {
      const budget = new Budget(budgetAttr);
      await budget.save();
      return sendSuccessResponse(
        res,
        { budget },
        'Budget created successfully'
      );
    } catch (error) {
      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
  updateBudget: async (req, res) => {
    const { id } = req.params;
    const updatedAttr = {};
    start_date
      ? (updatedAttr.start_date = start_date)
      : (updatedAttr.start_date = Date.now);
    end_date
      ? (updatedAttr.end_date = end_date)
      : (updatedAttr.end_date = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ));
    updatedAttr = {
      ...updatedAttr,
      user_id: req.user.id,
      threshold,
      category_id,
    };
    try {
      const budget = await Budget.findById(id);
      if (budget) {
        const budget = await Budget.findOneAndUpdate(
          { id: id },
          { $set: updatedAttr },
          { new: true }
        );
        return sendUpdateResponse(res, budget, 'Budget updated successfully');
      }
      return sendNotFoundResponse(res, 'Budget not found');
    } catch (error) {
      if (error.kind === 'ObjectId')
        return sendNotFoundResponse(res, 'Budget not found');
      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
  deleteBudget: async (req, res) => {
    const { id } = req.params;
    try {
      await Budget.findOneAndRemove({ _id: id });
      return sendDeleteResponse(res, 'Budget deleted');
    } catch (error) {
      if (error.kind === 'ObjectId')
        return sendNotFoundResponse(res, 'Budget not found');
      return sendServerErrorResponse(res, error);
    }
  },
};

module.exports = BudgetController;
