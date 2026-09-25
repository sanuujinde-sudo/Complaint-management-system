const express = require('express');
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Submit feedback for a complaint
router.post('/', protect, [
  body('complaint').notEmpty(),
  body('rating').isInt({ min: 1, max: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const complaint = await Complaint.findById(req.body.complaint);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (complaint.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not allowed' });
    if (!['RESOLVED', 'CLOSED'].includes(complaint.status)) return res.status(400).json({ message: 'Feedback is available after resolution' });
    const existing = await Feedback.findOne({ complaint: req.body.complaint, user: req.user.id });
    if (existing) return res.status(409).json({ message: 'Feedback already submitted for this complaint' });

    const fb = new Feedback({
      complaint: req.body.complaint,
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment || ''
    });
    await fb.save();

    // Optionally mark complaint closed/resolved when feedback given
    complaint.status = 'CLOSED';
    await complaint.save();

    res.json(fb);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get feedbacks (admin)
router.get('/', protect, async (req, res) => {
  try {
    // Admins get all, others get their own
    const FeedbackModel = require('../models/Feedback');
    let list;
    if (req.user.role === 'ADMIN') list = await FeedbackModel.find().populate('user complaint');
    else list = await FeedbackModel.find({ user: req.user.id }).populate('user complaint');
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
