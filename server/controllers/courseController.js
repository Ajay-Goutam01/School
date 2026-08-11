const Course = require("../models/Course");
const {
  safeDeleteImageKitFile,
  safeReplaceImageKitFile,
} = require("../services/imagekitService");

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({
      isActive: true,
      isVisible: { $ne: false },
    }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

const getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        data: course,
        message: "Course created successfully",
      });
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const oldCrs = await Course.findById(req.params.id);
    if (!oldCrs)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (
      oldCrs.imageId &&
      Object.prototype.hasOwnProperty.call(req.body, "imageId") &&
      oldCrs.imageId !== req.body.imageId
    ) {
      await safeReplaceImageKitFile(
        oldCrs.imageId,
        req.body.imageId,
        "Course",
        course._id,
      );
    }

    res.json({
      success: true,
      data: course,
      message: "Course updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (course.imageId) {
      await safeDeleteImageKitFile(course.imageId, "Course", course._id);
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
};
