const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String },
  coverImage: { type: String, default: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80' },
  imageId: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  category: { 
    type: String, 
    enum: ['News', 'Event', 'Achievement', 'Announcement'],
    default: 'News' 
  },
  isPublished: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
