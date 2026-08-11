const FeeStructure = require('../models/FeeStructure');
const SchoolProfile = require('../models/SchoolProfile');

const getFees = async (req, res, next) => {
  try {
    const profile = await SchoolProfile.findOne();
    const isFeeVisible = profile ? profile.feeVisibility : true;

    if (!isFeeVisible && (!req.admin)) {
      return res.json({
        success: true,
        feeVisibility: false,
        message: 'Fee details are currently set to private by school administration. Please contact the admissions desk.',
        data: []
      });
    }

    const fees = await FeeStructure.find({ isVisible: { $ne: false } }).sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      feeVisibility: isFeeVisible,
      data: fees
    });
  } catch (err) {
    next(err);
  }
};

const getAllFeesAdmin = async (req, res, next) => {
  try {
    const fees = await FeeStructure.find().sort({ order: 1, createdAt: 1 });
    const profile = await SchoolProfile.findOne();
    res.json({
      success: true,
      feeVisibility: profile ? profile.feeVisibility : true,
      data: fees
    });
  } catch (err) {
    next(err);
  }
};

const createFee = async (req, res, next) => {
  try {
    const fee = await FeeStructure.create(req.body);
    res.status(201).json({ success: true, data: fee, message: 'Fee structure entry added' });
  } catch (err) {
    next(err);
  }
};

const updateFee = async (req, res, next) => {
  try {
    const fee = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });
    res.json({ success: true, data: fee, message: 'Fee structure record updated' });
  } catch (err) {
    next(err);
  }
};

const deleteFee = async (req, res, next) => {
  try {
    const fee = await FeeStructure.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });
    res.json({ success: true, message: 'Fee structure record deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFees, getAllFeesAdmin, createFee, updateFee, deleteFee };
