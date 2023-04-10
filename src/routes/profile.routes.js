const express = require('express');
const { ProfileController } = require('../controllers');
const { validateProfile } = require('../middlewares/validator');

const router = express.Router();

router.get('/', ProfileController.getProfile);
router.post('/create', validateProfile, ProfileController.createProfile);
router.patch('/:id', ProfileController.updateProfile);

module.exports = router;
