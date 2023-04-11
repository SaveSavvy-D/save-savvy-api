const express = require('express');
const { login, signup, deleteUser } = require('../controllers/user.controller');
const validateToken = require('../middlewares/authToken');
const { validateUser, validateLogin } = require('../middlewares/validator');

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/signup', validateUser, signup);
router.delete('/', validateToken, deleteUser);

module.exports = router;
