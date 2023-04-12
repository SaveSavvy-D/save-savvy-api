const express = require('express');

const router = express.Router();

const {
  createCategory,
  getCategoryById,
  getAllCategories,
} = require('../controllers/category.controller');
const { validateCategory } = require('../middlewares/validators/categoryValidator');

// @route   POST api/categories
// @desc    Creates a new category
// @access  Private
router.post('/', validateCategory, createCategory);

// @route   GET api/categories/:id
// @desc    Returns an existing category
// @access  Private
router.get('/:id', getCategoryById);

// @route   GET api/categories
// @desc    Returns all existing categories
// @access  Private
router.get('/', getAllCategories);

module.exports = router;
