import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    enum: ['Technical', 'Billing', 'General'],
    required: [true, 'Please provide a category'],
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // We can still keep comments as a reference or use virtuals
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for comments
TicketSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'ticket',
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
