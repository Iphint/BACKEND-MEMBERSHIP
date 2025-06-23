const express = require('express');
const router = express.Router();
const RewardTierController = require('../controller/RewardTierController');
const { verifyToken } = require('../middleware/AuthMiddleware');
const upload = require('../middleware/Upload');
const { general, admin } = require('../config/Auth');

router.get(
  '/reward-tiers',
  verifyToken,
  general,
  RewardTierController.getAllRewardTiers
);
router.get(
  '/reward-tier/:id',
  verifyToken,
  general,
  RewardTierController.getRewardTierById
);
router.post(
  '/reward-tier',
  upload.single('image_url'),
  verifyToken,
  admin,
  RewardTierController.createRewardTier
);
router.put(
  '/reward-tier/:id',
  upload.single('image_url'),
  verifyToken,
  admin,
  RewardTierController.updateRewardTier
);

module.exports = router;
