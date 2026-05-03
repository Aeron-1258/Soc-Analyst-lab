const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true },
  severity: { type: String, required: true },
  sourceIP: { type: String, required: true },
  targetIP: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, default: "Active" },
  metadata: { type: Object, default: {} }
});

module.exports = mongoose.model('Alert', AlertSchema);
