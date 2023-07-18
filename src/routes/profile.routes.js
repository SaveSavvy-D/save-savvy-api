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

router
  .route('/')
  .get(getProfile)
  .post(validateProfile, createProfile)
  .delete(deleteProfile);

router.patch('/:id', validateProfile, updateProfile);

module.exports = router;
