require('dotenv').config({ path: '../.env' });
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { connectDB } = require('./config/database');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const donorRoutes = require('./routes/donors');
const requestRoutes = require('./routes/requests');
const campRoutes = require('./routes/camps');
const bloodBankRoutes = require('./routes/bloodbank');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`🔵 ${req.method} ${req.path}`);
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/camps', campRoutes);
app.use('/api/bloodbank', bloodBankRoutes);

// Backend landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>RaktaSetu API</title>
      <style>
        body { font-family: Arial; background: linear-gradient(135deg, #dc2626, #991b1b); color: white; text-align: center; padding: 50px; }
        h1 { font-size: 4em; margin: 0; }
        p { font-size: 1.5em; margin: 20px 0; }
        .status { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; display: inline-block; margin: 20px; }
        a { color: white; text-decoration: none; background: rgba(255,255,255,0.3); padding: 15px 30px; border-radius: 5px; display: inline-block; margin: 10px; }
        a:hover { background: rgba(255,255,255,0.4); }
      </style>
    </head>
    <body>
      <h1>🩸 RaktaSetu API</h1>
      <p>Backend Server Running Successfully</p>
      <div class="status">
        <h2>✅ Status: Online</h2>
        <p>Port: ${PORT}</p>
        <p>Database: Connected</p>
      </div>
      <br>
      <a href="http://localhost:3001" target="_blank">Open Frontend</a>
      <a href="http://localhost:3001/login.html" target="_blank">Login</a>
      <a href="http://localhost:3001/register.html" target="_blank">Register</a>
    </body>
    </html>
  `);
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('\n🩸 ========================================');
      console.log('🩸 RaktaSetu Backend Server Started');
      console.log('🩸 ========================================');
      console.log('🚀 Server: http://localhost:' + PORT);
      console.log('🏛️  Database: Connected');
      console.log('🌐 CORS: Enabled for http://localhost:3001');
      console.log('🩸 ========================================\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
