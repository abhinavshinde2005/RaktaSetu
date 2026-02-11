const express = require('express');
const { User, BloodBank } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const query = {
      willing_to_donate: true,
      is_active: true,
      _id: { $ne: req.session.userId }
    };
    
    // Only exclude if explicitly true (not if undefined/null)
    if (req.query.blood_type) query.blood_type = req.query.blood_type;
    
    // Search by location
    if (req.query.location) {
      const locationRegex = new RegExp(req.query.location, 'i');
      query.$or = [
        { city: locationRegex },
        { state: locationRegex },
        { pincode: locationRegex },
        { address: locationRegex }
      ];
    }

    console.log('🔍 Searching donors with query:', JSON.stringify(query, null, 2));
    
    // First, get all potential donors
    let donors = await User.find(query).populate('blood_bank_id', 'name').select('-password').limit(50);
    console.log(`📊 Initial results: ${donors.length} donors`);
    
    // Filter in JavaScript for complex conditions
    donors = donors.filter(donor => {
      // Check alcohol and smoking
      if (donor.is_alcoholic || donor.is_smoker) {
        console.log(`❌ Excluded ${donor.name}: alcohol/smoking`);
        return false;
      }
      
      // Check medical conditions
      if (donor.medical_conditions && donor.medical_conditions.trim() !== '') {
        console.log(`❌ Excluded ${donor.name}: medical conditions`);
        return false;
      }
      
      // Check last donation date
      if (donor.last_donation_date) {
        const lastDonation = new Date(donor.last_donation_date);
        if (lastDonation > threeMonthsAgo) {
          console.log(`❌ Excluded ${donor.name}: donated recently`);
          return false;
        }
      }
      
      return true;
    });
    
    console.log(`✅ Found ${donors.length} eligible donors`);
    res.json(donors);
  } catch (err) {
    console.error('❌ Donor search error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

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

module.exports = router;
