const express = require('express');

const router = express.Router();
const {
  login,
  signup,
  fetchUser,
  deleteUser,
} = require('../controllers/user.controller');
const validateToken = require('../middlewares/auth/authToken');
const {
  validateUser,
  validateLogin,
} = require('../middlewares/validators/userValidator');

router.post('/login', validateLogin, login);
router.post('/signup', validateUser, signup);
router.get('/fetchUser', validateToken, fetchUser);
router.delete('/', validateToken, deleteUser);

module.exports = router;
