const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: ObjectID,
    ref: 'user',
  },
  category: {
    type: ObjectID,
    ref: 'category',
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    min: 0.0,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Expense = mongoose.model('Expense', ExpenseSchema);
