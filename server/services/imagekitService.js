const imagekit = require('../config/imagekit');
const SchoolProfile = require('../models/SchoolProfile');
const Faculty = require('../models/Faculty');
const Activity = require('../models/Activity');
const Facility = require('../models/Facility');
const Course = require('../models/Course');
const Gallery = require('../models/Gallery');
const News = require('../models/News');
const Achievement = require('../models/Achievement');
const Notice = require('../models/Notice');

/**
 * Checks whether an ImageKit fileId is referenced by any document in MongoDB
 * excluding a specific model document being deleted/updated.
 */
const isImageKitFileReferenced = async (fileId, excludeModelName = null, excludeRecordId = null) => {
  if (!fileId || fileId.startsWith('local_')) return false;

  try {
    const checks = [];

    // Helper to build query filter
    const getFilter = (field, modelName) => {
      const filter = { [field]: fileId };
      if (excludeModelName === modelName && excludeRecordId) {
        filter._id = { $ne: excludeRecordId };
      }
      return filter;
    };

    checks.push(
      SchoolProfile.findOne({
        $or: [
          getFilter('logoId', 'SchoolProfile'),
          getFilter('heroSettings.imageId', 'SchoolProfile'),
          getFilter('aboutSettings.imageId', 'SchoolProfile')
        ]
      })
    );

    checks.push(Faculty.findOne(getFilter('photoId', 'Faculty')));
    checks.push(Activity.findOne(getFilter('imageId', 'Activity')));
    checks.push(Facility.findOne(getFilter('imageId', 'Facility')));
    checks.push(Course.findOne(getFilter('imageId', 'Course')));
    checks.push(Gallery.findOne(getFilter('fileId', 'Gallery')));
    checks.push(News.findOne(getFilter('imageId', 'News')));
    checks.push(Achievement.findOne(getFilter('imageId', 'Achievement')));
    checks.push(Notice.findOne(getFilter('attachmentId', 'Notice')));

    const results = await Promise.all(checks);
    return results.some(doc => doc !== null);
  } catch (err) {
    console.error('[ImageKit Service] Reference check error:', err.message);
    return true; // Conservative safety fallback: assume referenced on error to prevent accidental deletion
  }
};

/**
 * Safely deletes an image from ImageKit CDN if it is no longer referenced anywhere in MongoDB.
 */
const safeDeleteImageKitFile = async (fileId, excludeModelName = null, excludeRecordId = null) => {
  if (!fileId || fileId.startsWith('local_')) {
    return { deleted: false, reason: 'local_or_empty' };
  }

  const referenced = await isImageKitFileReferenced(fileId, excludeModelName, excludeRecordId);

  if (referenced) {
    console.log(`[ImageKit Service] File ${fileId} is still referenced in database. Skipping CDN deletion.`);
    return { deleted: false, reason: 'still_referenced' };
  }

  if (imagekit) {
    try {
      await imagekit.deleteFile(fileId);
      console.log(`[ImageKit Service] Successfully deleted file ${fileId} from ImageKit CDN.`);
      return { deleted: true };
    } catch (err) {
      console.warn(`[ImageKit Service] Delete warning for file ${fileId}:`, err.message);
      return { deleted: false, reason: err.message };
    }
  } else {
    console.log(`[ImageKit Service] ImageKit credentials not configured. Skipped CDN deletion for ${fileId}.`);
    return { deleted: false, reason: 'not_configured' };
  }
};

/**
 * Safely cleans up old ImageKit file after a replacement upload succeeds.
 */
const safeReplaceImageKitFile = async (oldFileId, newFileId, excludeModelName = null, excludeRecordId = null) => {
  if (oldFileId && oldFileId !== newFileId) {
    return await safeDeleteImageKitFile(oldFileId, excludeModelName, excludeRecordId);
  }
  return { deleted: false, reason: 'no_change' };
};

module.exports = {
  isImageKitFileReferenced,
  safeDeleteImageKitFile,
  safeReplaceImageKitFile
};
