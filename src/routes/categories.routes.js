const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategoryById,
  getAllCategories,
} = require('../controllers/category.controller');
const validateToken = require('../middlewares/authToken');
const { validateCategory } = require('../middlewares/validator');

// @route   POST api/categories
// @desc    Creates a new category
// @access  Private
router.post('/', [validateToken, validateCategory], createCategory);

// @route   GET api/categories/:id
// @desc    Returns an existing category
// @access  Private
router.get('/:id', validateToken, getCategoryById);

// @route   GET api/categories
// @desc    Returns all existing categories
// @access  Private
router.get('/', validateToken, getAllCategories);

module.exports = router;
