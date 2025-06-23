const express = require('express');
const router = express.Router();
const RewardController = require('../controller/RewardController');
const { verifyToken } = require('../middleware/AuthMiddleware');
const { user } = require('../config/Auth');

// Create a new reward
router.get('/rewards', verifyToken, user, RewardController.getAllRewards);
router.post('/claim-reward', verifyToken, user, RewardController.createReward);

module.exports = router;
