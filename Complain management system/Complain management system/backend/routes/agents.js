const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get list of agents
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const agents = await User.find({ role: 'AGENT' }).select('name email');
    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
