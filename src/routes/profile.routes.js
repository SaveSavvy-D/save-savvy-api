const express = require('express');

const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
} = require('../controllers/profile.controller');
const { validateProfile } = require('../middlewares/validators/profileValidator');

router.get('/', getProfile);
router.post('/create', validateProfile, createProfile);
router.patch('/:id', validateProfile, updateProfile);

module.exports = router;
