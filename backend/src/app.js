require('dotenv').config();
require('./config/firebase'); // initialise Firebase Admin SDK

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Route modules
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const progressRoutes = require('./routes/progressRoutes');
const mcqRoutes = require('./routes/mcqRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const conceptRoutes = require('./routes/conceptRoutes');

// my-courses uses the same controller as enrollment
const authMiddleware = require('./middleware/authMiddleware');
const { getMyCourses } = require('./controllers/enrollmentController');

const app = express();
const PORT = process.env.PORT || 5000;

/* ─────────────────────────────────────────
   Global Middleware
───────────────────────────────────────── */

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

/* ─────────────────────────────────────────
   Health check
───────────────────────────────────────── */

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Saraswati API', timestamp: new Date().toISOString() });
});

/* ─────────────────────────────────────────
   Routes
───────────────────────────────────────── */

app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/enroll', enrollmentRoutes);
app.get('/my-courses', authMiddleware, getMyCourses);  // GET /my-courses
app.use('/progress', progressRoutes);
app.use('/mcq', mcqRoutes);
app.use('/teacher-insights', insightsRoutes);
app.use('/payment', paymentRoutes);
app.use('/concepts', conceptRoutes);

/* ─────────────────────────────────────────
   404 catch-all
───────────────────────────────────────── */

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ─────────────────────────────────────────
   Global error handler
───────────────────────────────────────── */

app.use(errorHandler);

/* ─────────────────────────────────────────
   Start server
───────────────────────────────────────── */

app.listen(PORT, () => {
  console.log(`\n🚀  Saraswati API running on http://localhost:${PORT}`);
  console.log(`    Health check → http://localhost:${PORT}/health\n`);
});

module.exports = app;
