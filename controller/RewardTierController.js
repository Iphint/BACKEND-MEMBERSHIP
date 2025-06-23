const RewardTier = require('../models/RewardTier');

exports.createRewardTier = async (req, res) => {
  const { reward_name, point_needed, description } = req.body;
  const image_url = req.file ? req.file.path : null;

  // Validasi input
  if (!reward_name || !point_needed || !description || !image_url) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const rewardTier = await RewardTier.createRewardTier(
      reward_name,
      point_needed,
      description,
      image_url
    );
    res.status(201).json({
      message: 'Reward tier created successfully',
      data: rewardTier,
    });
  } catch (error) {
    console.error('Error creating reward tier:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getAllRewardTiers = async (req, res) => {
  try {
    const rewardTiers = await RewardTier.getAllRewardTiers();
    res.status(200).json({
      message: 'Reward tiers fetched successfully',
      data: rewardTiers,
    });
  } catch (error) {
    console.error('Error fetching reward tiers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getRewardTierById = async (req, res) => {
  const { id } = req.params;

  try {
    const rewardTier = await RewardTier.getRewardTierById(id);
    if (!rewardTier) {
      return res.status(404).json({ message: 'Reward tier not found' });
    }
    res.status(200).json({
      message: 'Reward tier fetched successfully',
      data: rewardTier,
    });
  } catch (error) {
    console.error('Error fetching reward tier by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.updateRewardTier = async (req, res) => {
  const { id } = req.params;
  const { reward_name, point_needed, description } = req.body;

  const file = req.file;

  // Validasi input
  if (!reward_name || !point_needed || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updatedRewardTier = await RewardTier.updateRewardTier(
      id,
      {
        reward_name,
        point_needed: parseInt(point_needed),
        description,
      },
      file
    );

    res.status(200).json({
      message: 'Reward tier updated successfully',
      data: updatedRewardTier,
    });
  } catch (error) {
    console.error('Error updating reward tier:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};