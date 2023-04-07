const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  earning_details: {
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  user: {
    type: ObjectID,
    ref:
    'Profile',
  },
});

module.exports = mongoose.model('Profile', profileSchema);
