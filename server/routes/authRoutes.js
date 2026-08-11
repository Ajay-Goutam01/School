const express = require('express');
const router = express.Router();
const { loginAdmin, getMe, changePassword, logoutAdmin } = require('../controllers/authController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getMe);
router.put('/change-password', protectAdmin, changePassword);
router.post('/logout', protectAdmin, logoutAdmin);

module.exports = router;
