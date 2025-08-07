const express = require('express');
const router = express.Router();

// Aquí deberías integrar Gemini/OpenAI, por ahora responde mock
router.post('/', async (req, res) => {
  const { prompt } = req.body;
  // TODO: Integrar Gemini/OpenAI
  res.json({ response: `Respuesta IA simulada para: ${prompt}` });
});

module.exports = router;
