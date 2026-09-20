import { useState, useEffect } from 'react';
import {
  DollarSign,
  Tag,
  Calendar,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Entertainment',
  'Education',
  'Health',
  'Other',
];

const TransactionForm = ({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'expense',
        amount: initialData.amount !== undefined ? initialData.amount : '',
        category: initialData.category || (initialData.type === 'income' ? 'Salary' : 'Food'),
        description: initialData.description || '',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleTypeSelect = (selectedType) => {
    const defaultCategory = selectedType === 'income' ? 'Salary' : 'Food';
    setFormData((prev) => ({
      ...prev,
      type: selectedType,
      category: defaultCategory,
    }));
    if (validationError) setValidationError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      setValidationError('Please enter a valid amount greater than zero.');
      return;
    }

    if (!formData.category) {
      setValidationError('Please select a category.');
      return;
    }

    if (!formData.date) {
      setValidationError('Please select a valid date.');
      return;
    }

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  const availableCategories =
    formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="card border-0 p-4 p-md-5">
      <div className="mb-4">
        <h4 className="fw-bold text-white mb-1">
          {isEdit ? 'Update Transaction' : 'Record New Transaction'}
        </h4>
        <p className="text-muted small mb-0">
          {isEdit
            ? 'Modify the details of your recorded financial transaction.'
            : 'Enter the details of your financial inflow or outflow.'}
        </p>
      </div>

      {validationError && (
        <div className="alert alert-warning py-2 px-3 small mb-4 d-flex align-items-center gap-2">
          <AlertCircle size={16} className="text-warning flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Transaction Type Segmented Toggle */}
      <div className="mb-4">
        <label className="form-label small mb-2 d-block">Transaction Type</label>
        <div className="type-segmented-control">
          <button
            type="button"
            className={`type-segmented-btn ${
              formData.type === 'expense' ? 'active-expense' : ''
            }`}
            onClick={() => handleTypeSelect('expense')}
          >
            <ArrowDownLeft size={16} />
            <span>Expense</span>
          </button>
          <button
            type="button"
            className={`type-segmented-btn ${
              formData.type === 'income' ? 'active-income' : ''
            }`}
            onClick={() => handleTypeSelect('income')}
          >
            <ArrowUpRight size={16} />
            <span>Income</span>
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* Amount */}
        <div className="col-12 col-md-6">
          <label htmlFor="amountInput" className="form-label small">
            Amount ($) <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <DollarSign size={16} />
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-control"
              id="amountInput"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="col-12 col-md-6">
          <label htmlFor="categorySelect" className="form-label small">
            Category <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <Tag size={16} />
            </span>
            <select
              className="form-select"
              id="categorySelect"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div className="col-12 col-md-6">
          <label htmlFor="dateInput" className="form-label small">
            Date <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <Calendar size={16} />
            </span>
            <input
              type="date"
              className="form-control"
              id="dateInput"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="col-12 col-md-6">
          <label htmlFor="descriptionInput" className="form-label small">
            Description / Memo
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <FileText size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              id="descriptionInput"
              name="description"
              placeholder="e.g. Weekly grocery trip"
              value={formData.description}
              onChange={handleChange}
              maxLength="200"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top border-purple-subtle">
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary px-4 fw-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={16}
                className="animate-spin me-2"
                style={{ animation: 'spin 1s linear infinite' }}
              />
              Saving...
            </>
          ) : isEdit ? (
            'Update Transaction'
          ) : (
            'Save Transaction'
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
