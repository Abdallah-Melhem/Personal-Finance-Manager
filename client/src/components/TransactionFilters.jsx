const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = [
  'Food', 'Transportation', 'Shopping', 'Bills',
  'Entertainment', 'Education', 'Health', 'Other',
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
    filters.search || filters.type || filters.category ||
    filters.startDate || filters.endDate;

  return (
    <div className="card border-0 shadow-sm p-3 mb-3 bg-white">
      <div className="row g-2 align-items-end">
        {/* Search */}
        <div className="col-12 col-md-4">
          <label className="form-label small fw-semibold mb-1">
            <i className="bi bi-search me-1 text-muted"></i>Search
          </label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm border-start-0"
              name="search"
              placeholder="Search description or category..."
              value={filters.search}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Type */}
        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold mb-1">
            <i className="bi bi-funnel me-1 text-muted"></i>Type
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

        {/* Category */}
        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold mb-1">
            <i className="bi bi-tag me-1 text-muted"></i>Category
          </label>
          <select
            className="form-select form-select-sm"
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold mb-1">
            <i className="bi bi-calendar-event me-1 text-muted"></i>From
          </label>
          <input
            type="date"
            className="form-control form-control-sm"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        {/* End Date */}
        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold mb-1">
            <i className="bi bi-calendar-check me-1 text-muted"></i>To
          </label>
          <input
            type="date"
            className="form-control form-control-sm"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>

        {/* Reset */}
        {isFiltered && (
          <div className="col-12 col-md-auto">
            <button
              className="btn btn-outline-secondary btn-sm w-100"
              type="button"
              onClick={onReset}
              title="Reset all filters"
            >
              <i className="bi bi-x-circle me-1"></i>Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
