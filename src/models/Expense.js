const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
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
