const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  detailedDescription: { type: String },
  category: { type: String, default: 'Academic Program' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80' },
  imageId: { type: String, default: '' },
  features: [{ type: String }],
  ageApplicability: { type: String, default: 'Classes 1 - 12' },
  isActive: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
