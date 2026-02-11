const express = require('express');
const bcrypt = require('bcryptjs');
const { BloodBank, User } = require('../models');

const router = express.Router();

const requireBloodBankAuth = (req, res, next) => {
  if (!req.session.bloodBankId) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

router.post('/register', async (req, res) => {
  try {
    console.log('🏥 Blood bank registration:', req.body.email);
    const existing = await BloodBank.findOne({ $or: [{ email: req.body.email }, { license_number: req.body.license_number }] });
    if (existing) return res.status(400).json({ error: 'Blood bank already registered' });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const bloodBank = await BloodBank.create({ ...req.body, password: hashedPassword });
    
    console.log('✅ Blood bank registered:', bloodBank._id);
    res.json({ success: true, bloodBankId: bloodBank._id });
  } catch (err) {
    console.error('❌ Blood bank registration error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const bloodBank = await BloodBank.findOne({ email: req.body.email });
    if (!bloodBank || !await bcrypt.compare(req.body.password, bloodBank.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.bloodBankId = bloodBank._id.toString();
    req.session.bloodBankName = bloodBank.name;
    
    res.json({ success: true, bloodBank: { name: bloodBank.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/check-auth', (req, res) => {
  res.json({ authenticated: !!req.session.bloodBankId, bloodBank: req.session.bloodBankName });
});

router.post('/donors', requireBloodBankAuth, async (req, res) => {
  try {
    const donors = req.body.donors;
    const hashedPassword = await bcrypt.hash('bloodbank123', 10);
    
    const createdDonors = await User.insertMany(
      donors.map(d => ({ ...d, password: hashedPassword, blood_bank_id: req.session.bloodBankId }))
    );
    
    res.json({ success: true, count: createdDonors.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/donors', requireBloodBankAuth, async (req, res) => {
  try {
    const donors = await User.find({ blood_bank_id: req.session.bloodBankId });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/donors/:id', requireBloodBankAuth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/donors/:id', requireBloodBankAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
