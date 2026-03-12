import Wallet from '../models/Wallet.model.js';
import Barber from '../models/Barber.model.js';

export const getWallet = async (req, res) => {
  try {
    // Check if user is a barber
    if (req.user.role !== 'barber') {
      return res.status(403).json({ message: 'Access denied. Only barbers can access wallet.' });
    }

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await Wallet.create({ 
        userId: req.user._id,
        availableBalance: 0,
        blockedCommission: 0,
        totalEarnings: 0,
        totalWithdrawn: 0
      });
    }

    res.json(wallet);
  } catch (error) {
    console.error('Get Wallet Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // Check if user is a barber
    if (req.user.role !== 'barber') {
      return res.status(403).json({ message: 'Access denied. Only barbers can access transactions.' });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.json([]);
    }

    const transactions = wallet.transactions ? wallet.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
    res.json(transactions);
  } catch (error) {
    console.error('Get Transactions Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const withdrawFunds = async (req, res) => {
  try {
    const { amount, accountDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.availableBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    wallet.availableBalance -= amount;
    wallet.totalWithdrawn += amount;
    wallet.transactions.push({
      type: 'withdrawal',
      amount: -amount,
      description: `Withdrawal to ${accountDetails?.accountNumber || 'bank account'}`,
    });
    await wallet.save();

    res.json({ message: 'Withdrawal request processed', wallet });
  } catch (error) {
    console.error('Withdraw Funds Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};