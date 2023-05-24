const express = require('express');
const {
  getAllNotifications,
  getMyNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require('../controllers/notification.controller');

const routes = express.Router();

routes.route('/').get(getAllNotifications);
routes.route('/my').get(getMyNotifications);
routes
  .route('/:id')
  .get(getNotificationById)
  .put(updateNotification)
  .delete(deleteNotification);

module.exports = routes;
