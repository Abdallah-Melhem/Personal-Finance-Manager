import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ─────────────────────────────────────────
// Summary Card
// ─────────────────────────────────────────
const SummaryCard = ({ title, value, colorClass, prefix = '$' }) => (
  <div className="card border-0 shadow-sm h-100">
    <div className="card-body p-3 p-md-4">
      <p className="text-muted small mb-1 fw-semibold text-uppercase">{title}</p>
      <h3 className={`fw-bold mb-0 ${colorClass}`}>
        {prefix}{typeof value === 'number' ? value.toFixed(2) : value}
      </h3>
    </div>
  </div>
);

// ─────────────────────────────────────────
// Pie Chart – Active Slice
// ─────────────────────────────────────────
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  return (
    <g>
      <text x={cx} y={cy - 12} textAnchor="middle" fill="#333" className="fw-bold" fontSize={14}>
        {payload.category}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#666" fontSize={13}>
        ${value.toFixed(2)}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#999" fontSize={12}>
        ({(percent * 100).toFixed(1)}%)
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

// ─────────────────────────────────────────
// Pie chart colors
// ─────────────────────────────────────────
const PIE_COLORS = [
  '#4f86f7', '#f97066', '#34d399', '#fbbf24',
  '#a78bfa', '#f472b6', '#38bdf8', '#fb923c',
];

// ─────────────────────────────────────────
// Custom Tooltip for Bar Chart
// ─────────────────────────────────────────
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded shadow-sm p-2 small">
        <p className="mb-1 fw-bold">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="mb-0">
            {entry.name}: ${Number(entry.value).toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePieIndex, setActivePieIndex] = useState(0);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, categoriesRes, monthlyRes] = await Promise.all([
        API.get('/dashboard/summary'),
        API.get('/dashboard/categories'),
        API.get('/dashboard/monthly'),
      ]);
      setSummary(summaryRes.data.summary);
      setCategories(categoriesRes.data.categories);
      setMonthly(monthlyRes.data.monthly);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load dashboard data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingSpinner message="Loading your financial dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <ErrorMessage message={error} onRetry={fetchDashboard} />
      </div>
    );
  }

  const hasTransactions = summary?.transactionCount > 0;
  const hasExpenses = categories.length > 0;
  const hasMonthly = monthly.length > 0;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-1">Dashboard</h2>
          <p className="text-muted small mb-0">
            Welcome back, <strong>{user?.name}</strong>! Here's your financial overview.
          </p>
        </div>
        <Link to="/transactions/add" className="btn btn-primary px-3 shadow-sm">
          + Add Transaction
        </Link>
      </div>

      {!hasTransactions ? (
        <div className="card border-0 shadow-sm p-5 text-center">
          <div className="text-muted mb-3 fs-1">📊</div>
          <h5 className="fw-bold text-secondary">No financial data yet</h5>
          <p className="text-muted small mb-3">
            Add your first transaction to see your balance, charts, and financial summary.
          </p>
          <div>
            <Link to="/transactions/add" className="btn btn-primary btn-sm px-4">
              Add Your First Transaction
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ─── Summary Cards ─── */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <SummaryCard
                title="Current Balance"
                value={summary.balance}
                colorClass={summary.balance >= 0 ? 'text-primary' : 'text-danger'}
              />
            </div>
            <div className="col-6 col-lg-3">
              <SummaryCard
                title="Total Income"
                value={summary.totalIncome}
                colorClass="text-success"
              />
            </div>
            <div className="col-6 col-lg-3">
              <SummaryCard
                title="Total Expenses"
                value={summary.totalExpense}
                colorClass="text-danger"
              />
            </div>
            <div className="col-6 col-lg-3">
              <SummaryCard
                title="Total Transactions"
                value={summary.transactionCount}
                colorClass="text-secondary"
                prefix=""
              />
            </div>
          </div>

          {/* ─── Charts Row ─── */}
          <div className="row g-4 mb-4">
            {/* Income vs Expenses Bar Chart */}
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3 p-md-4">
                  <h6 className="fw-bold text-secondary mb-3">
                    Income vs Expenses — Monthly
                  </h6>
                  {hasMonthly ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart
                        data={monthly}
                        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `$${v}`}
                        />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar
                          dataKey="income"
                          name="Income"
                          fill="#34d399"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar
                          dataKey="expense"
                          name="Expenses"
                          fill="#f97066"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-muted py-5 small">
                      Not enough data to display chart.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expenses by Category Pie Chart */}
            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3 p-md-4">
                  <h6 className="fw-bold text-secondary mb-3">
                    Expenses by Category
                  </h6>
                  {hasExpenses ? (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            activeIndex={activePieIndex}
                            activeShape={renderActiveShape}
                            data={categories}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            dataKey="amount"
                            nameKey="category"
                            onMouseEnter={(_, index) => setActivePieIndex(index)}
                          >
                            {categories.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Legend */}
                      <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
                        {categories.map((cat, index) => (
                          <span
                            key={cat.category}
                            className="badge rounded-pill px-2 py-1 small"
                            style={{
                              backgroundColor: PIE_COLORS[index % PIE_COLORS.length] + '22',
                              color: PIE_COLORS[index % PIE_COLORS.length],
                              border: `1px solid ${PIE_COLORS[index % PIE_COLORS.length]}55`,
                            }}
                          >
                            {cat.category} ${cat.amount.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted py-5 small">
                      No expense data to display.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Recent Transactions ─── */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-secondary mb-0">Recent Transactions</h6>
                <Link to="/transactions" className="btn btn-sm btn-outline-primary py-0 px-2">
                  View All
                </Link>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th className="py-2">Date</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Description</th>
                      <th className="py-2 text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentTransactions.map((tx) => {
                      const isIncome = tx.type === 'income';
                      return (
                        <tr key={tx._id}>
                          <td className="text-muted text-nowrap">
                            {new Date(tx.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td>
                            <span
                              className={`badge rounded-pill ${
                                isIncome
                                  ? 'bg-success-subtle text-success border border-success-subtle'
                                  : 'bg-danger-subtle text-danger border border-danger-subtle'
                              } text-uppercase px-2`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {tx.category}
                            </span>
                          </td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: 180 }}
                            title={tx.description}
                          >
                            {tx.description || (
                              <span className="text-muted fst-italic">—</span>
                            )}
                          </td>
                          <td
                            className={`text-end fw-bold ${
                              isIncome ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
