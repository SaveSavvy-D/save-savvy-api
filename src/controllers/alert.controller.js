const { Alert, Budget } = require('../models');
const {
  sendNotFoundResponse, sendSuccessResponse, sendServerErrorResponse, sendDeleteResponse,
  sendFailureResponse,
} = require('../utils/response.helper');

const AlertController = {
  getMyAlerts: async (req, res) => {
    try {
      const { user } = req;
      const userBudgets = await Budget.find({ userId: user.id }, '_id');
      const alerts = await Alert.find({ budgetId: { $in: userBudgets } });

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
      const alerts = await Alert.find({ budgetId });

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
        return sendFailureResponse(res, 'Budget not found');
      }

      return sendServerErrorResponse(res, error);
    }
  },
  getAlert: async (req, res) => {
    try {
      const { id } = req.params;
      const alert = await Alert.findById(id);

      if (!alert) {
        return sendNotFoundResponse(res, 'Alert not found');
      }

      return sendSuccessResponse(
        res,
        { alert },
        'Alert fetched successfully',
      );
    } catch (error) {
      console.log('error: ', error);
      if (error.kind === 'ObjectId') {
        return sendFailureResponse(res, 'Alert not found');
      }

      return sendServerErrorResponse(res, error);
    }
  },
  createBudgetAlerts: async (req, res) => {
    const {
      title, description, thresholdPercentage, date, budgetId,
    } = req.body;
    const newAlert = {
      title,
      description,
      thresholdPercentage,
      date,
      budgetId,
    };

    try {
      const budget = await Budget.findById(budgetId);

      if (!budget) {
        return sendFailureResponse(res, [{ msg: 'Budget not found' }]);
      }

      const alert = await Alert.create(newAlert);

      return sendSuccessResponse(
        res,
        alert,
        'Alert created successfully',
      );
    } catch (error) {
      console.log('error: ', error);

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
      const updatedAlert = await Alert.findByIdAndUpdate(
        id,
        updateBody,
        { new: true },
      );

      if (!updatedAlert) {
        return sendNotFoundResponse(res, 'Alert not found');
      }

      return sendSuccessResponse(
        res,
        updatedAlert,
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
      const deletedAlert = await Alert.findByIdAndDelete(id);

      if (!deletedAlert) {
        return sendNotFoundResponse(res, 'Alert not found');
      }

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
