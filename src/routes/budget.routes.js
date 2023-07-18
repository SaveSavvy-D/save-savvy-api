const express = require('express');

const routes = express.Router();
const { validateBudget } = require('../middlewares/validators/budgetValidator');
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

routes.route('/').get(getAllBudgets).post(validateBudget, createBudget);
routes.route('/my').get(getMyBudgets);
routes
  .route('/:id')
  .get(getBudgetById)
  .put(validateBudget, updateBudget)
  .delete(deleteBudget);
routes.route('/user/:userId').get(getBudgetByUserId);
routes.route('/category/:categoryId').get(getBudgetByCategoryId);

module.exports = routes;
