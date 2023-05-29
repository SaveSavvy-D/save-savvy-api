/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
const { Alert, Budget } = require('../models');
const {
  sendSuccessResponse,
  sendDeleteResponse,
  sendFailureResponse,
} = require('../utils/response.helper');
const { serverResponse, notFoundResponse } = require('../middlewares/validators/validatorResponse');
const { getPercentage } = require('../utils/user.helper');

const FETCH_LIMIT = 5;

const AlertController = {
  getMyAlerts: async (req, res) => {
    try {
      const { user } = req;
      const skip = FETCH_LIMIT * (parseInt(req.query.page) - 1);
      const userBudgets = await Budget.find({ userId: user.id }, '_id');
      const alerts = await Alert.find({ budgetId: { $in: userBudgets } })
        .sort({ date: -1, _id: -1 })
        .skip(skip)
        .limit(FETCH_LIMIT);

      const count = await Alert.find({ budgetId: { $in: userBudgets } }).count();
      const remainingRecords = count - (skip + FETCH_LIMIT);

      if (alerts.length === 0) {
        return notFoundResponse(res, 'No alerts found');
      }

      return sendSuccessResponse(
        res,
        { alerts, remainingRecords },
        'Alerts fetched successfully',
      );
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  getBudgetAlerts: async (req, res) => {
    try {
      const skip = FETCH_LIMIT * (parseInt(req.query.page) - 1);
      const { budgetId } = req.params;
      const alerts = await Alert.find({
        budgetId,
      })
        .sort({ date: -1, _id: -1 })
        .skip(skip)
        .limit(FETCH_LIMIT);

      if (alerts.length === 0) {
        return notFoundResponse(res, 'No alerts found');
      }

      const count = await Alert.find({ budgetId }).count();
      const remainingRecords = count - (skip + FETCH_LIMIT);

      return sendSuccessResponse(
        res,
        { alerts, remainingRecords },
        'Alerts fetched successfully',
      );
    } catch (error) {
      console.log('error: ', error);
      if (error.kind === 'ObjectId') {
        return sendFailureResponse(res, [{ msg: 'Budget not found' }]);
      }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  getAlert: async (req, res) => {
    try {
      const { id } = req.params;
      const alert = await Alert.findOne({ _id: id }).populate({
        path: 'budgetId',
        match: { userId: req.user.id },
        select: '_id',
      });

      if (!alert?.budgetId) {
        return notFoundResponse(res, 'Alert not found');
      }

      return sendSuccessResponse(res, { alert }, 'Alert fetched successfully');
    } catch (error) {
      console.log('error: ', error);
      if (error.kind === 'ObjectId') {
        return sendFailureResponse(res, [{ msg: 'Alert not found' }]);
      }

      return serverResponse(res, error.message, 'Internal Server Error');
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
      const budget = await Budget.findOne({
        _id: budgetId,
        userId: req.user.id,
      });

      if (!budget) {
        return sendFailureResponse(res, [{ msg: 'Budget not found' }]);
      }

      const existingAlerts = await Alert.find({
        budgetId,
      }).sort({ date: 1 });

      let errorMessage = '';

      existingAlerts.forEach((alert) => {
        if (new Date(alert.date) < new Date(date)
          && getPercentage(alert.thresholdPercentage) > getPercentage(thresholdPercentage)) {
          errorMessage = 'Threshold percentage must be greater than the previous alerts for later dates.';
        } else if (new Date(alert.date) > new Date(date)
          && getPercentage(alert.thresholdPercentage) < getPercentage(thresholdPercentage)) {
          errorMessage = 'Threshold percentage must be lower than the later alerts for earlier dates.';
        }
      });

      if (errorMessage) {
        return sendFailureResponse(res, [{ msg: errorMessage }]);
      }

      const alert = await Alert.create(newAlert);

      return sendSuccessResponse(res, alert, 'Alert created successfully');
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
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
      const alert = await Alert.findOne({ _id: id }).populate({
        path: 'budgetId',
        match: { userId: req.user.id },
        select: '_id',
      });

      if (!alert?.budgetId) {
        return notFoundResponse(res, 'Alert not found');
      }

      const updatedAlert = await Alert.findByIdAndUpdate(
        id,
        updateBody,
        { new: true },
      );

      if (!updatedAlert) {
        return notFoundResponse(res, 'Alert not found');
      }

      return sendSuccessResponse(
        res,
        updatedAlert,
        'Alert updated successfully',
      );
    } catch (error) {
      console.log('error: ', error);
      if (error.kind === 'ObjectId') {
        return notFoundResponse(res, 'Alert not found');
      }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  deleteAlert: async (req, res) => {
    const { id } = req.params;

    try {
      const alert = await Alert.findOne({ _id: id }).populate({
        path: 'budgetId',
        match: { userId: req.user.id },
        select: '_id',
      });

      if (!alert?.budgetId) {
        return notFoundResponse(res, 'Alert not found');
      }

      const deletedAlert = await Alert.findOneAndDelete({
        _id: id,
      });

      if (!deletedAlert) {
        return notFoundResponse(res, 'Alert not found');
      }

      return sendDeleteResponse(res, 'Alert deleted successfully');
    } catch (error) {
      console.log('error: ', error);
      if (error.kind === 'ObjectId') {
        return notFoundResponse(res, 'Alert not found');
      }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
};

module.exports = AlertController;
