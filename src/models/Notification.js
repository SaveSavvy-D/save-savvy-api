const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: ObjectID,
    ref: 'User',
    required: true,
  },
  alertId: {
    type: ObjectID,
    ref: 'Alert',
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
