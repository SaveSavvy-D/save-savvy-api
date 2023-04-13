const mongoose = require('mongoose');

const ObjectID = mongoose.Schema.Types.ObjectId;

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thresholdLimit: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
  },
  date: {
    type: Date,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  budget: {
    type: ObjectID,
    ref: 'Budget',
    required: true,
  },
}, { id: false });

alertSchema
  .virtual('thresholdPercentage')
  .get(function getThresholdPercentage() {
    return `${(this.thresholdLimit * 100).toFixed(2)}%`;
  })
  .set(function setThresholdPercentage(v) {
    const thresholdLimit = v.split('%')[0] / 100;
    console.log(thresholdLimit);
    this.set({ thresholdLimit });
  });

alertSchema.set('toObject', { virtuals: true });
alertSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Alert', alertSchema);
