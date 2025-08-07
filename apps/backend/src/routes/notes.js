const express = require('express');
const router = express.Router();


const { prisma } = require('../../prisma/client');

// Obtener todas las notas
router.get('/', async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notas', details: error.message });
  }
});

// Obtener una nota por ID
router.get('/:id', async (req, res) => {
  try {
    const note = await prisma.note.findUnique({ where: { id: req.params.id } });
    if (!note) return res.status(404).json({ error: 'Nota no encontrada' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener nota', details: error.message });
  }
});

// Crear una nota
router.post('/', async (req, res) => {
  try {
    const note = await prisma.note.create({ data: req.body });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear nota', details: error.message });
  }
});

// Actualizar una nota
router.put('/:id', async (req, res) => {
  try {
    const note = await prisma.note.update({ where: { id: req.params.id }, data: req.body });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar nota', details: error.message });
  }
});

// Eliminar una nota
router.delete('/:id', async (req, res) => {
  try {
    await prisma.note.delete({ where: { id: req.params.id } });
    res.json({ message: 'Nota eliminada' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar nota', details: error.message });
  }
});

module.exports = router;
