const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  attachmentUrl: { type: String },
  attachmentId: { type: String, default: '' },
  isPublished: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  isImportant: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
