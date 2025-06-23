const TransactionModel = require('../models/TransactionModel');

exports.createTransaction = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      name_product_transaction,
      price_product_transaction,
      quantity_product_transaction,
      point_transaction,
    } = req.body;

    // Validasi input
    if (
      !user_id ||
      !name_product_transaction ||
      !price_product_transaction ||
      !quantity_product_transaction ||
      !point_transaction
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Buat transaksi
    const transaction = await TransactionModel.createTransaction(
      user_id,
      name_product_transaction,
      price_product_transaction,
      quantity_product_transaction,
      point_transaction
    );

    res.status(201).json({
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await TransactionModel.getAllTransactions();
    res.status(200).json({
      message: 'Transactions fetched successfully',
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionModel.getTransactionById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({
      message: 'Transaction fetched successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getTransactionsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const transactions = await TransactionModel.getTransactionsByUserId(
      user_id
    );

    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ message: 'No transactions found for this user' });
    }

    res.status(200).json({
      message: 'Transactions fetched successfully',
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions by user ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_product_transaction,
      price_product_transaction,
      quantity_product_transaction,
      point_transaction,
    } = req.body;

    // Validasi input
    if (
      !name_product_transaction ||
      !price_product_transaction ||
      !quantity_product_transaction ||
      !point_transaction
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Update transaksi
    const updatedTransaction = await TransactionModel.updateTransaction(id, {
      name_product_transaction,
      price_product_transaction,
      quantity_product_transaction,
      point_transaction,
    });

    res.status(200).json({
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await TransactionModel.deleteTransaction(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({
      message: 'Transaction deleted successfully',
      data: deletedTransaction,
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.deleteAllTransactions = async (req, res) => {
  try {
    const deletedTransactions = await TransactionModel.deleteAllTransactions();
    res.status(200).json({
      message: 'All transactions deleted successfully',
      data: deletedTransactions,
    });
  } catch (error) {
    console.error('Error deleting all transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};