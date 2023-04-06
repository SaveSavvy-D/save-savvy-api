const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = Category = mongoose.model('category', CategorySchema);
