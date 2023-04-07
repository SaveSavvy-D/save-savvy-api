const express = require('express');

const router = express.Router();

router.get('/app', (req, res, next) => {
  res.send('Api Running...');
  next();
});

module.exports = router;
