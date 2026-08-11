const express = require('express');
const router = express.Router();
const { getActivities, getAllActivitiesAdmin, createActivity, updateActivity, deleteActivity } = require('../controllers/activityController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getActivities);
router.get('/all', protectAdmin, getAllActivitiesAdmin);
router.post('/', protectAdmin, createActivity);
router.put('/:id', protectAdmin, updateActivity);
router.delete('/:id', protectAdmin, deleteActivity);

module.exports = router;
