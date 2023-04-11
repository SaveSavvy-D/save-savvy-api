const express = require('express');
const UserRouter = require('./user.routes');
const ProfileRouter = require('./profile.routes');
const CategoryRouter = require('./categories.routes');
const validateToken = require('../middlewares/authToken');
const BudgetRoutes = require('./budget.routes');

const router = express.Router();

router.use('/auth', UserRouter);
router.use('/profile', validateToken, ProfileRouter);
router.use('/budgets', BudgetRoutes);
// router.use('/expenses', require('./expenses.routes'));

router.use('/categories', validateToken, CategoryRouter);

module.exports = router;
