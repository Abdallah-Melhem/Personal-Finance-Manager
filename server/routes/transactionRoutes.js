const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const {
  validate,
  createTransactionValidationRules,
  updateTransactionValidationRules,
} = require('../middleware/validatorMiddleware');

// All transaction routes are protected
router.use(protect);

router
  .route('/')
  .post(createTransactionValidationRules, validate, createTransaction)
  .get(getTransactions);

router
  .route('/:id')
  .get(getTransactionById)
  .put(updateTransactionValidationRules, validate, updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
