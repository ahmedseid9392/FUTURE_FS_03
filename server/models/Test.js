import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: 'Database connection successful!'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create model only if it doesn't exist
const Test = mongoose.models.Test || mongoose.model('Test', testSchema);

export default Test;