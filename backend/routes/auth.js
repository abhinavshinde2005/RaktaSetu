const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('📝 [register] Attempt:', req.body.email);

    if (await User.findOne({ email: req.body.email }))
      return res.status(400).json({ error: 'Email already registered' });

    if (req.body.is_alcoholic || req.body.is_smoker || !req.body.willing_to_donate ||
        (req.body.medical_conditions && req.body.medical_conditions.trim() !== ''))
      return res.status(400).json({ error: 'You are not eligible to donate blood. Donors must not consume alcohol, smoke, or have medical conditions.' });

    const user = await User.create({ ...req.body, password: await bcrypt.hash(req.body.password, 10) });
    console.log('✅ [register] Success:', user.email);
    res.json({ success: true, userId: user._id });
  } catch (err) {
    console.error('❌ [register] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('🔐 [login] Attempt:', req.body.email);

    const user = await User.findOne({ email: req.body.email });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      console.warn('⚠️ [login] Invalid credentials for:', req.body.email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user._id.toString();
    req.session.userName = user.name;
    req.session.bloodType = user.blood_type;

    // Explicitly save session before responding
    req.session.save((err) => {
      if (err) {
        console.error('❌ [login] Session save error:', err);
        return res.status(500).json({ error: 'Session error' });
      }
      console.log('✅ [login] Session saved. userId:', req.session.userId, 'sessionID:', req.sessionID);
      res.json({ success: true, user: { name: user.name, bloodType: user.blood_type } });
    });
  } catch (err) {
    console.error('❌ [login] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  console.log('🚪 [logout] userId:', req.session.userId);
  req.session.destroy();
  res.json({ success: true });
});

router.get('/check-auth', (req, res) => {
  console.log('🔍 [check-auth] sessionID:', req.sessionID, '| userId:', req.session.userId || 'none');
  res.json({ authenticated: !!req.session.userId, user: req.session.userName });
});

module.exports = router;
