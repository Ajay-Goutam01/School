const express = require('express');
const router = express.Router();
const { getFees, getAllFeesAdmin, createFee, updateFee, deleteFee } = require('../controllers/feeController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getFees);
router.get('/all', protectAdmin, getAllFeesAdmin);
router.post('/', protectAdmin, createFee);
router.put('/:id', protectAdmin, updateFee);
router.delete('/:id', protectAdmin, deleteFee);

module.exports = router;
