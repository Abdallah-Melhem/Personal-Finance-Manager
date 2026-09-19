const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

/**
 * @desc    Get dashboard financial summary
 * @route   GET /api/dashboard/summary
 * @access  Private
 */
const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate total income and total expense
    const totals = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let transactionCount = 0;

    totals.forEach((item) => {
      if (item._id === 'income') {
        totalIncome = item.totalAmount;
      } else if (item._id === 'expense') {
        totalExpense = item.totalAmount;
      }
      transactionCount += item.count;
    });

    const balance = totalIncome - totalExpense;

    // Fetch the 5 most recent transactions
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      summary: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpense: Number(totalExpense.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        transactionCount,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error('Dashboard summary error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message,
    });
  }
};

/**
 * @desc    Get expense totals grouped by category
 * @route   GET /api/dashboard/categories
 * @access  Private
 */
const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user._id;

    const categories = await Transaction.aggregate([
      { $match: { user: userId, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          amount: { $round: ['$amount', 2] },
          count: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Dashboard categories error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch category statistics',
      error: error.message,
    });
  }
};

/**
 * @desc    Get monthly income vs expenses breakdown
 * @route   GET /api/dashboard/monthly
 * @access  Private
 */
const getMonthlyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const rawData = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Combine monthly income and expense into structured objects
    const monthlyMap = {};

    rawData.forEach((item) => {
      const year = item._id.year;
      const monthNum = item._id.month; // 1-12
      const monthLabel = `${monthNames[monthNum - 1]} ${year}`;

      if (!monthlyMap[monthLabel]) {
        monthlyMap[monthLabel] = {
          month: monthLabel,
          income: 0,
          expense: 0,
          year,
          monthNum,
        };
      }

      if (item._id.type === 'income') {
        monthlyMap[monthLabel].income = Number(item.total.toFixed(2));
      } else if (item._id.type === 'expense') {
        monthlyMap[monthLabel].expense = Number(item.total.toFixed(2));
      }
    });

    const monthly = Object.values(monthlyMap);

    return res.status(200).json({
      success: true,
      monthly,
    });
  } catch (error) {
    console.error('Dashboard monthly stats error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyStats,
};
