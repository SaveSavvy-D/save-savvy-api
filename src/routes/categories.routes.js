const express = require('express');

const router = express.Router();

const {
  createCategory,
  getCategoryById,
  getAllCategories,
} = require('../controllers/category.controller');
const { validateCategory } = require('../middlewares/validators/categoryValidator');

router
  .route('/')
  .post(validateCategory, createCategory)
  .get(getAllCategories);

router.get('/:id', getCategoryById);

module.exports = router;
