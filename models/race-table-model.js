const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
  event: { type: String, required: true },
  horseId: { type: Number, required: true },
  horseName: { type: String, required: true },
  startTime: { type: Number, default: 0 },
  finishTime: { type: Number, default: null },
});

module.exports = mongoose.model('Race', raceSchema, 'Race');