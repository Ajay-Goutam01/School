const News = require("../models/News");
const {
  safeDeleteImageKitFile,
  safeReplaceImageKitFile,
} = require("../services/imagekitService");

const getPublicNews = async (req, res, next) => {
  try {
    const { category, limit } = req.query;
    let query = News.find({ isPublished: true, isVisible: { $ne: false } });
    if (category) query = query.where("category").equals(category);
    query = query.sort({ order: 1, date: -1 });
    if (limit) query = query.limit(parseInt(limit));
    const newsList = await query;
    res.json({ success: true, data: newsList });
  } catch (err) {
    next(err);
  }
};

const getAllNewsAdmin = async (req, res, next) => {
  try {
    const newsList = await News.find().sort({ order: 1, date: -1 });
    res.json({ success: true, data: newsList });
  } catch (err) {
    next(err);
  }
};

const getNewsById = async (req, res, next) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const createNews = async (req, res, next) => {
  try {
    const item = await News.create(req.body);
    res
      .status(201)
      .json({ success: true, data: item, message: "News / Event created" });
  } catch (err) {
    next(err);
  }
};

const updateNews = async (req, res, next) => {
  try {
    const oldNews = await News.findById(req.params.id);
    if (!oldNews)
      return res
        .status(404)
        .json({ success: false, message: "News item not found" });

    const item = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (
      oldNews.imageId &&
      req.body.imageId &&
      oldNews.imageId !== req.body.imageId
    ) {
      await safeReplaceImageKitFile(
        oldNews.imageId,
        req.body.imageId,
        "News",
        item._id,
      );
    }

    res.json({ success: true, data: item, message: "News / Event updated" });
  } catch (err) {
    next(err);
  }
};

const deleteNews = async (req, res, next) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "News item not found" });

    if (item.imageId) {
      await safeDeleteImageKitFile(item.imageId, "News", item._id);
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "News / Event deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicNews,
  getAllNewsAdmin,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
