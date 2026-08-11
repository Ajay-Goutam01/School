const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getAllAchievementsAdmin,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAchievements);
router.get('/all', protectAdmin, getAllAchievementsAdmin);
router.post('/', protectAdmin, createAchievement);
router.put('/:id', protectAdmin, updateAchievement);
router.delete('/:id', protectAdmin, deleteAchievement);

module.exports = router;
