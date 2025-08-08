require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { prisma } = require('../prisma/client');

const app = express();

app.use(cors());
// app.use(express.json()); // Eliminar global para evitar conflicto con Multer

// Rutas modulares

const indexRouter = require('./routes/index');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');
const resourcesRouter = require('./routes/resources');
const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');
const tipoEventoRouter = require('./routes/tipoEvento');
const tipoNotaRouter = require('./routes/tipoNota');

const tipoRecursoRouter = require('./routes/tipoRecurso');
const uploadRouter = require('./routes/upload');
const assistantRouter = require('./routes/assistant');

app.use('/api', indexRouter);
app.use('/api/health', healthRouter);

// Aplica express.json() solo a rutas que lo necesitan
app.use('/api/auth', express.json(), authRouter);
app.use('/api/notes', express.json(), notesRouter);
app.use('/api/resources', express.json(), resourcesRouter);
app.use('/api/events', express.json(), eventsRouter);
app.use('/api/users', express.json(), usersRouter);
app.use('/api/tipo-evento', express.json(), tipoEventoRouter);
app.use('/api/tipo-nota', express.json(), tipoNotaRouter);
app.use('/api/tipo-recurso', express.json(), tipoRecursoRouter);
app.use('/api/upload', uploadRouter); // Sin express.json()
app.use('/api/assistant', express.json(), assistantRouter);

const PORT = process.env.PORT_DEV || 4000;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
