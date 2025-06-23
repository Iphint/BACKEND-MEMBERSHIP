const express = require('express');
const router = express.Router();
const TransactionController = require('../controller/TransactionController');
const { verifyToken } = require('../middleware/AuthMiddleware');
const { user, general, admin } = require('../config/Auth');

// Create a new transaction
router.get(
  '/transactions',
  verifyToken,
  general,
  TransactionController.getAllTransactions
);
router.post(
  '/transaction',
  verifyToken,
  general,
  TransactionController.createTransaction
);
router.get(
  '/transaction/:id',
  verifyToken,
  general,
  TransactionController.getTransactionById
);
router.get(
  '/transactions/user/:user_id',
  verifyToken,
  user,
  TransactionController.getTransactionsByUserId
);
router.put(
  '/transaction/:id',
  verifyToken,
  general,
  TransactionController.updateTransaction
);
router.delete(
  '/transaction/:id',
  verifyToken,
  general,
  TransactionController.deleteTransaction
);
router.delete(
  '/transactions',
  verifyToken,
  admin,
  TransactionController.deleteAllTransactions
);

module.exports = router;
