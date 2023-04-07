const { check } = require('express-validator/check');
const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategoryById,
  getAllCategories,
} = require('../controllers/category.controller');
const validateToken = require('../middlewares/authToken');

// @route   POST api/categories
// @desc    Creates a new category
// @access  Private
router
  .route('/')
  .post(
    [validateToken, [check('title', 'Title is required').not().isEmpty()]],
    createCategory
  );

// @route   GET api/categories/:id
// @desc    Returns an existing category
// @access  Private
router.route('/:id').get(validateToken, getCategoryById);

// @route   GET api/categories
// @desc    Returns all existing categories
// @access  Private
router.route('/').get(validateToken, getAllCategories);

module.exports = router;
