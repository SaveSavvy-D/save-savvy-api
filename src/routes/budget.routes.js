const express = require('express');
const routes = express.Router();
const Budget = require('../models/Budget');
const validateToken = require('../middlewares/authToken');
const { check, validationResult } = require('expressValidator/check');
const {
  getAllBudgets,
  getMyBudgets,
  getBudgetById,
  getBudgetByUserId,
  getBudgetByCategoryId,
  createBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budget.controller');
routes.get('/', validateToken, getAllBudgets);

routes.get('/my', validateToken, getMyBudgets);

routes.get('/:id', validateToken, getBudgetById);

routes.get('/:user_id', validateToken, getBudgetByUserId);

routes.get('/category/:category_id', validateToken, getBudgetByCategoryId);

routes.post(
  '/',
  check('threshold', 'Threshold is required').notEmpty(),
  check('category_id', 'CategoryId is required').notEmpty(),
  validateToken,
  createBudget
);

routes.update(
  '/:id',
  check('threshold', 'Threshold is required').notEmpty(),
  check('category_id', 'CategoryId is required').notEmpty(),
  validateToken,
  updateBudget
);

routes.delete('/:id', validateToken, deleteBudget);
