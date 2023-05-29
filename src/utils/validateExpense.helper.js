const { Expense, Budget, Alert } = require('../models/index');
const { getGivenYearMonth } = require('./pagination.helper');

async function validateExpense(expense, userId) {
  const { year, month } = getGivenYearMonth(expense.date);
  const expenses = await Expense.find({
    category: expense.category,
    user: userId,
    date: {
      $gte: new Date(`${year}-${month}-01`),
      $lt: new Date(`${year}-${month + 1}-01`),
    },
  });

  const totalAmount = expenses.reduce(
    (acc, exp) => acc + exp.amount,
    0,
  );

  const budgets = await Budget.find({
    categoryId: expense.category,
    userId,
    month: {
      $gte: new Date(`${year}-${month}-01`),
      $lt: new Date(`${year}-${month + 1}-01`),
    },
  });

  const alertsToTrigger = [];

  await Promise.all(
    budgets.map(async (budget) => {
      const alerts = await Alert.find({ budgetId: budget._id });

      alerts.forEach((alert) => {
        const alertEndDate = new Date(alert.date);

        if (
          totalAmount > (alert.thresholdLimit) * budget.threshold
          && expense.date <= alertEndDate && alert.enabled
        ) {
          alertsToTrigger.push(alert);
        }
      });
    }),
  );

  return alertsToTrigger;
}

module.exports = validateExpense;
