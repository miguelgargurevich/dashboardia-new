// Tipos compartidos para Dashboard IA Soporte

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  tipo: string;
  titulo: string;
  descripcion?: string;
  url?: string;
  filePath?: string;
  tags: string[];
  categoria?: string;
  fechaCarga: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  createdAt: string;
  codigoDana?: string;
  diaEnvio?: string;
  modo?: string;
  validador?: string;
  eventType: string;
  recurrencePattern: string;
  relatedResources: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tipo: string;
  tags: string[];
  context?: string;
  keyPoints: string[];
  status: string;
  date?: string;
  priority?: string;
  relatedResources: string[];
  userId?: string;
  createdAt: string;
  updatedAt: string;
}
