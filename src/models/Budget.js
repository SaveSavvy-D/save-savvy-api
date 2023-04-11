const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const budgetSchema = new mongoose.Schema({
  threshold: {
    type: Number,
    required: true,
  },
  start_date: {
    type: Date,
    default: Date.now(),
  },
  end_date: {
    type: Date,
    default: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
  user_id: {
    type: ObjectID,
    ref: 'user_id',
    required: true,
  },
  category_id: {
    type: ObjectID,
    ref: 'category',
    required: true,
  },
});

module.exports = mongoose.model('Budget', budgetSchema);
