const { prisma } = require('./client');

const bcrypt = require('bcryptjs');

async function main() {
  await prisma.event.deleteMany({});
  // await prisma.resource.deleteMany({}); // No eliminar recursos existentes
  await prisma.note.deleteMany({});
  const now = new Date();

  // Tipos de Eventos
  const tiposEventos = [
    { nombre: 'Capacitacion', icono: 'fa-graduation-cap', color: '#22c55e' },
    { nombre: 'Reunion', icono: 'fa-users', color: '#facc15' },
    { nombre: 'Notificaciones', icono: 'fa-bell', color: '#6366f1' },
    { nombre: 'Otro', icono: 'fa-calendar-alt', color: '#6b7280' }
  ];
  for (const t of tiposEventos) {
    const exists = await prisma.tipoEvento.findUnique({ where: { nombre: t.nombre } });
    if (!exists) {
      await prisma.tipoEvento.create({ data: t });
    } else {
      await prisma.tipoEvento.update({
        where: { nombre: t.nombre },
        data: { icono: t.icono, color: t.color }
      });
    }
  }
  // Tipos de Notas
  const tiposNotas = [
    { nombre: 'Manual', descripcion: 'Manuales de usuario y técnicos', icono: 'fa-book', color: '#22c55e' },
    { nombre: 'Guía', descripcion: 'Guías de referencia rápida', icono: 'fa-compass', color: '#a21caf' },
    { nombre: 'Nota', descripcion: 'Notas generales y recordatorios', icono: 'fa-sticky-note', color: '#facc15' },
    { nombre: 'Checklist', descripcion: 'Listas de verificación', icono: 'fa-check-square', color: '#fb923c' },
    { nombre: 'Incidente', descripcion: 'Documentación de incidentes', icono: 'fa-bug', color: '#ef4444' },
    { nombre: 'Recordatorio', descripcion: 'Recordatorio importante', icono: 'fa-bell', color: '#3b82f6' },
    { nombre: 'Idea', descripcion: 'Idea creativa', icono: 'fa-lightbulb', color: '#fde68a' },
    { nombre: 'Tarea', descripcion: 'Tarea pendiente', icono: 'fa-tasks', color: '#6366f1' },
  ];
  for (const tn of tiposNotas) {
    const exists = await prisma.tipoNota.findUnique({ where: { nombre: tn.nombre } });
    if (!exists) {
      await prisma.tipoNota.create({ data: tn });
    } else {
      await prisma.tipoNota.update({
        where: { nombre: tn.nombre },
        data: { descripcion: tn.descripcion, icono: tn.icono, color: tn.color }
      });
    }
  }
  // Tipos de Recursos
  const tiposRecursos = [
    { nombre: 'Documentos PDF', descripcion: 'Archivos PDF y documentación', icono: 'fa-file-pdf', color: '#ef4444' },
    { nombre: 'Enlaces Web', descripcion: 'URLs y recursos en línea', icono: 'fa-link', color: '#3b82f6' },
    { nombre: 'Videos', descripcion: 'Contenido multimedia y tutoriales', icono: 'fa-video', color: '#a21caf' },
    { nombre: 'Archivos', descripcion: 'Documentos y archivos varios', icono: 'fa-file', color: '#22c55e' },
    { nombre: 'Notas', descripcion: 'Notas y apuntes rápidos', icono: 'fa-sticky-note', color: '#facc15' },
    { nombre: 'Plantillas', descripcion: 'Formularios y plantillas', icono: 'fa-file-alt', color: '#6366f1' },
    { nombre: 'Contactos', descripcion: 'Información de contactos externos', icono: 'fa-address-book', color: '#ec4899' },
    { nombre: 'Automatización IA', descripcion: 'Recursos de automatización e IA', icono: 'fa-robot', color: '#06b6d4' }
  ];
  for (const tr of tiposRecursos) {
    const exists = await prisma.tipoRecurso.findUnique({ where: { nombre: tr.nombre } });
    if (!exists) {
      await prisma.tipoRecurso.create({ data: tr });
    } else {
      await prisma.tipoRecurso.update({
        where: { nombre: tr.nombre },
        data: { descripcion: tr.descripcion, icono: tr.icono, color: tr.color }
      });
    }
  }
  // Eventos de negocio
  // Eventos de negocio (limpiados sin campos inexistentes)
  const businessEvents = [
    {
      validador: "Jose Arce",
      modo: "Manual",
      codigoDana: "17",
      diaEnvio: "7 DE CADA MES",
      relatedResources: ["/files/manual.pdf", "https://youtube.com/azure"],
      title: "Validar si se cae - Jose Arce",
      description: "Validar si se cae - Jose Arce - INCLUSION ACUMULADA (CLIENTE)",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 7
    },
    {
      validador: "Jose Arce",
      modo: "Manual",
      codigoDana: "18",
      diaEnvio: "6 DE CADA MES",
      relatedResources: ["https://intranet/vpn"],
      title: "Validar si se cae - Jose Arce",
      description: "Validar si se cae - Jose Arce - INCLUSION ACUMULADA (BROKER)",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 6
    },
    {
      validador: "Jose Arce",
      modo: "Manual",
      codigoDana: "26",
      diaEnvio: "20 DE CADA MES",
      relatedResources: ["/uploads/backup.pdf"],
      title: "Jose Arce",
      description: "VG Cobranzas Borker  - 20.06 5pm",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 20
    },
    {
      validador: "Jose Arce",
      modo: "Manual",
      codigoDana: "27",
      diaEnvio: "19 DE CADA MES",
      relatedResources: ["https://soporte.empresa.com"],
      title: "Jose Arce",
      description: "VG Cobranzas Cliente - 19.06 5pm",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 19
    },
    {
      validador: "Automático",
      modo: "Automatico",
      codigoDana: "13",
      diaEnvio: "2 DE CADA MES",
      relatedResources: ["https://wiki.empresa.com"],
      title: "Notificación Poliza Suspendiad 1º Envio",
      description: "Notificación Poliza Suspendiad 1º Envio",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 2
    },
    {
      validador: "Automático",
      modo: "Automatico",
      codigoDana: "13",
      diaEnvio: "21 DE CADA MES",
      relatedResources: ["https://panel.empresa.com"],
      title: "Notificación Poliza Suspendiad 2º Envio",
      description: "Notificación Poliza Suspendiad 2º Envio",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 21
    },
    {
      validador: "Automático",
      modo: "Automatico",
      codigoDana: "1",
      diaEnvio: "22 DE CADA MES",
      relatedResources: [],
      title: "Posible suspension de Cobertura",
      description: "Posible suspension de Cobertura",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 22
    },
    {
      validador: "Mailling Bot",
      modo: "Manual",
      codigoDana: "19",
      diaEnvio: "Las 1ras SEMANA DE CADA MES",
      relatedResources: [],
      title: "Mailling",
      description: "Mailling",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 2
    },
    {
      validador: "TASKAGENT",
      modo: "Manual",
      codigoDana: "19",
      diaEnvio: "22 DE CADA MES / CUANDO LO SOLICITE BENNY X CORREO",
      relatedResources: ["/files/manual.pdf"],
      title: "WSM Mailing Liquidaciones Pendiendtes de pago",
      description: "WSM Mailing Liquidaciones Pendiendtes de pago",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 22
    },
    {
      validador: "Anthony Mederos",
      modo: "Manual",
      codigoDana: "25",
      diaEnvio: "1er VIERNES  DE CADA MES",
      relatedResources: ["https://youtube.com/teams"],
      title: "LIQUIDACIONES WSM",
      description: "LIQUIDACIONES WSM",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 7
    },
    {
      validador: "Si se cae- Fernando debe avisar",
      modo: "Manual",
      codigoDana: "23",
      diaEnvio: "9 de cada mes",
      relatedResources: ["/uploads/manual-usuario.pdf"],
      title: "Vida Ley ex empleados",
      description: "Vida Ley ex empleados",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 9
    },
    {
      validador: "ReportBot",
      modo: "Manual",
      codigoDana: "99",
      diaEnvio: "A DEMANDA (1 vez al mes)",
      relatedResources: ["/uploads/solicitud-acceso.docx"],
      title: "Reportes integrales de agencia",
      description: "Reportes integrales de agencia",
      location: "",
      eventType: "Notificaciones",
      recurrencePattern: "mensual",
      recurrentDay: 1
    }
  ];
  for (const e of businessEvents) {
    for (let mes = 0; mes < 12; mes++) {
      const year = now.getFullYear();
      let day = e.recurrentDay;
      const daysInMonth = new Date(year, mes + 1, 0).getDate();
      if (day > daysInMonth) day = daysInMonth;
      const startDate = new Date(year, mes, day, 9, 0, 0);
      const endDate = new Date(year, mes, day, 10, 0, 0);
      let eventData = {
        ...e,
        startDate,
        endDate,
        relatedResources: [],
        eventType: e.eventType
      };
      delete eventData.recurrentDay;
      await prisma.event.create({ data: eventData });
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
