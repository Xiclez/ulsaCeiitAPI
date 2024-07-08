const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  element: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
},{collection:'logs'});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
