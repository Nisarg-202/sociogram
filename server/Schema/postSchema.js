const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('./userSchema');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  like: [{type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User'}],
  dislike: [
    {type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User'},
  ],
  createdAt: {
    type: Date,
    required: true,
  },
});

postSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Post', postSchema);
