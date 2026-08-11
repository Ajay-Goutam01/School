const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  sessionYear: { type: String, default: '2026–2027' },
  isAdmissionsOpen: { type: Boolean, default: true },
  eligibilityText: { type: String, default: 'Minimum age criteria for Nursery is 3+ years as of April 30th of the academic year.' },
  processSteps: [{
    stepNumber: Number,
    title: String,
    description: String
  }],
  requiredDocuments: [{ type: String }],
  importantDates: [{
    event: String,
    date: String
  }],
  availableClasses: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);
