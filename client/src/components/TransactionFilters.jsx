import { Search, Filter, Tag, Calendar, RotateCcw } from 'lucide-react';

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
const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

const TransactionFilters = ({ filters, onChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      onChange({ ...filters, type: value, category: '' });
    } else {
      onChange({ ...filters, [name]: value });
    }
  };

  const categoryOptions =
    filters.type === 'income'
      ? INCOME_CATEGORIES
      : filters.type === 'expense'
      ? EXPENSE_CATEGORIES
      : ALL_CATEGORIES;

  const isFiltered =
    filters.search ||
    filters.type ||
    filters.category ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="card p-3 p-md-4 mb-4">
      <div className="row g-3 align-items-end">
        {/* Search Input */}
        <div className="col-12 col-md-4">
          <label className="form-label small mb-1 d-flex align-items-center gap-1">
            <Search size={14} className="text-primary" />
            <span>Search Description</span>
          </label>
          <div className="input-group input-group-sm">
            <span className="input-group-text">
              <Search size={15} />
            </span>
            <input
              type="text"
              className="form-control"
              name="search"
              placeholder="e.g. Grocery, Salary..."
              value={filters.search}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="col-6 col-md-2">
          <label className="form-label small mb-1 d-flex align-items-center gap-1">
            <Filter size={14} className="text-primary" />
            <span>Type</span>
          </label>
          <select
            className="form-select form-select-sm"
            name="type"
            value={filters.type}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="col-6 col-md-2">
          <label className="form-label small mb-1 d-flex align-items-center gap-1">
            <Tag size={14} className="text-primary" />
            <span>Category</span>
          </label>
          <select
            className="form-select form-select-sm"
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div className="col-6 col-md-2">
          <label className="form-label small mb-1 d-flex align-items-center gap-1">
            <Calendar size={14} className="text-primary" />
            <span>From</span>
          </label>
          <input
            type="date"
            className="form-control form-control-sm"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        {/* To Date */}
        <div className="col-6 col-md-2">
          <label className="form-label small mb-1 d-flex align-items-center gap-1">
            <Calendar size={14} className="text-primary" />
            <span>To</span>
          </label>
          <input
            type="date"
            className="form-control form-control-sm"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <div className="col-12 col-md-auto ms-auto">
            <button
              className="btn btn-outline-secondary btn-sm w-100"
              type="button"
              onClick={onReset}
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
