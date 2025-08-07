const express = require('express');
const router = express.Router();
const { prisma } = require('../../prisma/client');

// Obtener todos los tipos de nota
router.get('/', async (req, res) => {
  try {
    const tipos = await prisma.tipoNota.findMany();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipos de nota', details: error.message });
  }
});

// CRUD completo (get by id, post, put, delete)
router.get('/:id', async (req, res) => {
  try {
    const tipo = await prisma.tipoNota.findUnique({ where: { id: req.params.id } });
    if (!tipo) return res.status(404).json({ error: 'Tipo de nota no encontrado' });
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo de nota', details: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const tipo = await prisma.tipoNota.create({ data: req.body });
    res.status(201).json(tipo);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear tipo de nota', details: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tipo = await prisma.tipoNota.update({ where: { id: req.params.id }, data: req.body });
    res.json(tipo);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar tipo de nota', details: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.tipoNota.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tipo de nota eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar tipo de nota', details: error.message });
  }
});

module.exports = router;
