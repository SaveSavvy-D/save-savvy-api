const express = require('express');

const router = express.Router();

const {
  createCategory,
  getCategoryById,
  getAllCategories,
} = require('../controllers/category.controller');
const { validateCategory } = require('../middlewares/validators/categoryValidator');
const validateToken = require('../middlewares/auth/authToken');

router
  .route('/')
  .post([validateToken, validateCategory], createCategory)
  .get(getAllCategories);

router.get('/:id', getCategoryById);

module.exports = router;
