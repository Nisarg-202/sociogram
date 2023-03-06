const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./userSchema');

const followSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

followSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Follow', followSchema);
