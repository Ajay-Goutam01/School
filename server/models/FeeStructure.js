const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  academicYear: { type: String, default: '2026–2027' },
  classGrade: { type: String, required: true },
  admissionFee: { type: String, required: true },
  tuitionFee: { type: String, required: true },
  annualCharges: { type: String, required: true },
  otherCharges: { type: String, default: 'N/A' },
  notes: { type: String },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
