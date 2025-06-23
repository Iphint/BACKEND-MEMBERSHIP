const { PrismaClient } = require('@prisma/client');
const { get } = require('../routes/TransactionRoutes');
const prisma = new PrismaClient();

const RewardModel = {
  createReward: async (user_id, point_transaction, reward_name) => {
    try {
      const userPoint = await prisma.point.findFirst({
        where: { user_id: parseInt(user_id) },
      });
      if (!userPoint) {
        return {
          status: 'error',
          message: 'User does not have a point balance.',
        };
      }
      if (userPoint.point_balance < point_transaction) {
        return {
          status: 'error',
          message: 'Insufficient points to claim reward.',
        };
      }
      const result = await prisma.$transaction([
        prisma.reward.create({
          data: {
            user_id: parseInt(user_id),
            point_transaction,
            reward_name,
          },
        }),
        prisma.point.update({
          where: { id: userPoint.id },
          data: {
            point_balance: {
              decrement: point_transaction,
            },
          },
        }),
      ]);

      return {
        status: 'success',
        message: 'Reward claimed successfully',
        data: result[0],
      };
    } catch (error) {
      console.error('Error claiming reward:', error);
      return {
        status: 'error',
        message: 'Error claiming reward',
        error: error.message,
      };
    }
  },
  getAllRewards: async () => {
    try {
      const rewards = await prisma.reward.findMany();
      return {
        status: 'success',
        data: rewards,
      };
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return {
        status: 'error',
        message: 'Error fetching rewards',
        error: error.message,
      };
    }
  },
};

module.exports = RewardModel;
