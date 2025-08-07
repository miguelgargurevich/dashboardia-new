const express = require('express');
const router = express.Router();


const { prisma } = require('../../prisma/client');

// Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos', details: error.message });
  }
});

// Obtener un evento por ID
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener evento', details: error.message });
  }
});

// Crear un evento
router.post('/', async (req, res) => {
  try {
    const event = await prisma.event.create({ data: req.body });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear evento', details: error.message });
  }
});

// Actualizar un evento
router.put('/:id', async (req, res) => {
  try {
    const event = await prisma.event.update({ where: { id: req.params.id }, data: req.body });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar evento', details: error.message });
  }
});

// Eliminar un evento
router.delete('/:id', async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: 'Evento eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar evento', details: error.message });
  }
});

module.exports = router;
