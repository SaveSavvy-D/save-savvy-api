const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  currency: { type: String, required: true },
  user: { type: ObjectID, ref: 'Profile' },
  earning_details: { type: ObjectID, ref: 'EarningDetails' },
});

module.exports = mongoose.model('Profile', profileSchema);
