const Academic = require('../models/Academic');

const getAcademics = async (req, res, next) => {
  try {
    const academics = await Academic.find({ isVisible: { $ne: false } }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: academics });
  } catch (err) {
    next(err);
  }
};

const getAllAcademicsAdmin = async (req, res, next) => {
  try {
    const academics = await Academic.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: academics });
  } catch (err) {
    next(err);
  }
};

const createAcademic = async (req, res, next) => {
  try {
    const item = await Academic.create(req.body);
    res.status(201).json({ success: true, data: item, message: 'Academic level added' });
  } catch (err) {
    next(err);
  }
};

const updateAcademic = async (req, res, next) => {
  try {
    const item = await Academic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Academic level not found' });
    res.json({ success: true, data: item, message: 'Academic level updated' });
  } catch (err) {
    next(err);
  }
};

const deleteAcademic = async (req, res, next) => {
  try {
    const item = await Academic.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Academic level not found' });
    res.json({ success: true, message: 'Academic level deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAcademics, getAllAcademicsAdmin, createAcademic, updateAcademic, deleteAcademic };
