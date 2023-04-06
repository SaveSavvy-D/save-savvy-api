const Category = require('../models/Category');
const { validationResult } = require('express-validator/check');

const CategoryController = {
  createCategory: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, image } = req.body;

    let newCategory = {
      title,
      description,
      image,
    };

    try {
      let category = await Category.create(newCategory);

      res.json(category);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  },

  getCategoryById: async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }

      res.json(category);
    } catch (err) {
      console.error(err.message);

      if (err.kind == 'ObjectId') {
        return res.status(400).json({ message: 'Category not found' });
      }

      return res.status(500).send('Server Error');
    }
  },

  getAllCategories: async (req, res, next) => {
    try {
      const categories = await Category.find();

      if (!categories) {
        return res.status(400).json({ message: 'Categories not found' });
      }

      res.json(categories);
    } catch (err) {
      console.error(err.message);

      if (err.kind == 'ObjectId') {
        return res.status(400).json({ message: 'Categories not found' });
      }

      return res.status(500).send('Server Error');
    }
  },
};

module.exports = CategoryController;
