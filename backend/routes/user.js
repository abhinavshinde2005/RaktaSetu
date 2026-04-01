const express = require('express');
const { User } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const { _id, email, password, blood_type, date_of_birth, gender, ...updateData } = req.body;
    await User.findByIdAndUpdate(req.session.userId, { ...updateData, updated_at: new Date() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
