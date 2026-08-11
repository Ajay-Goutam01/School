const Facility = require("../models/Facility");
const {
  safeDeleteImageKitFile,
  safeReplaceImageKitFile,
} = require("../services/imagekitService");

const getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find({ isVisible: { $ne: false } }).sort({
      order: 1,
      createdAt: -1,
    });
    res.json({ success: true, data: facilities });
  } catch (err) {
    next(err);
  }
};

const getAllFacilitiesAdmin = async (req, res, next) => {
  try {
    const facilities = await Facility.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: facilities });
  } catch (err) {
    next(err);
  }
};

const createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        data: facility,
        message: "Facility created successfully",
      });
  } catch (err) {
    next(err);
  }
};

const updateFacility = async (req, res, next) => {
  try {
    const oldFac = await Facility.findById(req.params.id);
    if (!oldFac)
      return res
        .status(404)
        .json({ success: false, message: "Facility not found" });

    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (
      oldFac.imageId &&
      Object.prototype.hasOwnProperty.call(req.body, "imageId") &&
      oldFac.imageId !== req.body.imageId
    ) {
      await safeReplaceImageKitFile(
        oldFac.imageId,
        req.body.imageId,
        "Facility",
        facility._id,
      );
    }

    res.json({
      success: true,
      data: facility,
      message: "Facility updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility)
      return res
        .status(404)
        .json({ success: false, message: "Facility not found" });

    if (facility.imageId) {
      await safeDeleteImageKitFile(facility.imageId, "Facility", facility._id);
    }

    await Facility.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Facility deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFacilities,
  getAllFacilitiesAdmin,
  createFacility,
  updateFacility,
  deleteFacility,
};
