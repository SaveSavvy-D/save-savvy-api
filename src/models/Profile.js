const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const earningDetailsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  currency: {
    type: String,
    required: true,
  },
  earningDetails: {
    type: [earningDetailsSchema],
    default: () => [
      {
        date: new Date().toISOString().substring(0, 7),
        amount: 0,
      },
    ],
  },
  user: {
    type: ObjectID,
    ref: 'Profile',
  },
});

module.exports = mongoose.model('Profile', profileSchema);
