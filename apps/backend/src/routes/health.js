const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Health check OK' });
});

module.exports = router;
