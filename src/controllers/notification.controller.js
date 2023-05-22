const { Notification } = require('../models');
const {
  sendSuccessResponse,
  sendUpdateResponse,
  sendDeleteResponse,
} = require('../utils/response.helper');
const { serverResponse, notFoundResponse } = require('../middlewares/validators/validatorResponse');

const NotificationController = {
  getAllNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find();

      if (notifications.length === 0) {
        return notFoundResponse(res, 'Notifications not found');
      }

      return sendSuccessResponse(res, { notifications }, 'Notifications fetched successfully');
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  getMyNotifications: async (req, res) => {
    try {
      const { id: userId } = req.user;

      const notifications = await Notification.find({
        userId,
      });

      if (notifications.length === 0) return notFoundResponse(res, 'Notifications not found');

      return sendSuccessResponse(
        res,
        { notifications },
        'Notifications fetched successfully',
      );
    } catch (error) {
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  getNotificationById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const notification = await Notification.find({
        _id: id,
        userId,
      });

      if (!notification) return notFoundResponse(res, 'Notification not found');

      return sendSuccessResponse(
        res,
        { notification },
        'Notification fetched successfully',
      );
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Notification not found'); }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  updateNotification: async (req, res) => {
    const { id } = req.params;
    const {
      message, read, date,
    } = req.body;
    const userId = req.user.id;
    let updatedAttr = {};

    updatedAttr = {
      message, read, date,
    };
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: id, userId },
        { $set: updatedAttr },
        { new: true },
      );

      return sendUpdateResponse(res, { notification }, 'Notification updated successfully');
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Notification not found'); }
      console.log('error: ', error);

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
  deleteNotification: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const deletedNotification = await Notification.findOneAndDelete({ _id: id, userId });

      if (!deletedNotification) {
        return notFoundResponse(res, 'Notification not found');
      }

      return sendDeleteResponse(res, 'Notification deleted successfully');
    } catch (error) {
      if (error.kind === 'ObjectId') { return notFoundResponse(res, 'Notification not found'); }

      return serverResponse(res, error.message, 'Internal Server Error');
    }
  },
};

module.exports = NotificationController;
