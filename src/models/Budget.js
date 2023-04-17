const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const budgetSchema = new mongoose.Schema({
  threshold: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now(),
  },
  endDate: {
    type: Date,
    default: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
  userId: {
    type: ObjectID,
    ref: 'User',
    required: true,
  },
  categoryId: {
    type: ObjectID,
    ref: 'Category',
    required: true,
  },
});

module.exports = mongoose.model('Budget', budgetSchema);
