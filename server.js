const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const sharp = require('sharp');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ─── Environment Config ─────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const MONGODB_URI = process.env.MONGODB_URI;
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

// ─── MongoDB Connection & Models ────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

const enrollmentSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  level: String,
  courses: [String],
  status: { type: String, default: 'Pendiente' },
  date: String,
  studentUser: String,
  studentPass: String,
  profilePic: String,
  examResults: [{
    courseId: String,
    score: Number,
    passed: Boolean,
    date: String
  }]
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

const passwordResetTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  studentUser: { type: String, required: true },
  newPassword: { type: String, required: true },
  createdAt: { type: Date, expires: '15m', default: Date.now }
});

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

// ─── Email Transporter ──────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: RESEND_API_KEY
  }
});

async function sendAcceptanceEmail(student) {
  const mailOptions = {
    from: `"Academia IA" <${EMAIL_FROM}>`,
    to: student.email,
    subject: '🎉 ¡Has sido aceptado al Curso de Inteligencia Artificial!',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #030712; color: #e2e8f0; border-radius: 16px; overflow: hidden; border: 1px solid #6366f133;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 2rem; text-align: center;">
          <h1 style="margin: 0; font-size: 1.8rem; color: #fff;">¡Felicidades, ${student.name.split(' ')[0]}! 🚀</h1>
          <p style="margin: 0.5rem 0 0; color: rgba(255,255,255,0.85); font-size: 1rem;">Tu solicitud ha sido aprobada</p>
        </div>
        <div style="padding: 2rem;">
          <p style="color: #94a3b8; line-height: 1.6; margin-top: 0;">
            Nos complace informarte que tu inscripción a la <strong style="color: #a78bfa;">Academia de IA</strong> ha sido <strong style="color: #10b981;">ACEPTADA</strong>.
          </p>
          <div style="background: #0f172a; border: 1px solid #6366f144; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
            <h3 style="margin: 0 0 1rem; color: #22d3ee; font-size: 0.9rem; letter-spacing: 0.05em;">🔐 TUS CREDENCIALES DE ACCESO</h3>
            <p style="margin: 0.3rem 0; color: #e2e8f0;">👤 <strong>Usuario:</strong> <code style="background: #1e293b; padding: 0.2rem 0.5rem; border-radius: 4px; color: #22d3ee;">${student.studentUser}</code></p>
            <p style="margin: 0.3rem 0; color: #e2e8f0;">🔑 <strong>Contraseña:</strong> <code style="background: #1e293b; padding: 0.2rem 0.5rem; border-radius: 4px; color: #22d3ee;">${student.studentPass}</code></p>
          </div>
          <p style="color: #94a3b8; font-size: 0.85rem; line-height: 1.6;">
            Usa estas credenciales para ingresar al <strong style="color: #e2e8f0;">Portal de Estudiantes</strong> 
            y acceder al material del curso.
          </p>
          <p style="color: #64748b; font-size: 0.75rem; margin-top: 2rem; border-top: 1px solid #1e293b; padding-top: 1rem;">
            © 2026 · Academia de Inteligencia Artificial<br>
            Este correo fue enviado automáticamente. No responder.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Correo de aceptación enviado a: ${student.email}`);
  } catch (error) {
    console.error('❌ Error enviando correo:', error.message);
  }
}

// ─── Express App Setup ──────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// Restrict CORS to known origin only
app.use(cors({
  origin: process.env.PUBLIC_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Admin Auth Middleware (JWT) ───────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET no definido en .env — el servidor no puede arrancar de forma segura.');
  process.exit(1);
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'admin') throw new Error('Rol incorrecto');
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado. Inicia sesión de nuevo.' });
  }
}

const COURSES = [
  { id: 'regresion-lineal', name: 'Regresión Lineal', hours: 40, icon: '📈' },
  { id: 'algoritmo-genetico', name: 'Algoritmo Genético', hours: 35, icon: '🧬' }
];

// POST exam result
app.post('/api/exam-result', async (req, res) => {
  try {
    const { studentUser, courseId, score, passed } = req.body;
    const enrollment = await Enrollment.findOne({ studentUser });
    if (!enrollment) return res.status(404).json({ error: 'Student not found' });
    
    const results = (enrollment.examResults || []).filter(r => r.courseId !== courseId);
    results.push({ courseId, score, passed, date: new Date().toLocaleDateString() });
    
    await Enrollment.updateMany({ studentUser }, { $set: { examResults: results } });
    res.json({ success: true, score, passed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving exam result' });
  }
});

// GET exam result
app.get('/api/exam-result/:user/:courseId', async (req, res) => {
  try {
    const { user, courseId } = req.params;
    const enrollment = await Enrollment.findOne({ studentUser: user });
    if (!enrollment) return res.status(404).json({ error: 'Not found' });
    const result = (enrollment.examResults || []).find(r => r.courseId === courseId);
    res.json(result || null);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching result' });
  }
});

app.get('/api/courses', (req, res) => {
  res.json(COURSES);
});

// GET confirm password change
app.get('/api/confirm-password', async (req, res) => {
  try {
    const { token } = req.query;
    const tokenDoc = await PasswordResetToken.findOne({ token });
    
    if (!tokenDoc) {
      return res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h2>El enlace ha expirado o no es válido.</h2>
          <a href="/">Volver al inicio</a>
        </div>
      `);
    }
    
    const result = await Enrollment.updateMany(
      { studentUser: tokenDoc.studentUser },
      { $set: { studentPass: tokenDoc.newPassword } }
    );
    
    if (result.modifiedCount > 0 || result.matchedCount > 0) {
      await PasswordResetToken.deleteOne({ token });
      res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h2>¡Contraseña actualizada correctamente!</h2>
          <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <a href="/login.html?type=student">Ir al inicio de sesión</a>
        </div>
      `);
    } else {
      res.status(500).send('Error interno actualizando contraseñas');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error procesando confirmación');
  }
});

// GET all enrollments — ADMIN ONLY
app.get('/api/enrollments', requireAdmin, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({});
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: 'Error reading database' });
  }
});

// POST new enrollment
app.post('/api/enrollments', async (req, res) => {
  try {
    const { name, email, level, course } = req.body;
    const coursesArray = Array.isArray(course) ? course : [course || 'regresion-lineal'];

    // Find if this email already has ANY enrollment
    const existingByEmail = await Enrollment.findOne({ email });

    // If the student already has a record, just add new courses to it (avoiding duplicates)
    if (existingByEmail) {
      const existingCourses = existingByEmail.courses || [];
      const newCourses = coursesArray.filter(c => !existingCourses.includes(c));

      if (newCourses.length === 0) {
        return res.status(409).json({ error: 'Ya estás inscrito en todos esos cursos.' });
      }

      existingByEmail.courses = [...existingCourses, ...newCourses];
      // Update name/level in case they changed
      existingByEmail.name = name;
      existingByEmail.level = level;
      await existingByEmail.save();
      return res.status(200).json([existingByEmail]);
    }

    // New student: create a fresh enrollment record
    const newEnrollment = new Enrollment({
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      name,
      email,
      level,
      courses: coursesArray,
      status: 'Pendiente',
      date: new Date().toLocaleDateString()
    });

    await newEnrollment.save();
    res.status(201).json([newEnrollment]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving enrollment' });
  }
});

// PUT update status — ADMIN ONLY
app.put('/api/enrollments/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const enrollment = await Enrollment.findOne({ id });
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    const wasAlreadyAccepted = enrollment.status === 'Aceptado';
    enrollment.status = status;

    let credentialsAreNew = false;
    // Only generate credentials if accepted AND they don't exist yet
    if (status === 'Aceptado' && !enrollment.studentUser) {
      const firstName = enrollment.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      const randomNum = Math.floor(100 + Math.random() * 900);
      enrollment.studentUser = `${firstName}${randomNum}`;
      enrollment.studentPass = Math.random().toString(36).slice(-8);
      credentialsAreNew = true;
    }

    await enrollment.save();

    // Only send email if credentials were JUST generated (first-time acceptance)
    if (status === 'Aceptado' && credentialsAreNew) {
      sendAcceptanceEmail(enrollment);
    }

    res.json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating enrollment' });
  }
});

// POST admin login — returns signed JWT (8h expiry)
app.post('/api/admin/login', (req, res) => {
  const { user, pass } = req.body;
  if (!user || !pass) return res.status(400).json({ error: 'Credenciales requeridas' });
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    const token = jwt.sign(
      { role: 'admin', user },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

// POST student login — returns student data WITHOUT password
app.post('/api/login', async (req, res) => {
  try {
    const { user, pass } = req.body;
    if (!user || !pass) return res.status(400).json({ error: 'Faltan credenciales' });
    const student = await Enrollment.findOne({ studentUser: user, studentPass: pass, status: 'Aceptado' });
    if (student) {
      // Never return the password to the client
      const { studentPass, ...safeStudent } = student.toObject();
      res.json(safeStudent);
    } else {
      res.status(401).json({ error: 'Credenciales inválidas o acceso no autorizado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error processing login' });
  }
});

// GET courses for a specific student
app.get('/api/students/:user/courses', async (req, res) => {
  try {
    const { user } = req.params;
    const myEnrollments = await Enrollment.find({ studentUser: user });
    
    const detailedCourses = [];
    myEnrollments.forEach(e => {
      const courseList = e.courses && e.courses.length > 0 ? e.courses : [];
      courseList.forEach(cId => {
        const courseDetails = COURSES.find(c => c.id === cId) || COURSES[0];
        detailedCourses.push({
          enrollmentId: e.id,
          courseId: courseDetails.id,
          courseName: courseDetails.name,
          courseIcon: courseDetails.icon,
          status: e.status
        });
      });
    });
    
    res.json(detailedCourses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
});

// PUT update student profile
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profilePic, currentPassword, newPassword } = req.body;
    
    const enrollment = await Enrollment.findOne({ id });
    
    if (enrollment) {
      const studentUser = enrollment.studentUser;
      
      let processedPic = profilePic;
      if (profilePic && profilePic.startsWith('data:image/')) {
        const base64Data = profilePic.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        if (buffer.length > 2 * 1024 * 1024) {
          return res.status(400).json({ error: 'La imagen supera los 2 MB' });
        }
        
        try {
          const sharpBuffer = await sharp(buffer)
            .resize(400, 400, { fit: 'cover' })
            .webp({ quality: 60 })
            .toBuffer();
          processedPic = `data:image/webp;base64,${sharpBuffer.toString('base64')}`;
        } catch (err) {
          return res.status(400).json({ error: 'Formato de imagen no soportado' });
        }
      }
      
      let passwordChangeSent = false;
      if (newPassword && currentPassword) {
        if (enrollment.studentPass !== currentPassword) {
          return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }
        
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await PasswordResetToken.create({ token, studentUser, newPassword });
        
        const mailOptions = {
          from: `"Academia IA · Seguridad" <${EMAIL_FROM}>`,
          to: enrollment.email,
          subject: '🔒 Confirmación de Cambio de Contraseña',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
              <h2>Solicitud de Cambio de Contraseña</h2>
              <p>Hola ${enrollment.name.split(' ')[0]},</p>
              <p>Se ha solicitado un cambio de contraseña para tu cuenta de estudiante. Si fuiste tú, haz clic en el siguiente botón para confirmar el cambio:</p>
              <a href="${PUBLIC_URL}/api/confirm-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0;">Confirmar Cambio de Contraseña</a>
              <p>Si no fuiste tú, puedes ignorar este correo y tu contraseña actual seguirá siendo válida.</p>
            </div>
          `
        };
        
        await transporter.sendMail(mailOptions);
        passwordChangeSent = true;
      }
      
      // Update ALL enrollments for this user
      const updateData = {};
      if (name) updateData.name = name;
      if (processedPic !== undefined) updateData.profilePic = processedPic;
      
      await Enrollment.updateMany({ studentUser }, { $set: updateData });
      
      const updatedEnrollment = await Enrollment.findOne({ id });
      res.json({ ...updatedEnrollment.toObject(), passwordChangeSent });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// DELETE all enrollments — ADMIN ONLY
app.delete('/api/enrollments', requireAdmin, async (req, res) => {
  try {
    await Enrollment.deleteMany({});
    res.json({ message: 'All enrollments deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting enrollments' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
