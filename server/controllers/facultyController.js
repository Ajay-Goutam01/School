const Faculty = require("../models/Faculty");
const {
  safeDeleteImageKitFile,
  safeReplaceImageKitFile,
} = require("../services/imagekitService");

const getFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.find({ isVisible: { $ne: false } }).sort({
      isLeadership: -1,
      order: 1,
      createdAt: -1,
    });
    res.json({ success: true, data: faculty });
  } catch (err) {
    next(err);
  }
};

const getAllFacultyAdmin = async (req, res, next) => {
  try {
    const faculty = await Faculty.find().sort({
      isLeadership: -1,
      order: 1,
      createdAt: -1,
    });
    res.json({ success: true, data: faculty });
  } catch (err) {
    next(err);
  }
};

const createFaculty = async (req, res, next) => {
  try {
    const member = await Faculty.create(req.body);
    res
      .status(201)
      .json({ success: true, data: member, message: "Faculty member added" });
  } catch (err) {
    next(err);
  }
};

const updateFaculty = async (req, res, next) => {
  try {
    const oldMember = await Faculty.findById(req.params.id);
    if (!oldMember)
      return res
        .status(404)
        .json({ success: false, message: "Faculty member not found" });

    const member = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Safely delete old ImageKit photo if replaced and unused elsewhere
    if (
      oldMember.photoId &&
      Object.prototype.hasOwnProperty.call(req.body, "photoId") &&
      oldMember.photoId !== req.body.photoId
    ) {
      await safeReplaceImageKitFile(
        oldMember.photoId,
        req.body.photoId,
        "Faculty",
        member._id,
      );
    }

    res.json({
      success: true,
      data: member,
      message: "Faculty member updated",
    });
  } catch (err) {
    next(err);
  }
};

const deleteFaculty = async (req, res, next) => {
  try {
    const member = await Faculty.findById(req.params.id);
    if (!member)
      return res
        .status(404)
        .json({ success: false, message: "Faculty member not found" });

    // Safely delete ImageKit photo if unused elsewhere
    if (member.photoId) {
      await safeDeleteImageKitFile(member.photoId, "Faculty", member._id);
    }

    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Faculty member deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFaculty,
  getAllFacultyAdmin,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
