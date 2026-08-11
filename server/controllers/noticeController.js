const Notice = require('../models/Notice');

const getPublicNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({ isPublished: true, isVisible: { $ne: false } }).sort({ order: 1, date: -1 });
    res.json({ success: true, data: notices });
  } catch (err) {
    next(err);
  }
};

const getAllNoticesAdmin = async (req, res, next) => {
  try {
    const notices = await Notice.find().sort({ order: 1, date: -1 });
    res.json({ success: true, data: notices });
  } catch (err) {
    next(err);
  }
};

const createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json({ success: true, data: notice, message: 'Notice published' });
  } catch (err) {
    next(err);
  }
};

const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, data: notice, message: 'Notice updated' });
  } catch (err) {
    next(err);
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, message: 'Notice deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPublicNotices, getAllNoticesAdmin, createNotice, updateNotice, deleteNotice };
