const express = require('express');
const { BloodRequest, User } = require('../models');
const { requireAuth } = require('../middleware/auth');
const { sendBloodRequestEmail, sendRequestStatusEmail } = require('../services/emailService');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const existing = await BloodRequest.findOne({
      requester_id: req.session.userId,
      donor_id: req.body.donor_id,
      status: { $in: ['pending', 'accepted'] }
    });
    if (existing) return res.status(400).json({ error: 'You already have an active request to this donor.' });

    const [requester, donor] = await Promise.all([
      User.findById(req.session.userId),
      User.findById(req.body.donor_id)
    ]);

    await BloodRequest.create({
      requester_id: req.session.userId,
      requester_name: requester.name,
      donor_id: req.body.donor_id,
      donor_name: req.body.donor_name,
      blood_type: req.body.blood_type,
      urgency: req.body.urgency,
      message: req.body.message
    });

    await sendBloodRequestEmail(donor.email, donor.name, requester.name, req.body.blood_type, req.body.urgency, req.body.message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/sent', requireAuth, async (req, res) => {
  try {
    res.json(await BloodRequest.find({ requester_id: req.session.userId }).sort({ created_at: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/received', requireAuth, async (req, res) => {
  try {
    res.json(await BloodRequest.find({ donor_id: req.session.userId }).sort({ created_at: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    const [requester, donor] = await Promise.all([
      User.findById(request.requester_id),
      User.findById(request.donor_id)
    ]);

    await BloodRequest.findByIdAndUpdate(req.params.id, { status: req.body.status, updated_at: new Date() });

    if (req.body.status === 'accepted') {
      await User.findByIdAndUpdate(request.donor_id, {
        last_donation_date: new Date().toISOString().split('T')[0],
        $inc: { donation_count: 1 }
      });
    }

    await sendRequestStatusEmail(requester.email, requester.name, donor.name, request.blood_type, req.body.status);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
