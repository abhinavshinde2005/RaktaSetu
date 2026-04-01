require('dotenv').config({ path: '../.env' });
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS must be first - before session
app.use(cors({
  origin: (origin, cb) => {
    console.log('🌐 [CORS] Request from origin:', origin);
    cb(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session config
app.use(session({
  secret: process.env.SESSION_SECRET || 'raktasetu_secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: false,
    httpOnly: true
  }
}));

// Debug every request - log session state
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} | sessionID: ${req.sessionID} | userId: ${req.session.userId || 'none'}`);
  next();
});

app.use('/api', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/camps', require('./routes/camps'));
app.use('/api/bloodbank', require('./routes/bloodbank'));

app.get('/', (req, res) => res.json({ status: 'RaktaSetu API Running', port: PORT }));

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🩸 RaktaSetu Backend: http://127.0.0.1:${PORT}`);
    console.log(`🌐 Frontend:          http://127.0.0.1:3001\n`);
  });
}).catch(err => { console.error('❌ Failed to start:', err); process.exit(1); });
