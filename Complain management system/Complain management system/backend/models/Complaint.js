const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  attachments: [{ type: String }],
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ComplaintSchema.index({ status: 1, createdAt: -1 });
ComplaintSchema.index({ createdBy: 1, createdAt: -1 });
ComplaintSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('Complaint', ComplaintSchema);
