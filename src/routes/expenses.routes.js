const express = require('express');
const router = express.Router();
// const auth = require('../../middleware/auth');
// const Profile = require('../../models/profile');
// const User = require('../../models/user');
const auth = require('../middlewares/authToken');
const { check, validationResult } = require('express-validator/check');

// @route   GET api/expenses/index
// @desc    Get current users profile
// @access  Private
router.post('/', async (req, res) => {
  res.send('Expenses running');
});

module.exports = router;
