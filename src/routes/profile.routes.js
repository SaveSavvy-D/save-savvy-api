const express = require('express');
const { ProfileController } = require('../controllers/profile.controller');
const { validateProfile, validateProfileUpdate } = require('../middlewares/validator');

const router = express.Router();

router.get('/', ProfileController.getProfile);
router.post('/create', validateProfile, ProfileController.createProfile);
router.patch('/:id', validateProfileUpdate, ProfileController.updateProfile);

module.exports = router;
