const express = require('express');
const router = express.Router();
const { prisma } = require('../../prisma/client');

// Obtener todos los tipos de evento
router.get('/', async (req, res) => {
  try {
    const tipos = await prisma.tipoEvento.findMany();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipos de evento', details: error.message });
  }
});

// CRUD completo (get by id, post, put, delete)
router.get('/:id', async (req, res) => {
  try {
    const tipo = await prisma.tipoEvento.findUnique({ where: { id: req.params.id } });
    if (!tipo) return res.status(404).json({ error: 'Tipo de evento no encontrado' });
    res.json(tipo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipo de evento', details: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const tipo = await prisma.tipoEvento.create({ data: req.body });
    res.status(201).json(tipo);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear tipo de evento', details: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tipo = await prisma.tipoEvento.update({ where: { id: req.params.id }, data: req.body });
    res.json(tipo);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar tipo de evento', details: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.tipoEvento.delete({ where: { id: req.params.id } });
    res.json({ message: 'Tipo de evento eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar tipo de evento', details: error.message });
  }
});

module.exports = router;
