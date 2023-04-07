const express = require('express');
const {
  getProfile,
  createProfile,
  updateProfile,
} = require('../controllers/profile.controller');
const {
  validateProfile,
  validateProfileUpdate,
} = require('../middlewares/validator');

const router = express.Router();

router.get('/', getProfile);
router.post('/create', validateProfile, createProfile);
router.patch('/:id', validateProfileUpdate, updateProfile);

module.exports = router;
