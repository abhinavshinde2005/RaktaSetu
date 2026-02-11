const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body.email);
    
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      console.log('❌ Email already exists:', req.body.email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check eligibility
    const isEligible = !req.body.is_alcoholic && !req.body.is_smoker && 
                       req.body.willing_to_donate && 
                       (!req.body.medical_conditions || req.body.medical_conditions.trim() === '');
    
    if (!isEligible) {
      console.log('⚠️ User not eligible to donate');
      return res.status(400).json({ 
        error: 'You are not eligible to donate blood. Donors must not consume alcohol, smoke, or have medical conditions.' 
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });

    console.log('✅ User registered successfully:', user.email);
    res.json({ success: true, userId: user._id });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const user = await User.findOne({ email: req.body.email });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      console.log('❌ Invalid credentials for:', req.body.email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user._id.toString();
    req.session.userName = user.name;
    req.session.bloodType = user.blood_type;
    
    console.log('✅ Login successful:', user.email);
    res.json({ success: true, user: { name: user.name, bloodType: user.blood_type } });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/check-auth', (req, res) => {
  res.json({ authenticated: !!req.session.userId, user: req.session.userName });
});

module.exports = router;
