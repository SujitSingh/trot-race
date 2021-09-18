const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
  event: String,
  horseId: Number,
  horseName: String,
  startTime: Number,
  finishTime: Number,
});

module.exports = mongoose.model('Race', raceSchema, 'Race');