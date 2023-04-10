const express = require('express');
const routes = express.Router();
const Budget = require('../models/Budget');
const validateToken = require('../middlewares/authToken');
const { validateBudget } = require('../middlewares/validator');
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

routes.post('/', validateToken, validateBudget, createBudget);

routes.update('/:id', validateToken, validateBudget, updateBudget);

routes.delete('/:id', validateToken, deleteBudget);
