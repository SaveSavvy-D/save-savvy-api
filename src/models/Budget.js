const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const budgetSchema = new mongoose.Schema({
  threshold: {
    type: Number,
    required: true,
  },
  month: {
    type: Date,
    default: Date.now(),
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
