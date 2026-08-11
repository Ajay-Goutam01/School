const imagekit = require("../config/imagekit");
const { safeDeleteImageKitFile } = require("../services/imagekitService");

// @desc    Upload image file to ImageKit (or fallback Data URI)
// @route   POST /api/upload
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `school_${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, "_")}`;

    if (imagekit) {
      const result = await imagekit.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: "/school_website",
      });

      return res.json({
        success: true,
        data: {
          url: result.url,
          fileId: result.fileId,
          name: result.name,
        },
        message: "Image uploaded successfully to ImageKit",
      });
    } else {
      const mimeType = req.file.mimetype;
      const base64Data = fileBuffer.toString("base64");
      const dataUri = `data:${mimeType};base64,${base64Data}`;

      return res.json({
        success: true,
        data: {
          url: dataUri,
          fileId: `local_${Date.now()}`,
          name: fileName,
        },
        message:
          "Image processed (Local fallback; configure ImageKit keys in .env for production CDN)",
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Delete image file from ImageKit
// @route   DELETE /api/upload/:fileId
const deleteImage = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    if (!fileId || fileId.startsWith("local_")) {
      return res.json({
        success: true,
        message: "Local image record removed.",
      });
    }

    const result = await safeDeleteImageKitFile(fileId);
    res.json({
      success: true,
      message: result.deleted
        ? "Image deleted from CDN"
        : "Image reference removed; the file is still referenced or could not be deleted.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage, deleteImage };
