const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const imagekit = require("./config/imagekit");
const SchoolProfile = require("./models/SchoolProfile");
const Faculty = require("./models/Faculty");
const Activity = require("./models/Activity");
const Facility = require("./models/Facility");
const Course = require("./models/Course");
const Gallery = require("./models/Gallery");
const News = require("./models/News");
const Achievement = require("./models/Achievement");
const Notice = require("./models/Notice");

const runImageCleanup = async () => {
  try {
    if (
      process.env.NODE_ENV === "production" &&
      (process.env.ALLOW_IMAGE_CLEANUP !== "true" ||
        process.env.CONFIRM_IMAGE_CLEANUP !== "YES")
    ) {
      throw new Error(
        "Image cleanup is disabled in production unless explicitly authorized.",
      );
    }

    await connectDB();

    if (!imagekit) {
      console.log(
        "ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env",
      );
      process.exit(0);
    }

    console.log("Gathering active ImageKit file IDs from MongoDB database...");

    const [
      profiles,
      faculty,
      activities,
      facilities,
      courses,
      gallery,
      news,
      achievements,
      notices,
    ] = await Promise.all([
      SchoolProfile.find(),
      Faculty.find(),
      Activity.find(),
      Facility.find(),
      Course.find(),
      Gallery.find(),
      News.find(),
      Achievement.find(),
      Notice.find(),
    ]);

    const dbFileIds = new Set();

    profiles.forEach((p) => {
      if (p.logoId && !p.logoId.startsWith("local_")) dbFileIds.add(p.logoId);
      if (
        p.heroSettings?.imageId &&
        !p.heroSettings.imageId.startsWith("local_")
      )
        dbFileIds.add(p.heroSettings.imageId);
      if (
        p.aboutSettings?.imageId &&
        !p.aboutSettings.imageId.startsWith("local_")
      )
        dbFileIds.add(p.aboutSettings.imageId);
    });

    faculty.forEach(
      (f) =>
        f.photoId &&
        !f.photoId.startsWith("local_") &&
        dbFileIds.add(f.photoId),
    );
    activities.forEach(
      (a) =>
        a.imageId &&
        !a.imageId.startsWith("local_") &&
        dbFileIds.add(a.imageId),
    );
    facilities.forEach(
      (f) =>
        f.imageId &&
        !f.imageId.startsWith("local_") &&
        dbFileIds.add(f.imageId),
    );
    courses.forEach(
      (c) =>
        c.imageId &&
        !c.imageId.startsWith("local_") &&
        dbFileIds.add(c.imageId),
    );
    gallery.forEach(
      (g) =>
        g.fileId && !g.fileId.startsWith("local_") && dbFileIds.add(g.fileId),
    );
    news.forEach(
      (n) =>
        n.imageId &&
        !n.imageId.startsWith("local_") &&
        dbFileIds.add(n.imageId),
    );
    achievements.forEach(
      (a) =>
        a.imageId &&
        !a.imageId.startsWith("local_") &&
        dbFileIds.add(a.imageId),
    );
    notices.forEach(
      (n) =>
        n.attachmentId &&
        !n.attachmentId.startsWith("local_") &&
        dbFileIds.add(n.attachmentId),
    );

    console.log(
      `Found ${dbFileIds.size} unique active ImageKit file IDs referenced in MongoDB.`,
    );

    console.log("Fetching file list from ImageKit CDN...");
    const ikFiles = await imagekit.listFiles({
      path: "/school_website",
      limit: 500,
    });

    console.log(
      `Found ${ikFiles.length} total files stored in ImageKit folder '/school_website'.`,
    );

    const orphanedFiles = ikFiles.filter((f) => !dbFileIds.has(f.fileId));

    console.log("\n==================================================");
    console.log(`IMAGEKIT STORAGE CLEANUP REPORT:`);
    console.log(`Total Active Referenced Files: ${dbFileIds.size}`);
    console.log(`Total Files in ImageKit CDN:   ${ikFiles.length}`);
    console.log(`Orphaned Unused Files Found:   ${orphanedFiles.length}`);
    console.log("==================================================\n");

    if (orphanedFiles.length === 0) {
      console.log("ImageKit storage is 100% clean! No orphaned files found.");
      process.exit(0);
    }

    const shouldPurge = process.argv.includes("--confirm");

    if (
      shouldPurge &&
      process.env.NODE_ENV === "production" &&
      process.env.CONFIRM_IMAGE_CLEANUP !== "YES"
    ) {
      throw new Error(
        "Production image cleanup requires CONFIRM_IMAGE_CLEANUP=YES.",
      );
    }

    if (!shouldPurge) {
      console.log("Orphaned Files Detected:");
      orphanedFiles.forEach((f) =>
        console.log(` - ${f.name} (File ID: ${f.fileId})`),
      );
      console.log(
        "\nTo permanently purge these orphaned files from ImageKit, run:",
      );
      console.log("npm run cleanup-images -- --confirm\n");
      process.exit(0);
    }

    console.log("Purging orphaned files from ImageKit CDN...");
    let purgedCount = 0;
    for (const f of orphanedFiles) {
      try {
        await imagekit.deleteFile(f.fileId);
        purgedCount++;
        console.log(`✓ Purged ${f.name} (${f.fileId})`);
      } catch (err) {
        console.warn(`✗ Failed to purge ${f.name}:`, err.message);
      }
    }

    console.log(
      `\nCleanup Complete! Successfully purged ${purgedCount} of ${orphanedFiles.length} orphaned files.`,
    );
    process.exit(0);
  } catch (err) {
    console.error("ImageKit cleanup utility error:", err);
    process.exit(1);
  }
};

runImageCleanup();
