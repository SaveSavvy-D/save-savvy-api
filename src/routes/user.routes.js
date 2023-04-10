const express = require('express');
const { UserController } = require('../controllers/user.controller');
const { validateUser } = require('../middlewares/validator');

const router = express.Router();

router.post('/login', UserController.login);
router.post('/signup', validateUser, UserController.signup);

module.exports = router;
