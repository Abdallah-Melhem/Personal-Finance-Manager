import { useState, useEffect } from 'react';

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

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const defaultCategory = newType === 'income' ? 'Salary' : 'Food';
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: defaultCategory,
    }));
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
    <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
      <h4 className="fw-bold text-primary mb-3">
        {isEdit ? 'Edit Transaction' : 'Add New Transaction'}
      </h4>

      {validationError && (
        <div className="alert alert-warning py-2 small mb-3">
          {validationError}
        </div>
      )}

      {/* Transaction Type Selection */}
      <div className="mb-3">
        <label className="form-label small fw-semibold">Transaction Type</label>
        <div className="d-flex gap-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="type"
              id="typeExpense"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleTypeChange}
            />
            <label className="form-check-label text-danger fw-semibold" htmlFor="typeExpense">
              Expense
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="type"
              id="typeIncome"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleTypeChange}
            />
            <label className="form-check-label text-success fw-semibold" htmlFor="typeIncome">
              Income
            </label>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Amount */}
        <div className="col-md-6">
          <label htmlFor="amountInput" className="form-label small fw-semibold">
            Amount ($) <span className="text-danger">*</span>
          </label>
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

        {/* Category */}
        <div className="col-md-6">
          <label htmlFor="categorySelect" className="form-label small fw-semibold">
            Category <span className="text-danger">*</span>
          </label>
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

        {/* Date */}
        <div className="col-md-6">
          <label htmlFor="dateInput" className="form-label small fw-semibold">
            Date <span className="text-danger">*</span>
          </label>
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

        {/* Description */}
        <div className="col-md-6">
          <label htmlFor="descriptionInput" className="form-label small fw-semibold">
            Description / Notes
          </label>
          <input
            type="text"
            className="form-control"
            id="descriptionInput"
            name="description"
            placeholder="e.g., Grocery shopping, Client payment"
            value={formData.description}
            onChange={handleChange}
            maxLength="200"
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
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
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Saving...
            </>
          ) : isEdit ? (
            'Update Transaction'
          ) : (
            'Add Transaction'
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
