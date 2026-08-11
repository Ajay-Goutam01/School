const Gallery = require("../models/Gallery");
const {
  safeDeleteImageKitFile,
  safeReplaceImageKitFile,
} = require("../services/imagekitService");

const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isVisible: { $ne: false } };
    if (category && category !== "All") filter.category = category;
    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const getAllGalleryAdmin = async (req, res, next) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const createGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.create(req.body);
    res
      .status(201)
      .json({ success: true, data: item, message: "Gallery image added" });
  } catch (err) {
    next(err);
  }
};

const updateGalleryItem = async (req, res, next) => {
  try {
    const oldItem = await Gallery.findById(req.params.id);
    if (!oldItem)
      return res
        .status(404)
        .json({ success: false, message: "Gallery item not found" });

    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Safely delete old ImageKit file if replaced and unused elsewhere
    if (
      oldItem.fileId &&
      Object.prototype.hasOwnProperty.call(req.body, "fileId") &&
      oldItem.fileId !== req.body.fileId
    ) {
      await safeReplaceImageKitFile(
        oldItem.fileId,
        req.body.fileId,
        "Gallery",
        item._id,
      );
    }

    res.json({ success: true, data: item, message: "Gallery image updated" });
  } catch (err) {
    next(err);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Gallery item not found" });

    // Check references & safely delete ImageKit CDN file if unused
    if (item.fileId) {
      await safeDeleteImageKitFile(item.fileId, "Gallery", item._id);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Gallery image deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const bulkDeleteGalleryItems = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide an array of image IDs to delete",
        });
    }

    let deletedCount = 0;
    let failedCount = 0;

    for (const id of ids) {
      try {
        const item = await Gallery.findById(id);
        if (item) {
          if (item.fileId) {
            await safeDeleteImageKitFile(item.fileId, "Gallery", id);
          }
          await Gallery.findByIdAndDelete(id);
          deletedCount++;
        }
      } catch (err) {
        console.error(`Failed to delete gallery item ${id}:`, err.message);
        failedCount++;
      }
    }

    res.json({
      success: true,
      deletedCount,
      failedCount,
      message: `${deletedCount} image(s) deleted successfully.${failedCount > 0 ? ` ${failedCount} failed.` : ""}`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGallery,
  getAllGalleryAdmin,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  bulkDeleteGalleryItems,
};
