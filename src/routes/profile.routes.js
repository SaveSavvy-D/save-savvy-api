const express = require('express');
const { ProfileController } = require('../controllers');

const router = express.Router();

router.get('/', ProfileController.getProfile);
router.post('/create', ProfileController.createProfile);
router.patch('/:id', ProfileController.updateProfile);

module.exports = router;
