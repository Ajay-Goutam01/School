const express = require('express');
const router = express.Router();
const { getAcademics, getAllAcademicsAdmin, createAcademic, updateAcademic, deleteAcademic } = require('../controllers/academicController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAcademics);
router.get('/all', protectAdmin, getAllAcademicsAdmin);
router.post('/', protectAdmin, createAcademic);
router.put('/:id', protectAdmin, updateAcademic);
router.delete('/:id', protectAdmin, deleteAcademic);

module.exports = router;
