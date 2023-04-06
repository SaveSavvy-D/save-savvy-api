const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authToken');

const {
  createCategory,
  getCategoryById,
  getAllCategories,
} = require('../controllers/category.controller');

const { check, validationResult } = require('express-validator/check');

// @route   POST api/categories
// @desc    Creates a new category
// @access  Public
router
  .route('/')
  .post([check('title', 'Title is required').not().isEmpty()], createCategory);

// @route   GET api/categories/:id
// @desc    Returns an existing category
// @access  Public
router.route('/:id').get(getCategoryById);

// @route   GET api/categories
// @desc    Returns all existing categories
// @access  Public
router.route('/').get(getAllCategories);

module.exports = router;
