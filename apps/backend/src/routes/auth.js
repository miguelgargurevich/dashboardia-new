const express = require('express');
const router = express.Router();


const { prisma } = require('../../prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }
    // Generar token JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    // No enviar la contraseña en la respuesta
    const { password: _, ...userData } = user;
    res.json({ token, user: userData });
  } catch (err) {
    console.error('[login] Error:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
