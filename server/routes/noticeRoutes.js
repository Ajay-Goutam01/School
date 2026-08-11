const express = require('express');
const router = express.Router();
const { getPublicNotices, getAllNoticesAdmin, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getPublicNotices);
router.get('/all', protectAdmin, getAllNoticesAdmin);
router.post('/', protectAdmin, createNotice);
router.put('/:id', protectAdmin, updateNotice);
router.delete('/:id', protectAdmin, deleteNotice);

module.exports = router;
