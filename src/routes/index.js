const express = require('express');

const BudgetRouter = require('./budget.routes');
const CategoryRouter = require('./categories.routes');
const ExpenseRouter = require('./expenses.routes');
const ProfileRouter = require('./profile.routes');
const UserRouter = require('./user.routes');
const AlertRouter = require('./alert.routes');
const NotificationRouter = require('./notification.routes');
const validateToken = require('../middlewares/auth/authToken');
const validateProfileExists = require('../middlewares/validators/profileExistsValidator');

const router = express.Router();

router.use('/auth', UserRouter);
router.use('/categories', CategoryRouter);
router.use('/expenses', [validateToken, validateProfileExists], ExpenseRouter);
router.use('/profile', validateToken, ProfileRouter);
router.use('/budgets', [validateToken, validateProfileExists], BudgetRouter);
router.use('/alerts', [validateToken, validateProfileExists], AlertRouter);
router.use('/notifications', validateToken, NotificationRouter);

module.exports = router;
