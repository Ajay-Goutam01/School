const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80' },
  imageId: { type: String, default: '' },
  iconName: { type: String, default: 'School' },
  highlights: [{ type: String }],
  isFeatured: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);
