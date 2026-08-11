const express = require('express');
const router = express.Router();
const { 
  getGallery, 
  getAllGalleryAdmin, 
  createGalleryItem, 
  updateGalleryItem, 
  deleteGalleryItem,
  bulkDeleteGalleryItems 
} = require('../controllers/galleryController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getGallery);
router.get('/all', protectAdmin, getAllGalleryAdmin);
router.post('/', protectAdmin, createGalleryItem);
router.post('/bulk-delete', protectAdmin, bulkDeleteGalleryItems);
router.put('/:id', protectAdmin, updateGalleryItem);
router.delete('/:id', protectAdmin, deleteGalleryItem);

module.exports = router;
