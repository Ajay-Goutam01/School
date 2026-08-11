const express = require('express');
const router = express.Router();
const { getCourses, getAllCoursesAdmin, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getCourses);
router.get('/all', protectAdmin, getAllCoursesAdmin);
router.post('/', protectAdmin, createCourse);
router.put('/:id', protectAdmin, updateCourse);
router.delete('/:id', protectAdmin, deleteCourse);

module.exports = router;
