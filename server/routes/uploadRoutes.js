const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/', protectAdmin, upload.single('image'), uploadImage);
router.delete('/:fileId', protectAdmin, deleteImage);

module.exports = router;
