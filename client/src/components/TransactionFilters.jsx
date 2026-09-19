const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = [
  'Food', 'Transportation', 'Shopping', 'Bills',
  'Entertainment', 'Education', 'Health', 'Other',
];
const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

const TransactionFilters = ({ filters, onChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Reset category when type changes
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
    <div className="card border-0 shadow-sm p-3 mb-3">
      <div className="row g-2 align-items-end">
        {/* Search */}
        <div className="col-12 col-md-4">
          <label className="form-label small fw-semibold mb-1">Search</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="search"
            placeholder="Search description or category..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        {/* Type */}
        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold mb-1">Type</label>
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
          <label className="form-label small fw-semibold mb-1">Category</label>
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
          <label className="form-label small fw-semibold mb-1">From Date</label>
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
          <label className="form-label small fw-semibold mb-1">To Date</label>
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
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
