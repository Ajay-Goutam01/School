const express = require('express');
const router = express.Router();
const { getFaculty, getAllFacultyAdmin, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getFaculty);
router.get('/all', protectAdmin, getAllFacultyAdmin);
router.post('/', protectAdmin, createFaculty);
router.put('/:id', protectAdmin, updateFaculty);
router.delete('/:id', protectAdmin, deleteFaculty);

module.exports = router;
