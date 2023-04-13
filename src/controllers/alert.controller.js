const { Alert, Budget } = require('../models');
const {
  sendNotFoundResponse, sendSuccessResponse, sendServerErrorResponse, sendDeleteResponse,
} = require('../utils/response.helper');

const AlertController = {
  getAllAlerts: async (req, res) => {
    try {
      const { user } = req;
      const userBudgets = await Budget.find({ userId: user.id }, '_id');
      const alerts = await Alert.find({ budget: { $in: userBudgets } });
      console.log(userBudgets);
      if (alerts.length === 0) {
        return sendNotFoundResponse(res, 'No alerts found');
      }

      return sendSuccessResponse(
        res,
        { alerts },
        'Alerts fetched successfully',
      );
    } catch (error) {
      console.log('error: ', error);
      return sendServerErrorResponse(res, error);
    }
  },
  getBudgetAlerts: async (req, res) => {
    try {
      const { budgetId } = req.params;
      const alerts = await Alert.find({ budget: budgetId });
      console.log(alerts);
      if (alerts.length === 0) {
        return sendNotFoundResponse(res, 'No alerts found');
      }

      return sendSuccessResponse(
        res,
        { alerts },
        'Alerts fetched successfully',
      );
    } catch (error) {
      console.log('error: ', error);
      if (error.kind === 'ObjectId') {
        return sendNotFoundResponse(res, 'Budget not found');
      }

      return sendServerErrorResponse(res, error);
    }
  },
  createBudgetAlerts: async (req, res) => {
    const {
      title, description, thresholdPercentage, date, budget,
    } = req.body;
    const newAlert = {
      title,
      description,
      thresholdPercentage,
      date,
      budget,
    };
    try {
      const alert = await Alert.create(newAlert);

      return sendSuccessResponse(
        res,
        alert,
        'Alert created successfully',
      );
    } catch (error) {
      console.log('error for Obj: ', error);
      if (error.kind === 'ObjectId') {
        return sendNotFoundResponse(res, 'Invalid budget id');
      }

      return sendServerErrorResponse(res, error);
    }
  },
  updateAlert: async (req, res) => {
    const { id } = req.params;
    const updateBody = req.body;
    if (updateBody.thresholdPercentage) {
      const thresholdLimit = updateBody.thresholdPercentage.split('%')[0] / 100;
      updateBody.thresholdLimit = thresholdLimit;
    }
    try {
      const alert = await Alert.findOneAndUpdate(
        id,
        updateBody,
        { new: true },
      );

      return sendSuccessResponse(
        res,
        alert,
        'Alert updated successfully',
      );
    } catch (error) {
      console.log('error: ', error);
      if (error.kind === 'ObjectId') {
        return sendNotFoundResponse(res, 'Alert not found');
      }

      return sendServerErrorResponse(res, error);
    }
  },
  deleteAlert: async (req, res) => {
    const { id } = req.params;
    try {
      await Alert.findByIdAndDelete(id);
      return sendDeleteResponse(res, 'Alert deleted successfully');
    } catch (error) {
      console.log('error: ', error);
      if (error.kind === 'ObjectId') {
        return sendNotFoundResponse(res, 'Alert not found');
      }

      return sendServerErrorResponse(res, error);
    }
  },
};

module.exports = AlertController;
