const express = require('express');
const { User } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/leaderboard', requireAuth, async (req, res) => {
  try {
    const leaders = await User.find({ is_active: true })
      .sort({ donation_count: -1 })
      .limit(10)
      .select('name blood_type city donation_count');
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const query = {
      willing_to_donate: true,
      is_active: true,
      _id: { $ne: req.session.userId }
    };

    if (req.query.blood_type) query.blood_type = req.query.blood_type;

    if (req.query.location) {
      const loc = new RegExp(req.query.location, 'i');
      query.$or = [{ city: loc }, { state: loc }, { pincode: loc }, { address: loc }];
    }

    let donors = await User.find(query).populate('blood_bank_id', 'name').select('-password').limit(100);

    donors = donors.filter(d =>
      !d.is_alcoholic &&
      !d.is_smoker &&
      (!d.medical_conditions || d.medical_conditions.trim() === '') &&
      (!d.last_donation_date || new Date(d.last_donation_date) <= threeMonthsAgo)
    );

    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
