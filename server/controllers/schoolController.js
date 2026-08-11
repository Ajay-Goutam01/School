const SchoolProfile = require("../models/SchoolProfile");
const Enquiry = require("../models/Enquiry");
const News = require("../models/News");
const Notice = require("../models/Notice");
const Gallery = require("../models/Gallery");
const Faculty = require("../models/Faculty");
const {
  safeDeleteImageKitFile,
  safeReplaceImageKitFile,
} = require("../services/imagekitService");

// @desc    Get school profile settings & feeVisibility state
// @route   GET /api/school
const getSchoolProfile = async (req, res, next) => {
  try {
    let profile = await SchoolProfile.findOne();
    if (!profile) {
      profile = await SchoolProfile.create({});
    }

    if (!profile.customGoogleMapsUrl) {
      if (profile.latitude && profile.longitude) {
        profile.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${profile.latitude},${profile.longitude}`;
      } else if (profile.address) {
        const queryStr = `${profile.address}, ${profile.city || ""}, ${profile.state || ""} ${profile.pincode || ""}`;
        profile.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr)}`;
      }
    } else {
      profile.googleMapsUrl = profile.customGoogleMapsUrl;
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

// @desc    Update school profile (Handles logo, hero, and about image replacement & safe CDN cleanup)
// @route   PUT /api/school
const updateSchoolProfile = async (req, res, next) => {
  try {
    let oldProfile = await SchoolProfile.findOne();
    let oldLogoId = oldProfile ? oldProfile.logoId : null;
    let oldHeroImageId = oldProfile ? oldProfile.heroSettings?.imageId : null;
    let oldAboutImageId = oldProfile ? oldProfile.aboutSettings?.imageId : null;

    let profile = oldProfile || new SchoolProfile(req.body);
    if (oldProfile) {
      Object.assign(profile, req.body);
    }

    if (!profile.customGoogleMapsUrl) {
      if (profile.latitude && profile.longitude) {
        profile.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${profile.latitude},${profile.longitude}`;
      } else if (profile.address) {
        const queryStr = `${profile.address}, ${profile.city || ""}, ${profile.state || ""} ${profile.pincode || ""}`;
        profile.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr)}`;
      }
    } else {
      profile.googleMapsUrl = profile.customGoogleMapsUrl;
    }

    await profile.save();

    // Check & safely clean up replaced images if no longer referenced elsewhere
    if (
      oldLogoId &&
      Object.prototype.hasOwnProperty.call(req.body, "logoId") &&
      oldLogoId !== req.body.logoId
    ) {
      await safeReplaceImageKitFile(
        oldLogoId,
        req.body.logoId,
        "SchoolProfile",
        profile._id,
      );
    }
    if (
      oldHeroImageId &&
      Object.prototype.hasOwnProperty.call(
        req.body.heroSettings || {},
        "imageId",
      ) &&
      oldHeroImageId !== req.body.heroSettings.imageId
    ) {
      await safeReplaceImageKitFile(
        oldHeroImageId,
        req.body.heroSettings.imageId,
        "SchoolProfile",
        profile._id,
      );
    }
    if (
      oldAboutImageId &&
      Object.prototype.hasOwnProperty.call(
        req.body.aboutSettings || {},
        "imageId",
      ) &&
      oldAboutImageId !== req.body.aboutSettings.imageId
    ) {
      await safeReplaceImageKitFile(
        oldAboutImageId,
        req.body.aboutSettings.imageId,
        "SchoolProfile",
        profile._id,
      );
    }

    res.json({
      success: true,
      data: profile,
      message: "School profile updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle fee visibility on website
// @route   PATCH /api/school/fee-visibility
const toggleFeeVisibility = async (req, res, next) => {
  try {
    let profile = await SchoolProfile.findOne();
    if (!profile) {
      profile = new SchoolProfile({ feeVisibility: req.body.feeVisibility });
    } else {
      profile.feeVisibility =
        typeof req.body.feeVisibility === "boolean"
          ? req.body.feeVisibility
          : !profile.feeVisibility;
    }
    await profile.save();
    res.json({
      success: true,
      data: { feeVisibility: profile.feeVisibility },
      message: `Fee structure visibility is now ${profile.feeVisibility ? "ON (Public)" : "OFF (Hidden)"}`,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lightweight Admin Dashboard Statistics
// @route   GET /api/school/dashboard-stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalEnquiries,
      newEnquiries,
      publishedNews,
      activeNotices,
      galleryCount,
      facultyCount,
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "New" }),
      News.countDocuments({ isPublished: true, isVisible: true }),
      Notice.countDocuments({ isPublished: true, isVisible: true }),
      Gallery.countDocuments({ isVisible: true }),
      Faculty.countDocuments({ isVisible: true }),
    ]);

    res.json({
      success: true,
      data: {
        totalEnquiries,
        newEnquiries,
        publishedNews,
        activeNotices,
        galleryCount,
        facultyCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSchoolProfile,
  updateSchoolProfile,
  toggleFeeVisibility,
  getDashboardStats,
};
