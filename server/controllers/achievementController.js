const Achievement = require("../models/Achievement");
const {
  safeDeleteImageKitFile,
  safeReplaceImageKitFile,
} = require("../services/imagekitService");

const getAchievements = async (req, res, next) => {
  try {
    const items = await Achievement.find({ isVisible: true }).sort({
      order: 1,
      date: -1,
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const getAllAchievementsAdmin = async (req, res, next) => {
  try {
    const items = await Achievement.find().sort({ order: 1, date: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const createAchievement = async (req, res, next) => {
  try {
    const item = await Achievement.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        data: item,
        message: "Achievement record created",
      });
  } catch (err) {
    next(err);
  }
};

const updateAchievement = async (req, res, next) => {
  try {
    const oldAch = await Achievement.findById(req.params.id);
    if (!oldAch)
      return res
        .status(404)
        .json({ success: false, message: "Achievement not found" });

    const item = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (
      oldAch.imageId &&
      Object.prototype.hasOwnProperty.call(req.body, "imageId") &&
      oldAch.imageId !== req.body.imageId
    ) {
      await safeReplaceImageKitFile(
        oldAch.imageId,
        req.body.imageId,
        "Achievement",
        item._id,
      );
    }

    res.json({ success: true, data: item, message: "Achievement updated" });
  } catch (err) {
    next(err);
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Achievement not found" });

    if (item.imageId) {
      await safeDeleteImageKitFile(item.imageId, "Achievement", item._id);
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Achievement deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAchievements,
  getAllAchievementsAdmin,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
