const express = require('express');
const router = express.Router();
const { getPublicNews, getAllNewsAdmin, getNewsById, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getPublicNews);
router.get('/all', protectAdmin, getAllNewsAdmin);
router.get('/:id', getNewsById);
router.post('/', protectAdmin, createNews);
router.put('/:id', protectAdmin, updateNews);
router.delete('/:id', protectAdmin, deleteNews);

module.exports = router;
