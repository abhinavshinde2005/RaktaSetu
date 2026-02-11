const express = require('express');
const { BloodCamp, CampRegistration, User } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    console.log('🏕️ Creating camp:', req.body);
    const camp = await BloodCamp.create({
      ...req.body,
      created_by: req.session.userId
    });
    console.log('✅ Camp created:', camp._id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Camp creation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const camps = await BloodCamp.find({ is_active: true }).sort({ date: 1 });
    res.json(camps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/register', requireAuth, async (req, res) => {
  try {
    console.log('📝 Registering for camp:', req.params.id);
    
    // Check if user donated in last 3 months
    const user = await User.findById(req.session.userId);
    if (user.last_donation_date) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const lastDonation = new Date(user.last_donation_date);
      
      if (lastDonation > threeMonthsAgo) {
        console.log('⚠️ User donated recently');
        return res.status(400).json({ 
          error: 'You donated blood recently. Please wait 3 months between donations.' 
        });
      }
    }
    
    const existing = await CampRegistration.findOne({
      camp_id: req.params.id,
      user_id: req.session.userId
    });
    if (existing) {
      console.log('⚠️ Already registered');
      return res.status(400).json({ error: 'Already registered' });
    }

    await CampRegistration.create({
      camp_id: req.params.id,
      user_id: req.session.userId
    });
    console.log('✅ Registration successful');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/registered', requireAuth, async (req, res) => {
  try {
    const registrations = await CampRegistration.find({ user_id: req.session.userId });
    res.json(registrations.map(r => r.camp_id.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get camp details with attendees
router.get('/:id/details', requireAuth, async (req, res) => {
  try {
    console.log('🔍 Fetching camp details:', req.params.id);
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) {
      console.log('❌ Camp not found');
      return res.status(404).json({ error: 'Camp not found' });
    }
    
    const registrations = await CampRegistration.find({ camp_id: req.params.id });
    const attendeeIds = registrations.map(r => r.user_id);
    const attendees = await User.find({ _id: { $in: attendeeIds } })
      .select('name email phone blood_type city state');
    
    console.log(`✅ Camp details loaded: ${attendees.length} attendees`);
    res.json({
      camp,
      attendees,
      totalAttendees: attendees.length,
      isCreator: camp.created_by.toString() === req.session.userId
    });
  } catch (err) {
    console.error('❌ Camp details error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
