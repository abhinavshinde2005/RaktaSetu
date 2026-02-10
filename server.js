require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

let db;
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    db = client.db(process.env.DB_NAME);
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Register
app.post('/api/register', async (req, res) => {
  try {
    const existing = await db.collection('users').findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      ...req.body,
      password: hashedPassword,
      created_at: new Date(),
      is_active: true
    };
    delete userData.password_confirm;

    const result = await db.collection('users').insertOne(userData);
    res.json({ success: true, userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ email: req.body.email });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user._id.toString();
    req.session.userName = user.name;
    req.session.bloodType = user.blood_type;
    res.json({ success: true, user: { name: user.name, bloodType: user.blood_type } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Get current user
app.get('/api/user', requireAuth, async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) });
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
app.put('/api/user', requireAuth, async (req, res) => {
  try {
    const { _id, email, password, blood_type, date_of_birth, gender, ...updateData } = req.body;
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.session.userId) },
      { $set: { ...updateData, updated_at: new Date() } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search donors
app.get('/api/donors', requireAuth, async (req, res) => {
  try {
    const query = {
      willing_to_donate: true,
      is_active: true,
      _id: { $ne: new ObjectId(req.session.userId) }
    };
    if (req.query.blood_type) query.blood_type = req.query.blood_type;
    if (req.query.city) query.city = new RegExp(req.query.city, 'i');

    const donors = await db.collection('users').find(query).limit(20).toArray();
    donors.forEach(d => delete d.password);
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Blood requests
app.post('/api/requests', requireAuth, async (req, res) => {
  try {
    const requester = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) });
    const requestData = {
      requester_id: new ObjectId(req.session.userId),
      requester_name: requester.name,
      donor_id: new ObjectId(req.body.donor_id),
      donor_name: req.body.donor_name,
      blood_type: req.body.blood_type,
      urgency: req.body.urgency,
      message: req.body.message,
      status: 'pending',
      created_at: new Date()
    };
    await db.collection('blood_requests').insertOne(requestData);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/requests/sent', requireAuth, async (req, res) => {
  try {
    const requests = await db.collection('blood_requests')
      .find({ requester_id: new ObjectId(req.session.userId) })
      .sort({ created_at: -1 })
      .toArray();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/requests/received', requireAuth, async (req, res) => {
  try {
    const requests = await db.collection('blood_requests')
      .find({ donor_id: new ObjectId(req.session.userId) })
      .sort({ created_at: -1 })
      .toArray();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/requests/:id', requireAuth, async (req, res) => {
  try {
    await db.collection('blood_requests').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: req.body.status, updated_at: new Date() } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Blood camps
app.post('/api/camps', requireAuth, async (req, res) => {
  try {
    const campData = {
      ...req.body,
      date: new Date(req.body.date),
      created_by: new ObjectId(req.session.userId),
      created_at: new Date(),
      is_active: true
    };
    await db.collection('blood_camps').insertOne(campData);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/camps', requireAuth, async (req, res) => {
  try {
    const camps = await db.collection('blood_camps')
      .find({ is_active: true })
      .sort({ date: 1 })
      .toArray();
    res.json(camps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/camps/:id/register', requireAuth, async (req, res) => {
  try {
    const existing = await db.collection('camp_registrations').findOne({
      camp_id: new ObjectId(req.params.id),
      user_id: new ObjectId(req.session.userId)
    });
    if (existing) return res.status(400).json({ error: 'Already registered' });

    await db.collection('camp_registrations').insertOne({
      camp_id: new ObjectId(req.params.id),
      user_id: new ObjectId(req.session.userId),
      registered_at: new Date(),
      status: 'confirmed'
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/camps/registered', requireAuth, async (req, res) => {
  try {
    const registrations = await db.collection('camp_registrations')
      .find({ user_id: new ObjectId(req.session.userId) })
      .toArray();
    res.json(registrations.map(r => r.camp_id.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/check-auth', (req, res) => {
  res.json({ authenticated: !!req.session.userId, user: req.session.userName });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
