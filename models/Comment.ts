import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
