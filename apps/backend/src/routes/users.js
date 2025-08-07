const express = require('express');
const router = express.Router();
const { prisma } = require('../../prisma/client');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
});

// Crear un usuario
router.post('/', async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear usuario', details: error.message });
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario', details: error.message });
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar usuario', details: error.message });
  }
});

module.exports = router;
