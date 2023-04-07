const express = require('express');
const routes = express.Router();
const Budget = require('../models/Budget');
const { check, validationResult } = require('expressValidator/check');

routes.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find();
    if (!budgets) return res.status(400).json({ msg: 'No budget found' });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

routes.get('/my', async (req, res) => {
  try {
    const budgets = await Budget.find({
      user_id: req.user.id,
    });
    if (!budgets) return res.status(400).json({ msg: 'No budget found' });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

routes.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const budget = await Budget.findById(id);
    if (!budget) return res.status(400).json({ msg: 'No budget found' });
    res.json(budget);
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res.status(400).json({ msg: 'No budget found' });
    res.status(500).json({ msg: 'Server Error' });
  }
});

routes.get('/category/:category_id', async (req, res) => {
  const { category_id } = req.params;
  try {
    const budgets = await Budget.find({
      category_id: category_id,
    });
    if (!budgets) return res.status(400).json({ msg: 'No budget found' });
    res.json(budgets);
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res.status(400).json({ msg: 'No budget found' });
    res.status(500).json({ msg: 'Server Error' });
  }
});

routes.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const budgets = await Budget.find({
      user_id: user_id,
    });
    if (!budgets) return res.status(400).json({ msg: 'No budget found' });
    res.json(budgets);
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res.status(400).json({ msg: 'No budget found' });
    res.status(500).json({ msg: 'Server Error' });
  }
});

routes.post(
  '/',
  check('threshold', 'Threshold is required').notEmpty(),
  check('category_id', 'CategoryId is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (errors) return res.status(400).json({ err: errors.array() });
    const { threshold, start_date, end_date, category_id } = req.body;
    const budgetAttr = {};
    budgetAttr.user_id = req.user.id;
    if (start_date) budgetAttr.start_date = start_date;
    if (end_date) budgetAttr.end_date = end_date;
    budgetAttr = { ...budgetAttr, threshold, category_id };

    try {
      const budget = new Budget(budgetAttr);
      await budget.save();
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

routes.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Budget.findOneAndRemove({ _id: id });
    res.status(204).json({ msg: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

routes.update(
  '/:id',
  check('threshold', 'Threshold is required').notEmpty(),
  check('category_id', 'CategoryId is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (errors) return res.status(400).json({ err: errors.array() });
    const { id } = req.params;
    const updatedAttr = {};
    start_date
      ? (updatedAttr.start_date = start_date)
      : (updatedAttr.start_date = Date.now);
    end_date
      ? (updatedAttr.end_date = end_date)
      : (updatedAttr.end_date = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ));
    updatedAttr = {
      ...updatedAttr,
      user_id: req.user.id,
      threshold,
      category_id,
    };
    try {
      const budget = await Budget.findById(id);
      if (budget) {
        const budget = await Budget.findOneAndUpdate(
          { id: id },
          { $set: updatedAttr },
          { new: true }
        );
        return res.json(budget);
      }
      res.status(400).json({ msg: 'Budget not found' });
    } catch (error) {
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);
