# 🤖 Academia de Inteligencia Artificial — uniestudiantes.online

Plataforma web para la promoción, inscripción y gestión de cursos interactivos de Inteligencia Artificial. Incluye una landing page, panel de administración protegido con JWT y un portal de estudiantes con contenido interactivo y evaluaciones prácticas.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Ejecución Local](#instalación-y-ejecución-local)
- [API REST — Endpoints](#api-rest--endpoints)
- [Seguridad](#seguridad)

---

## 📖 Descripción General

Este proyecto es una plataforma LMS (Learning Management System) funcional construida con arquitectura Cliente-Servidor separada:

1. **Landing page pública** con animaciones en canvas y estadísticas en tiempo real.
2. **Formulario de inscripción** multi-curso con prevención de duplicados.
3. **Panel de administración** protegido por JWT para aceptar/rechazar alumnos y generar credenciales.
4. **Envío automático de correos** con Resend cuando un alumno es aceptado.
5. **Portal de estudiantes** donde los alumnos acceden al material del curso.
6. **Módulos interactivos** con demos en vivo (ej. evolución de un Algoritmo Genético en un Canvas).
7. **Sistema de evaluaciones persistente** para validar el aprendizaje tras completar los módulos.

---

## ✨ Características

### 🎨 Diseño y Frontend
- **Glassmorphism y Modo Oscuro**: Diseño inmersivo y responsivo.
- **Demos en Vivo**: Visualización de un Algoritmo Genético real resolviendo funciones matemáticas en tiempo real.
- **Herramientas de Datos**: Carga de CSV para calcular modelos de Regresión Lineal en el navegador.

### ⚙️ Funcionalidades del Servidor
- **Anti-duplicidad**: Sistema inteligente que fusiona nuevos cursos a estudiantes existentes en lugar de duplicar cuentas.
- **Generación de Credenciales**: Asignación automática de nombres de usuario y contraseñas seguras.
- **Tokens de Reseteo**: Sistema temporal (15 min) para recuperación y cambio seguro de contraseñas.
- **Optimización de Imágenes**: Subida de avatares comprimidos y convertidos a WEBP automáticamente en el servidor usando `sharp`.

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología | Propósito |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JS | Estructura, estilos y lógica interactiva (sin frameworks pesados) |
| **Gráficos** | Chart.js, HTML5 Canvas | Renderizado de demos de IA y estadísticas |
| **Backend** | Node.js, Express | API REST y servidor de archivos estáticos |
| **Base de Datos** | MongoDB Atlas (Mongoose) | Persistencia de datos en la nube |
| **Autenticación**| JWT (JSON Web Tokens) | Protección de rutas administrativas y control de sesión |
| **Mailing** | Resend API | Envío transaccional rápido y seguro de credenciales |
| **Imágenes** | Sharp | Compresión y redimensionado de imágenes en memoria |

---

## 📁 Estructura del Proyecto

```
academia-ia-main/
├── server.js               # Servidor Node.js (API REST + Auth)
├── .env                    # Variables de entorno (NO se sube a Git)
├── package.json            # Dependencias
└── public/                 # Archivos estáticos del Frontend
    ├── index.html          # Landing y formulario
    ├── login.html          # Portal de inicio de sesión
    ├── admin.html          # Panel administrativo
    ├── dashboard.html      # Portal del estudiante
    ├── course.html         # Visor de cursos y exámenes
    ├── css/
    │   └── styles.css      # Hoja de estilos global
    └── js/
        ├── common.js           # Lógica compartida y configuraciones
        ├── course-content.js   # Catálogo de cursos en formato JSON
        └── ga-demo.js          # Motor del Algoritmo Genético en Canvas
```

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el proyecto:**
   ```bash
   git clone https://github.com/Yonatangutierrez1/academia-ia.git
   cd academia-ia
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar el entorno (`.env`):**
   Crea un archivo `.env` en la raíz con el siguiente formato:
   ```env
   RESEND_API_KEY=tu_clave_de_resend
   EMAIL_FROM=soporte@uniestudiantes.online
   ADMIN_USER=admin
   ADMIN_PASS=admin
   JWT_SECRET=tu_secreto_super_seguro
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/academia?retryWrites=true&w=majority
   PUBLIC_URL=http://localhost:3000
   ```

4. **Iniciar el servidor:**
   ```bash
   node server.js
   ```
   Accede a `http://localhost:3000` en tu navegador.



## 🔒 Seguridad

El proyecto cuenta con las siguientes medidas de seguridad:
- ✅ **Sin secretos en código**: Todo el acceso a BD y API keys se maneja vía `.env`.
- ✅ **CORS Restringido**: Solo el dominio definido en `PUBLIC_URL` puede acceder a la API.
- ✅ **Protección JWT**: Endpoints sensibles de borrado o lectura masiva requieren token Bearer.
- ✅ **Filtro de Datos Sensibles**: La API de login remueve los hashes/contraseñas antes de responder al cliente.
- ✅ **Protección de Assets**: Frontend completamente aislado en la carpeta `public/` servida estáticamente.

---

---

## 🌐 Enlace a la Plataforma (Demo)

Puedes acceder a la plataforma en vivo aquí:
👉 **[https://uniestudiantes.online/](https://uniestudiantes.online/)**

### Credenciales de Prueba (Estudiante)
Para probar el portal del estudiante y ver los cursos sin tener que registrarte, usa este usuario:
- **Usuario:** `demo`
- **Contraseña:** `demo123`

### Credenciales de Administrador
Para probar el panel de control (aprobar y rechazar estudiantes):
- **Usuario:** `admin`
- **Contraseña:** `admin`

*Última actualización: Mayo 2026*
