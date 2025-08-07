const express = require('express');
const router = express.Router();

// TODO: Implementar login con JWT
router.post('/login', async (req, res) => {
  // Lógica de autenticación aquí
  res.json({ token: 'jwt-token-demo', user: { email: req.body.email } });
});

module.exports = router;
