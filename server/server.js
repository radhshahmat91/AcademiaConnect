require('dotenv').config();
const dns = require('dns');

// Use reliable public DNS resolvers before MongoDB/Atlas DNS lookups.
dns.setServers(['1.1.1.1', '8.8.8.8']);
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { initSocket } = require('./socket/socketHandler');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const clubRoutes = require('./routes/clubRoutes');
const eventRoutes = require('./routes/eventRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const ALLOWED_ORIGINS = CLIENT_URL
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests and local tools with no Origin header.
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, '');
      if (ALLOWED_ORIGINS.includes(normalized)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Uploaded avatars, thumbnails, logos, and note PDFs are served statically from here.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) =>
  res.json({
    status: 'ok',
    message: 'AcademiaConnect API is running',
    apiBase: '/api',
  }),
);

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({
    status: ready ? 'ok' : 'starting',
    message: ready ? 'AcademiaConnect API is ready' : 'Database connection is not ready yet',
  });
});

app.use('/api/auth', authRoutes);

// Backwards-compatible aliases for older frontend deployments that omitted /api.
// New deployments should always use /api/auth.
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const httpServer = http.createServer(app);
initSocket(httpServer, ALLOWED_ORIGINS);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Do not accept API traffic until MongoDB is connected. On a cold start,
    // accepting the first request too early makes Mongoose buffer it while the
    // browser can time out; the next attempt then appears to work.
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`AcademiaConnect API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(`Unable to start AcademiaConnect API: ${err.message}`);
    process.exit(1);
  }
};

startServer();
