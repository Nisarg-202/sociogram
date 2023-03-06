const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

messageSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Message', messageSchema);
