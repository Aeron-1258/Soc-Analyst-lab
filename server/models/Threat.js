const mongoose = require('mongoose');

const ThreatSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  from: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    country: { type: String, required: true },
    ip: { type: String, required: true }
  },
  to: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    country: { type: String, required: true },
    ip: { type: String, required: true }
  },
  severity: { type: String, required: true }
});

module.exports = mongoose.model('Threat', ThreatSchema);
