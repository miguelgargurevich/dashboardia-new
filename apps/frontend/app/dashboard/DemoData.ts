// Demo data for dashboard preview (replace with real API fetch in production)
export const notes = [
  {
    id: 1,
    title: "Reunión semanal de soporte IA",
    content: "Resumen de la reunión semanal sobre el avance del soporte IA.",
    tags: ["reunión", "soporte", "IA"],
    color: "#f59e42",
    icon: "FaCalendarAlt",
    createdAt: "2024-06-01T10:00:00Z",
    author: { name: "Miguel F." },
    type: "Reunión",
  },
  {
    id: 2,
    title: "Nota técnica: Integración Gemini API",
    content: "Pasos para integrar Gemini API en el backend.",
    tags: ["técnico", "API", "Gemini"],
    color: "#38bdf8",
    icon: "FaTools",
    createdAt: "2024-06-02T12:30:00Z",
    author: { name: "Ana G." },
    type: "Técnica",
  },
];

export const resources = [
  {
    id: 1,
    title: "Manual de usuario IA Soporte",
    description: "Guía completa para usuarios del dashboard IA Soporte.",
    url: "https://example.com/manual-ia.pdf",
    tags: ["manual", "usuario"],
    color: "#f472b6",
    icon: "FaBook",
    createdAt: "2024-05-28T09:00:00Z",
    type: "Manual",
  },
  {
    id: 2,
    title: "Video capacitación Gemini API",
    description: "Video explicativo sobre la integración de Gemini API.",
    url: "https://example.com/video-gemini.mp4",
    tags: ["video", "capacitación"],
    color: "#34d399",
    icon: "FaVideo",
    createdAt: "2024-05-30T15:00:00Z",
    type: "Video",
  },
];

export const events = [
  {
    id: 1,
    title: "Reunión de planificación",
    description: "Planificación de tareas para el próximo sprint.",
    eventType: "Reunión",
    color: "#f59e42",
    startDate: "2024-06-05T09:00:00Z",
    endDate: "2024-06-05T10:00:00Z",
    recurrencePattern: "Semanal",
    location: "Sala 1",
  },
  {
    id: 2,
    title: "Capacitación Gemini API",
    description: "Sesión de capacitación sobre Gemini API.",
    eventType: "Capacitación",
    color: "#38bdf8",
    startDate: "2024-06-07T14:00:00Z",
    endDate: "2024-06-07T16:00:00Z",
    recurrencePattern: "Mensual",
    location: "Sala 2",
  },
];
