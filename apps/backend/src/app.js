require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);
app.use('/api/tipo-evento', tipoEventoRouter);
app.use('/api/tipo-nota', tipoNotaRouter);
app.use('/api/tipo-recurso', tipoRecursoRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/assistant', assistantRouter);

const PORT = process.env.PORT_DEV || 4000;
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
