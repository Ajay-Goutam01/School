const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  subject: { type: String },
  qualification: { type: String, required: true },
  experience: { type: String, required: true },
  photo: { type: String, default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80' },
  photoId: { type: String, default: '' },
  message: { type: String },
  isLeadership: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  department: { type: String, default: 'General' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
