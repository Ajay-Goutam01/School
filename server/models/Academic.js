const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['Pre-Primary', 'Primary', 'Middle', 'Secondary', 'Senior Secondary'], 
    required: true 
  },
  grades: { type: String, required: true },
  description: { type: String, required: true },
  subjects: [{ type: String }],
  methodology: { type: String },
  ageGroup: { type: String },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Academic', academicSchema);
