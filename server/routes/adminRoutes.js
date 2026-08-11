const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/authController');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Protected admin security routes
router.put('/change-password', protectAdmin, changePassword);

module.exports = router;
