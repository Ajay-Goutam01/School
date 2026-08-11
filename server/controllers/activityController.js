const Activity = require("../models/Activity");
const {
  safeDeleteImageKitFile,
  safeReplaceImageKitFile,
} = require("../services/imagekitService");

const getActivities = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isVisible: { $ne: false } };
    if (category && category !== "All") filter.category = category;
    const activities = await Activity.find(filter).sort({
      order: 1,
      createdAt: -1,
    });
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
};

const getAllActivitiesAdmin = async (req, res, next) => {
  try {
    const activities = await Activity.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
};

const createActivity = async (req, res, next) => {
  try {
    const activity = await Activity.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        data: activity,
        message: "Activity added successfully",
      });
  } catch (err) {
    next(err);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const oldAct = await Activity.findById(req.params.id);
    if (!oldAct)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });

    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (
      oldAct.imageId &&
      Object.prototype.hasOwnProperty.call(req.body, "imageId") &&
      oldAct.imageId !== req.body.imageId
    ) {
      await safeReplaceImageKitFile(
        oldAct.imageId,
        req.body.imageId,
        "Activity",
        activity._id,
      );
    }

    res.json({
      success: true,
      data: activity,
      message: "Activity updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });

    if (activity.imageId) {
      await safeDeleteImageKitFile(activity.imageId, "Activity", activity._id);
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Activity deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActivities,
  getAllActivitiesAdmin,
  createActivity,
  updateActivity,
  deleteActivity,
};
