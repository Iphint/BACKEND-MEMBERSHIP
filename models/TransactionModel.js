const { PrismaClient } = require('@prisma/client');
const { get } = require('../routes/TransactionRoutes');
const redisClient = require('../config/Redis');
const prisma = new PrismaClient();

const TransactionModel = {
  createTransaction: async (
    user_id,
    name_product_transaction,
    price_product_transaction,
    quantity_product_transaction,
    point_transaction
  ) => {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Simpan transaksi
        const transaction = await tx.transaction.create({
          data: {
            user_id: parseInt(user_id),
            name_product_transaction,
            price_product_transaction,
            quantity_product_transaction,
            point_transaction,
          },
        });

        // 2. Cek apakah user sudah punya data point
        const existingPoint = await tx.point.findFirst({
          where: { user_id: parseInt(user_id) },
        });

        if (existingPoint) {
          // Tambahkan poin
          await tx.point.update({
            where: { id: existingPoint.id },
            data: {
              point_balance: {
                increment: point_transaction,
              },
            },
          });
        } else {
          // Buat data poin baru
          await tx.point.create({
            data: {
              user_id: parseInt(user_id),
              point_balance: point_transaction,
            },
          });
        }

        return transaction;
      });

      const cacheKeyToInvalidate = 'all_transactions_with_users';
      await redisClient.del(cacheKeyToInvalidate);
      console.log(
        `Cache "${cacheKeyToInvalidate}" dihapus setelah transaksi baru dibuat.`
      );

      return result;
    } catch (error) {
      console.error('Error creating transaction and adding points:', error);
      throw error;
    }
  },
  getAllTransactions: async () => {
    const cacheKey = 'all_transactions_with_users';
    const CACHE_EXPIRATION_TIME = 60 * 5;
    try {
      const canchedTransactions = await redisClient.get(cacheKey);
      if (canchedTransactions) {
        console.log('Mengambil semua transaksi dari cache Redis.');
        return JSON.parse(canchedTransactions);
      }
      const transactions = await prisma.transaction.findMany({
        include: {
          user: true,
        },
      });
      await redisClient.setex(
        cacheKey,
        CACHE_EXPIRATION_TIME,
        JSON.stringify(transactions)
      );
      console.log(
        `Semua transaksi disimpan ke Redis dengan masa berlaku ${CACHE_EXPIRATION_TIME} detik.`
      );
      console.log('Mengambil semua transaksi dari database.');
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
  getTransactionById: async (id) => {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: true,
        },
      });
      return transaction;
    } catch (error) {
      console.error('Error fetching transaction by ID:', error);
      throw error;
    }
  },
  getTransactionsByUserId: async (user_id) => {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { user_id: parseInt(user_id) },
        include: {
          user: true,
        },
      });
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions by user ID:', error);
      throw error;
    }
  },
  updateTransaction: async (id, data) => {
    try {
      const updatedTransaction = await prisma.transaction.update({
        where: { id: parseInt(id) },
        data,
      });
      const cacheKeyToInvalidate = 'all_transactions_with_users';
      await redisClient.del(cacheKeyToInvalidate);
      console.log(
        `Cache "${cacheKeyToInvalidate}" dihapus setelah transaksi updated dibuat.`
      );
      return updatedTransaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },
  deleteTransaction: async (id) => {
    try {
      const deletedTransaction = await prisma.transaction.delete({
        where: { id: parseInt(id) },
      });
      const cacheKeyToInvalidate = 'all_transactions_with_users';
      await redisClient.del(cacheKeyToInvalidate);
      console.log(
        `Cache "${cacheKeyToInvalidate}" dihapus setelah transaksi single delete dibuat.`
      );
      return deletedTransaction;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
  deleteAllTransactions: async () => {
    try {
      const deletedTransactions = await prisma.transaction.deleteMany();
      const cacheKeyToInvalidate = 'all_transactions_with_users';
      await redisClient.del(cacheKeyToInvalidate);
      console.log(
        `Cache "${cacheKeyToInvalidate}" dihapus setelah transaksi delete all dibuat.`
      );
      return deletedTransactions;
    } catch (error) {
      console.error('Error deleting all transactions:', error);
      throw error;
    }
  },
};

module.exports = TransactionModel;
