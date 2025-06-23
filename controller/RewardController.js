const RewardModel = require('../models/RewardModel');

exports.createReward = async (req, res) => {
  const user_id = req.user.id;
  const { point_transaction, reward_name } = req.body;

  // Validasi input
  if (!user_id || !point_transaction || !reward_name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await RewardModel.createReward(
      user_id,
      point_transaction,
      reward_name
    );
    res.status(201).json({
      message: 'Reward created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error creating reward:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await RewardModel.getAllRewards();
    res.status(200).json({
      message: 'Rewards fetched successfully',
      data: rewards,
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
