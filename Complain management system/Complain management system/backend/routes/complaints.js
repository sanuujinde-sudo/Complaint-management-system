const express = require('express');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Create complaint
router.post('/', protect, [
  body('title').notEmpty(),
  body('description').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const complaint = new Complaint({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      attachments: req.body.attachments || [],
      createdBy: req.user.id
    });
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get complaints for user or all for admin/agent
router.get('/', protect, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'ADMIN') complaints = await Complaint.find().populate('createdBy assignedTo', 'name email');
    else if (req.user.role === 'AGENT') complaints = await Complaint.find({ assignedTo: req.user.id }).populate('createdBy assignedTo', 'name email');
    else complaints = await Complaint.find({ createdBy: req.user.id }).populate('createdBy assignedTo', 'name email');
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin summary for dashboard metrics
router.get('/stats/summary', protect, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  try {
    const [total, open, inProgress, resolved, closed] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'OPEN' }),
      Complaint.countDocuments({ status: 'IN_PROGRESS' }),
      Complaint.countDocuments({ status: 'RESOLVED' }),
      Complaint.countDocuments({ status: 'CLOSED' })
    ]);
    res.json({ total, open, inProgress, resolved, closed });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get one complaint visible to the current user
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('createdBy assignedTo', 'name email');
    if (!complaint) return res.status(404).json({ message: 'Not found' });

    const isOwner = complaint.createdBy._id.toString() === req.user.id;
    const isAssignedAgent = complaint.assignedTo && complaint.assignedTo._id.toString() === req.user.id;
    if (req.user.role === 'USER' && !isOwner) return res.status(403).json({ message: 'Forbidden' });
    if (req.user.role === 'AGENT' && !isAssignedAgent) return res.status(403).json({ message: 'Forbidden' });
    res.json(complaint);
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Not found' });
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update status or assign (admin/agent)
router.put('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Not found' });
    const hasAssignment = Boolean(req.body.assignedTo);
    const hasStatus = Boolean(req.body.status);
    if (!hasAssignment && !hasStatus) return res.status(400).json({ message: 'Provide an assignment or status update' });
    if (req.user.role === 'USER') return res.status(403).json({ message: 'Only administrators or assigned agents can update complaints' });
    if (hasAssignment && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Only administrators can assign complaints' });
    if (req.body.assignedTo && req.user.role === 'ADMIN') {
      const User = require('../models/User');
      const agent = await User.findById(req.body.assignedTo);
      if (!agent || agent.role !== 'AGENT') return res.status(400).json({ message: 'Assigned user is not an agent' });
      complaint.assignedTo = req.body.assignedTo;
    }
    if (req.body.status && (req.user.role === 'ADMIN' || req.user.role === 'AGENT')) {
      const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
      if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
      if (req.user.role === 'AGENT' && (!complaint.assignedTo || complaint.assignedTo.toString() !== req.user.id)) {
        return res.status(403).json({ message: 'Only the assigned agent can update this complaint' });
      }
      complaint.status = req.body.status;
    }
    complaint.updatedAt = Date.now();
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
