const mongoose = require('mongoose');

const TrafficSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  incoming: { type: Number, required: true },
  outgoing: { type: Number, required: true }
});

module.exports = mongoose.model('Traffic', TrafficSchema);
