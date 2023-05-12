const express = require('express');

const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
} = require('../controllers/profile.controller');
const { validateProfile } = require('../middlewares/validators/profileValidator');

router.get('/', getProfile);
router.post('/', validateProfile, createProfile);
router.patch('/update/:id', validateProfile, updateProfile);

module.exports = router;
