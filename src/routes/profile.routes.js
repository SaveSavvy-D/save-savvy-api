const express = require('express');

const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} = require('../controllers/profile.controller');
const {
  validateProfile,
} = require('../middlewares/validators/profileValidator');

router.get('/', getProfile);
router.post('/', validateProfile, createProfile);
router.patch('/:id', validateProfile, updateProfile);
router.delete('/', deleteProfile);
module.exports = router;
