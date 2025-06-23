const { PrismaClient } = require('@prisma/client');
const { get } = require('../routes/UserRoutes');
const { createReward } = require('./RewardModel');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const RewardTier = {
  createRewardTier: async (
    reward_name,
    point_needed,
    description,
    image_url
  ) => {
    try {
      const rewardTier = await prisma.rewardTier.create({
        data: {
          reward_name,
          point_needed: parseInt(point_needed),
          description,
          image_url,
        },
      });
      return rewardTier;
    } catch (error) {
      console.error('Error creating reward tier:', error);
      throw error;
    }
  },
  getAllRewardTiers: async () => {
    try {
      const rewardTiers = await prisma.rewardTier.findMany();
      return rewardTiers;
    } catch (error) {
      console.error('Error fetching all reward tiers:', error);
      throw error;
    }
  },
  getRewardTierById: async (id) => {
    try {
      const rewardTier = await prisma.rewardTier.findUnique({
        where: { id: parseInt(id) },
      });
      return rewardTier;
    } catch (error) {
      console.error('Error fetching reward tier by ID:', error);
      throw error;
    }
  },
  updateRewardTier: async (id, data, newFile) => {
    try {
      const parsedId = parseInt(id);
      const existingRewardTier = await prisma.rewardTier.findUnique({
        where: { id: parsedId },
      });

      if (!existingRewardTier) {
        throw new Error('Reward tier not found');
      }

      if (newFile) {
        const oldImage = existingRewardTier.image_url;

        if (oldImage) {
          const oldImagePath = path.join(process.cwd(), 'uploads', oldImage);
          console.log('Old image path:', oldImagePath);

          if (fs.existsSync(oldImagePath)) {
            try {
              fs.unlinkSync(oldImagePath);
              console.log(`Deleted old image: ${oldImagePath}`);
            } catch (err) {
              console.error('Error deleting old image:', err);
            }
          } else {
            console.log('Old image file not found at:', oldImagePath);
          }
        }

        data.image_url = newFile.filename;
      }

      const updatedRewardTier = await prisma.rewardTier.update({
        where: { id: parsedId },
        data,
      });

      return updatedRewardTier;
    } catch (error) {
      console.error('Error updating reward tier:', error);
      throw error;
    }
  },
  deleteRewardTier: async (id) => {
    try {
      const deletedRewardTier = await prisma.rewardTier.delete({
        where: { id: parseInt(id) },
      });
      return deletedRewardTier;
    } catch (error) {
      console.error('Error deleting reward tier:', error);
      throw error;
    }
  },
};

module.exports = RewardTier;
