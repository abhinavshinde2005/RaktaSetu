const express = require('express');
const { User } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    console.log('👤 Fetching user:', req.session.userId);
    const user = await User.findById(req.session.userId).select('-password');
    console.log('✅ User found:', user.email);
    res.json(user);
  } catch (err) {
    console.error('❌ User fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    console.log('📝 Updating user:', req.session.userId);
    const { _id, email, password, blood_type, date_of_birth, gender, ...updateData } = req.body;
    await User.findByIdAndUpdate(req.session.userId, {
      ...updateData,
      updated_at: new Date()
    });
    console.log('✅ User updated successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ User update error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
