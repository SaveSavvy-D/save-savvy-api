const express = require('express');
const UserRouter = require('./user.routes');
const ProfileRouter = require('./profile.routes');
const validateToken = require('../middlewares/authToken');

const router = express.Router();

router.use('/auth', UserRouter);
router.use('/profile', validateToken, ProfileRouter);

module.exports = router;
