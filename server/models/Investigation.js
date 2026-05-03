const mongoose = require('mongoose');

const InvestigationSchema = new mongoose.Schema({
  alertId: { type: String, required: true },
  user: { type: String, required: true },
  steps: {
    ipValidated: { type: Boolean, default: false },
    deviceChecked: { type: Boolean, default: false },
    impossibleTravelChecked: { type: Boolean, default: false },
    activityReviewed: { type: Boolean, default: false },
    mfaVerified: { type: Boolean, default: false }
  },
  findings: { type: String, default: "" },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Escalated'], default: 'Open' },
  remediation: {
    passwordResetForced: { type: Boolean, default: false },
    sessionRevoked: { type: Boolean, default: false },
    escalated: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investigation', InvestigationSchema);
