const express = require('express');
const router = express.Router();
const { submitEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiryController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/', submitEnquiry);
router.get('/', protectAdmin, getEnquiries);
router.patch('/:id', protectAdmin, updateEnquiryStatus);
router.delete('/:id', protectAdmin, deleteEnquiry);

module.exports = router;
