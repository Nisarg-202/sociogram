const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const commentSchema = new mongoose.Schema({
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
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post',
  },
  comment: {
    type: String,
    required: true,
  },
});

commentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Comment', commentSchema);
