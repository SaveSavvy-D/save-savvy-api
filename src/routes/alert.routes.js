const express = require('express');
const {
  getAllAlerts, getBudgetAlerts, createBudgetAlerts, updateAlert, deleteAlert,
} = require('../controllers/alert.controller');
const { validateAlert } = require('../middlewares/validators/alertValidator');

const router = express.Router();

router.route('/').get(getAllAlerts).post(validateAlert, createBudgetAlerts);
router.get('/:budgetId', getBudgetAlerts);
router.route('/:id').patch(validateAlert, updateAlert).delete(deleteAlert);

module.exports = router;
