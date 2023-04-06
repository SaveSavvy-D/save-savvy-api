const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const budgetSchema = new mongoose.Schema({
  threshold: {
    type: Float32Array,
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
  category_id: {
    type: ObjectID,
    ref: 'category',
  },
});

module.exports = mongoose.model('Budget', budgetSchema);
