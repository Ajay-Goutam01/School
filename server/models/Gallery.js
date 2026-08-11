const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  fileId: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Campus', 'Classrooms', 'Sports', 'Cultural', 'Events', 'Trips', 'Achievements', 'Laboratories', 'Library', 'Activities', 'Other'],
    default: 'Campus'
  },
  altText: { type: String, default: '' },
  description: { type: String },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
