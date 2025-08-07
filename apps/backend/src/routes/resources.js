const express = require('express');
const router = express.Router();


const { prisma } = require('../../prisma/client');

// Obtener todos los recursos
router.get('/', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recursos', details: error.message });
  }
});

// Obtener un recurso por ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await prisma.resource.findUnique({ where: { id: req.params.id } });
    if (!resource) return res.status(404).json({ error: 'Recurso no encontrado' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recurso', details: error.message });
  }
});

// Crear un recurso
router.post('/', async (req, res) => {
  try {
    const resource = await prisma.resource.create({ data: req.body });
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear recurso', details: error.message });
  }
});

// Actualizar un recurso
router.put('/:id', async (req, res) => {
  try {
    const resource = await prisma.resource.update({ where: { id: req.params.id }, data: req.body });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar recurso', details: error.message });
  }
});

// Eliminar un recurso
router.delete('/:id', async (req, res) => {
  try {
    await prisma.resource.delete({ where: { id: req.params.id } });
    res.json({ message: 'Recurso eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar recurso', details: error.message });
  }
});

module.exports = router;
