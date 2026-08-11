const express = require('express');
const router = express.Router();
const { getFacilities, getAllFacilitiesAdmin, createFacility, updateFacility, deleteFacility } = require('../controllers/facilityController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getFacilities);
router.get('/all', protectAdmin, getAllFacilitiesAdmin);
router.post('/', protectAdmin, createFacility);
router.put('/:id', protectAdmin, updateFacility);
router.delete('/:id', protectAdmin, deleteFacility);

module.exports = router;
