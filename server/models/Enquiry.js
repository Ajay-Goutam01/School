const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  studentName: { type: String },
  classInterested: { type: String },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Resolved'], 
    default: 'New' 
  },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
