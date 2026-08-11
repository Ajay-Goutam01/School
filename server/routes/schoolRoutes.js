const express = require('express');
const router = express.Router();
const { getSchoolProfile, updateSchoolProfile, toggleFeeVisibility, getDashboardStats } = require('../controllers/schoolController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getSchoolProfile);
router.put('/', protectAdmin, updateSchoolProfile);
router.patch('/fee-visibility', protectAdmin, toggleFeeVisibility);
router.get('/dashboard-stats', protectAdmin, getDashboardStats);

module.exports = router;
