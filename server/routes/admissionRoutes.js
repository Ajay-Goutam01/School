const express = require('express');
const router = express.Router();
const { getAdmissionDetails, updateAdmissionDetails, toggleAdmissionStatus } = require('../controllers/admissionController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAdmissionDetails);
router.put('/', protectAdmin, updateAdmissionDetails);
router.patch('/status', protectAdmin, toggleAdmissionStatus);

module.exports = router;
