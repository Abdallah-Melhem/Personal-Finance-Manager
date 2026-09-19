const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryBreakdown,
  getMonthlyStats,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Protect all dashboard endpoints
router.use(protect);

router.get('/summary', getSummary);
router.get('/categories', getCategoryBreakdown);
router.get('/monthly', getMonthlyStats);

module.exports = router;
