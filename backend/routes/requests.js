const express = require('express');
const { BloodRequest, User } = require('../models');
const { requireAuth } = require('../middleware/auth');
const { sendBloodRequestEmail, sendRequestStatusEmail } = require('../services/emailService');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const requester = await User.findById(req.session.userId);
    const donor = await User.findById(req.body.donor_id);
    
    await BloodRequest.create({
      requester_id: req.session.userId,
      requester_name: requester.name,
      donor_id: req.body.donor_id,
      donor_name: req.body.donor_name,
      blood_type: req.body.blood_type,
      urgency: req.body.urgency,
      message: req.body.message
    });
    
    // Send email notification to donor
    await sendBloodRequestEmail(
      donor.email,
      donor.name,
      requester.name,
      req.body.blood_type,
      req.body.urgency,
      req.body.message
    );
    
    console.log('✅ Blood request created and email sent');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Request creation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/sent', requireAuth, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ requester_id: req.session.userId })
      .sort({ created_at: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/received', requireAuth, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ donor_id: req.session.userId })
      .sort({ created_at: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    const requester = await User.findById(request.requester_id);
    const donor = await User.findById(request.donor_id);
    
    await BloodRequest.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
      updated_at: new Date()
    });
    
    // Send email notification to requester
    await sendRequestStatusEmail(
      requester.email,
      requester.name,
      donor.name,
      request.blood_type,
      req.body.status
    );
    
    console.log(`✅ Request ${req.body.status} and email sent`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Request update error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
