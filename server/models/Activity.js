const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Sports', 'Cultural', 'Academic', 'Events'], 
    required: true 
  },
  description: { type: String, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800&auto=format&fit=crop&q=80' },
  imageId: { type: String, default: '' },
  highlights: [{ type: String }],
  isFeatured: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
