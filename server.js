require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { connectDB } = require('./backend/config/database');

// Import routes
const authRoutes = require('./backend/routes/auth');
const userRoutes = require('./backend/routes/user');
const donorRoutes = require('./backend/routes/donors');
const requestRoutes = require('./backend/routes/requests');
const campRoutes = require('./backend/routes/camps');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// API Routes
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/camps', campRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('🚀 Server running on http://localhost:' + PORT);
      console.log('📊 Open: http://localhost:' + PORT + '/login.html\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
