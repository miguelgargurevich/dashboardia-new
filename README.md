# Dashboard IA Soporte

**Dashboard IA Soporte** es una solución integral para la gestión de soporte técnico, productividad y conocimiento, combinando un frontend robusto en Next.js/React con un backend Node.js/Prisma y PostgreSQL. Incluye autenticación, paneles de visualización, gestión de recursos, eventos, notas, base de conocimiento y un asistente IA (chatbot) con soporte para archivos adjuntos.

---

## 🧠 Propósito de la Aplicación

Centralizar la gestión de soporte técnico, recursos, eventos y conocimiento en una sola plataforma, potenciando la productividad personal y de equipos con ayuda de IA.

---


## 📦 Estructura del Proyecto (Monorepo)

```
├── apps/
│   ├── frontend/           # Next.js App Router (todo el frontend)
│   │   ├── app/            # Código fuente Next.js (api, components, pages, etc.)
│   │   ├── public/         # Archivos públicos y markdown
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   └── ...
│   └── backend/            # Node.js + Express + Prisma (API REST, seed, migraciones)
│       ├── app.js          # Servidor principal
│       ├── prisma/         # Esquema y migraciones de base de datos
│       └── src/            # Rutas y lógica de backend
├── packages/               # (Opcional) Librerías compartidas (utils, types, config, etc.)
├── .env                    # Configuración global (o por app)
├── package.json            # Scripts y dependencias raíz (workspaces)
└── README.md               # Documentación del monorepo
```

---

## 🗄️ Esquema de Base de Datos (Prisma/PostgreSQL)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
}

model Resource {
  id          String   @id @default(cuid())
  tipo        String
  titulo      String
  descripcion String?
  url         String?
  filePath    String?
  tags        String[]
  categoria   String?
  fechaCarga  DateTime @default(now())
}

model Event {
  id                 String   @id @default(cuid())
  title              String
  description        String?
  startDate          DateTime
  endDate            DateTime
  location           String?
  createdAt          DateTime @default(now())
  codigoDana         String?
  diaEnvio           String?
  modo               String?
  validador          String?
  eventType          String
  recurrencePattern  String
  relatedResources   String[]
}

model Note {
  id          String   @id @default(cuid())
  title       String
  content     String
  tipo        String   @default("nota")
  tags        String[]
  context     String?
  keyPoints   String[]
  status      String   @default("activo")
  date        String?
  priority    String?
  relatedResources String[]
  userId      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TipoEvento {
  id          String   @id @default(cuid())
  nombre      String   @unique
  icono       String
  color       String
  activo      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TipoNota {
  id          String   @id @default(cuid())
  nombre      String   @unique
  descripcion String
  icono       String
  color       String
  activo      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TipoRecurso {
  id          String   @id @default(cuid())
  nombre      String   @unique
  descripcion String
  icono       String
  color       String
  activo      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## ⚙️ Especificaciones Técnicas

- **Frontend:** Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL
- **Autenticación:** JWT, seed de usuarios
- **IA:** Google Gemini API u OpenAI (configurable)
- **Archivos:** Soporte para PDF, Word, Excel, imágenes, videos, texto
- **Infraestructura:** Deploy automático en Vercel (frontend) y Render (backend)

---

## 🚀 Especificaciones Funcionales

- Dashboard interactivo con métricas y gráficas
- Base de conocimiento (manuales, procedimientos, artículos)
- Gestión de recursos (archivos, enlaces, videos, notas)
- Calendario de eventos y notas diarias
- Asistente IA (chatbot) con soporte para archivos adjuntos
- Personalización de colores, iconos y configuración
- Búsqueda inteligente y filtros avanzados
- Relación entre recursos y eventos, recursos y notas

---


## 📝 Prompt para crear otra versión monorepo de la app (detallado)

```
Eres un asistente experto en desarrollo de dashboards de soporte técnico y productividad. Quiero que generes una nueva versión de la aplicación "Dashboard IA Soporte" como un monorepo (frontend y backend en la misma raíz) con los siguientes requerimientos detallados:

**Estructura y stack:**
- Estructura monorepo con `/apps/frontend` (Next.js 15, React 18, TypeScript, Tailwind CSS) y `/apps/backend` (Node.js, Express, Prisma, PostgreSQL)
- Workspaces y dependencias compartidas en `/packages` (utils, types, config, hooks, middlewares, etc.)
- Configuración global en `.env` y scripts raíz en `package.json` (usar workspaces)

**Módulos y funcionalidades:**
- Dashboard con métricas, gráficas y paneles personalizables
- Base de Conocimiento (manuales, procedimientos, artículos, markdown)
- Gestión de Recursos (archivos, enlaces, videos, notas, subida a S3/local)
- Calendario de eventos y notas diarias (soporte para eventos recurrentes)
- Asistente IA (chatbot) integrado, con soporte para archivos adjuntos y sugerencias contextuales
- Autenticación JWT, seed de usuarios y roles (admin, user, soporte)
- Búsqueda avanzada, filtros inteligentes y relaciones cruzadas (recursos-eventos, recursos-notas, etc.)
- Personalización de colores, iconos, configuración y branding
- Documentación técnica y funcional clara (README, comentarios, ejemplos de uso)

**Testing y calidad:**
- Testing unitario y de integración (Jest, Testing Library, Supertest)
- Linting, formateo y pre-commit hooks (ESLint, Prettier, Husky)
- Accesibilidad (WCAG 2.1 AA), dark mode, responsive, keyboard navigation
- Performance: lazy loading, code splitting, optimización de imágenes y assets

**DevOps y CI/CD:**
- Scripts para desarrollo local y producción
- Deploy automático: Vercel (frontend), Render/Fly.io (backend)
- Workflows de CI/CD (GitHub Actions) para test, build y deploy

**Ejemplo de endpoints y estructura:**
- `/api/auth/login`, `/api/notes`, `/api/resources`, `/api/events`, `/api/assistant`, `/api/upload`
- `/apps/frontend/app/api/` para rutas Next.js API
- `/apps/backend/src/routes/` para rutas Express
- `/packages/types/` para tipos TypeScript compartidos

**Base de datos:**
- Incluye el esquema Prisma/PostgreSQL completo (User, Resource, Event, Note, TipoEvento, TipoNota, TipoRecurso)
- Migraciones y seed de datos de ejemplo

**Extras:**
- Ejemplo de configuración de S3 y subida de archivos
- Ejemplo de integración con Gemini/OpenAI para el asistente
- Ejemplo de markdown y recursos en `/public/notas-md/`

Optimiza para accesibilidad, rendimiento, escalabilidad y mantenibilidad. Incluye la estructura de carpetas monorepo, el esquema de la base de datos, especificaciones técnicas y funcionales, y recomendaciones de buenas prácticas.
```

---

Autor: Miguel F. Gargurevich

# Dashboard IA Soporte



---

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Principales](#tecnologías-principales)
- [Instalación y Uso](#instalación-y-uso)
- [Autenticación](#autenticación)
- [Funcionalidades Destacadas](#funcionalidades-destacadas)
- [Personalización de Estilos](#personalización-de-estilos)
- [Recomendaciones de Organización](#recomendaciones-de-organización)
- [Autor](#autor)

---

## Descripción General

Dashboard IA Soporte es una solución moderna para la gestión de soporte técnico, combinando un frontend robusto en Next.js/React con un backend Node.js/Prisma y PostgreSQL. Incluye autenticación, paneles de visualización, gestión de recursos, eventos, notas, base de conocimiento y un asistente IA (chatbot) con soporte para archivos adjuntos.

---

## Estructura del Proyecto

```
├── app/                  # Frontend principal (Next.js App Router)
│   ├── api/              # Endpoints API (auth, calendar, content, events, resources, IA, etc.)
│   ├── components/       # Componentes reutilizables (dashboard, charts, IA, modales, etc.)
│   ├── configuracion/    # Configuración y ajustes
│   ├── dashboard/        # Página principal del dashboard
│   ├── knowledge/        # Base de conocimiento
│   ├── lib/              # Librerías utilitarias (auth, gemini, etc.)
│   ├── login/            # Página de login
│   ├── calendar/         # Calendario de eventos y notas
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout global
│   └── page.tsx          # Página raíz
├── backend/              # Backend Node.js (API REST, Prisma, seed, migraciones)
│   ├── app.js            # Servidor principal
│   ├── prisma/           # Esquema y migraciones de base de datos
│   └── src/              # Rutas y lógica de backend
├── lib/                  # Configuración compartida
├── public/               # Archivos públicos y base de conocimiento en markdown
│   └── notas-md/         # Manuales y procedimientos en markdown
├── tailwind.config.js    # Configuración de Tailwind CSS
├── postcss.config.js     # Configuración de PostCSS
├── tsconfig*.json        # Configuración de TypeScript
├── package.json          # Dependencias y scripts
└── README.md             # Documentación del proyecto
```

---

## Tecnologías Principales

- **Frontend:**
  - Next.js 15 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS (colores y fuentes personalizadas)

- **Backend:**
  - Node.js
  - Prisma ORM
  - PostgreSQL

- **Otros:**
  - Autenticación personalizada
  - Asistente IA (Google Gemini API u OpenAI, según configuración)
  - Visualización de datos (gráficas, calendarios, etc.)
  - Soporte para archivos adjuntos (PDF, Word, Excel, imágenes, videos, texto)

---

## Instalación y Uso

1. Clona el repositorio y entra en la carpeta principal.
2. Instala las dependencias del frontend:
   ```bash
   npm install
   ```
3. Inicia el frontend:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en [http://localhost:3000](http://localhost:3000)
4. (Opcional) Inicia el backend desde la carpeta `backend`:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

---


## Autenticación

La autenticación ahora se realiza completamente con Supabase Auth:

- **Email y contraseña:** Registro y login tradicional.
- **Google:** Login con OAuth (Google).
- **Teléfono y código SMS:** Login con número de teléfono y verificación OTP vía Twilio (SMS).

Para el login por teléfono, el usuario ingresa su número, recibe un código SMS y lo verifica en el formulario. El backend de Supabase gestiona la autenticación y Twilio el envío de SMS.

> **Nota:** Ya no se utiliza el seed de usuarios ni la autenticación personalizada del backend. Todo el flujo de login y registro es gestionado por Supabase Auth.

---


## Funcionalidades Destacadas

- **Dashboard interactivo:** Panel principal con gráficas, eventos y recursos recientes.
- **Eventos y calendario:** Gestión de eventos, calendario interactivo, notas diarias y eventos próximos.
- **Base de conocimiento:** Manuales y procedimientos en markdown.
- **Recursos:** Subida, consulta y gestión de archivos recientes.
- **Notas diarias:** Registro y consulta de notas diarias asociadas a eventos o usuarios.
- **Login multi-método:**
  - Email y contraseña (Supabase Auth)
  - Google OAuth
  - Teléfono y código SMS (OTP vía Twilio)
- **Asistente IA (Chatbot):**
  - Flotante en el dashboard, visible solo para usuarios autenticados.
  - Consultas técnicas, ayuda guiada y registro de información.
  - Soporte para adjuntar múltiples archivos (PDF, Word, Excel, imágenes, videos, texto).
  - Los archivos se envían al backend por el endpoint `/api/upload`.
- **Personalización de colores e iconos:** Configuración desde el panel de configuración.

---

## Personalización de Estilos

- Los colores y fuentes se configuran en `tailwind.config.js`.
- El layout global y los estilos base están en `app/layout.tsx` y `app/globals.css`.

---

## Recomendaciones de Organización

- Mantén solo la carpeta `app` en la raíz para el frontend.
- El backend se encuentra en la carpeta `backend`.
- Los manuales y procedimientos deben estar en `public/notas-md/` en formato markdown.

---

## Autor

Miguel F. Gargurevich
