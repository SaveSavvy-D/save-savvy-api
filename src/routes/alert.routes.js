const express = require('express');

const router = express.Router();
const {
  getMyAlerts,
  getBudgetAlerts,
  getAlert,
  createBudgetAlerts,
  updateAlert,
  deleteAlert,
} = require('../controllers/alert.controller');
const { validateAlert } = require('../middlewares/validators/alertValidator');

router.route('/')
  .get(getMyAlerts)
  .post(validateAlert, createBudgetAlerts);
router.get('/budget/:budgetId', getBudgetAlerts);
router.route('/:id')
  .get(getAlert)
  .patch(validateAlert, updateAlert)
  .delete(deleteAlert);

module.exports = router;
