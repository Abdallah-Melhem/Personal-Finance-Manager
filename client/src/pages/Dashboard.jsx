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
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Plus,
  ArrowRight,
  TrendingUp,
  Tag,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ─────────────────────────────────────────
// Summary Metric Card Component
// ─────────────────────────────────────────
const SummaryCard = ({
  title,
  value,
  prefix = '$',
  icon: Icon,
  trendLabel,
  colorVariant = 'primary',
  isHero = false,
}) => {
  const getVariantStyles = () => {
    switch (colorVariant) {
      case 'income':
        return {
          iconBg: 'rgba(16, 185, 129, 0.15)',
          iconColor: '#34D399',
          valueColor: 'text-success',
          borderHover: 'rgba(16, 185, 129, 0.4)',
        };
      case 'expense':
        return {
          iconBg: 'rgba(239, 68, 68, 0.15)',
          iconColor: '#F87171',
          valueColor: 'text-danger',
          borderHover: 'rgba(239, 68, 68, 0.4)',
        };
      case 'neutral':
        return {
          iconBg: 'rgba(139, 92, 246, 0.15)',
          iconColor: '#C084FC',
          valueColor: 'text-white',
          borderHover: 'rgba(139, 92, 246, 0.4)',
        };
      default:
        return {
          iconBg: 'rgba(139, 92, 246, 0.25)',
          iconColor: '#FFFFFF',
          valueColor: 'text-white',
          borderHover: 'rgba(139, 92, 246, 0.5)',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`metric-card ${isHero ? 'hero-balance' : ''} h-100 d-flex flex-column justify-content-between`}
    >
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div>
          <span
            className="text-muted small fw-semibold text-uppercase tracking-wider d-block mb-1"
            style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}
          >
            {title}
          </span>
          <h3 className={`fw-bold mb-0 ${styles.valueColor}`} style={{ letterSpacing: '-0.02em' }}>
            {prefix}
            {typeof value === 'number'
              ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : value}
          </h3>
        </div>
        {Icon && (
          <div
            className="metric-icon-box flex-shrink-0"
            style={{
              backgroundColor: styles.iconBg,
              color: styles.iconColor,
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {trendLabel && (
        <div className="pt-2 border-top border-purple-subtle d-flex align-items-center gap-1 small text-muted">
          <TrendingUp size={14} className="text-primary" />
          <span style={{ fontSize: '0.75rem' }}>{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// Pie Chart Active Slice Render
// ─────────────────────────────────────────
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="#FFFFFF"
        fontWeight="bold"
        fontSize={14}
      >
        {payload.category}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="#C084FC"
        fontWeight="600"
        fontSize={13}
      >
        ${Number(value).toFixed(2)}
      </text>
      <text
        x={cx}
        y={cy + 28}
        textAnchor="middle"
        fill="#94A3B8"
        fontSize={11}
      >
        ({(percent * 100).toFixed(1)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

// Color Palette for Pie Chart
const PIE_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#38BDF8', // Light Blue
  '#A855F7', // Violet
  '#F43F5E', // Rose
  '#14B8A6', // Teal
];

// Custom Tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip-dark small">
        <p className="mb-2 fw-bold text-white border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
          {label}
        </p>
        {payload.map((entry, i) => (
          <div key={i} className="d-flex align-items-center justify-content-between gap-3 mb-1">
            <span style={{ color: entry.color }} className="fw-semibold">
              {entry.name}:
            </span>
            <span className="text-white fw-bold">
              ${Number(entry.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────
// Dashboard Main Component
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
      <div className="py-5">
        <LoadingSpinner message="Loading financial overview & analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <ErrorMessage message={error} onRetry={fetchDashboard} />
      </div>
    );
  }

  const hasTransactions = summary?.transactionCount > 0;
  const hasExpenses = categories.length > 0;
  const hasMonthly = monthly.length > 0;

  return (
    <div className="dashboard-container">
      {/* Welcome Banner / Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1">
            Welcome back, <span style={{ color: 'var(--accent)' }}>{user?.name}</span>!
          </h2>
          <p className="text-muted small mb-0">
            Here is your current financial snapshot and cashflow activity.
          </p>
        </div>
        <Link to="/transactions/add" className="btn btn-primary px-3 shadow-sm align-self-start align-self-md-auto">
          <Plus size={18} />
          <span>New Transaction</span>
        </Link>
      </div>

      {!hasTransactions ? (
        /* Empty State */
        <div className="card border-0 p-5 text-center mt-3">
          <div
            className="d-inline-flex align-items-center justify-content-center p-4 rounded-circle mx-auto mb-3"
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              color: 'var(--accent)',
            }}
          >
            <Wallet size={48} />
          </div>
          <h4 className="fw-bold text-white mb-2">No Financial Records Yet</h4>
          <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: '420px' }}>
            Start building your financial overview by logging your first income or expense transaction.
          </p>
          <div>
            <Link to="/transactions/add" className="btn btn-primary px-4">
              <Plus size={18} />
              <span>Record Your First Transaction</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ─── Metric Cards ─── */}
          <div className="row g-3 mb-4">
            {/* Current Balance */}
            <div className="col-12 col-sm-6 col-xl-3">
              <SummaryCard
                title="Current Balance"
                value={summary.balance}
                colorVariant={summary.balance >= 0 ? 'default' : 'expense'}
                icon={Wallet}
                isHero={true}
                trendLabel="Net Cash Balance"
              />
            </div>

            {/* Total Income */}
            <div className="col-12 col-sm-6 col-xl-3">
              <SummaryCard
                title="Total Income"
                value={summary.totalIncome}
                colorVariant="income"
                icon={ArrowUpRight}
                trendLabel="All Time Inflow"
              />
            </div>

            {/* Total Expenses */}
            <div className="col-12 col-sm-6 col-xl-3">
              <SummaryCard
                title="Total Expenses"
                value={summary.totalExpense}
                colorVariant="expense"
                icon={ArrowDownLeft}
                trendLabel="All Time Outflow"
              />
            </div>

            {/* Total Transactions */}
            <div className="col-12 col-sm-6 col-xl-3">
              <SummaryCard
                title="Total Transactions"
                value={summary.transactionCount}
                prefix=""
                colorVariant="neutral"
                icon={Receipt}
                trendLabel="Total Logged Entries"
              />
            </div>
          </div>

          {/* ─── Charts Section ─── */}
          <div className="row g-4 mb-4">
            {/* Monthly Bar Chart */}
            <div className="col-12 col-lg-7">
              <div className="card h-100 p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold text-white mb-0">Monthly Cashflow</h5>
                    <small className="text-muted">Income vs Expenses Comparison</small>
                  </div>
                </div>

                {hasMonthly ? (
                  <ResponsiveContainer width="100%" height={270}>
                    <BarChart
                      data={monthly}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(51, 36, 90, 0.4)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: '#94A3B8' }}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(51, 36, 90, 0.6)' }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#94A3B8' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }}
                        formatter={(value) => <span className="text-muted">{value}</span>}
                      />
                      <Bar
                        dataKey="income"
                        name="Income"
                        fill="#10B981"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={36}
                      />
                      <Bar
                        dataKey="expense"
                        name="Expenses"
                        fill="#F43F5E"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={36}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted py-5 small">
                    Not enough monthly activity to display chart.
                  </div>
                )}
              </div>
            </div>

            {/* Expenses By Category Donut */}
            <div className="col-12 col-lg-5">
              <div className="card h-100 p-3 p-md-4">
                <div className="mb-3">
                  <h5 className="fw-bold text-white mb-0">Expenses by Category</h5>
                  <small className="text-muted">Breakdown of Spending Distribution</small>
                </div>

                {hasExpenses ? (
                  <>
                    <ResponsiveContainer width="100%" height={210}>
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
                              stroke="var(--bg-card)"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Category Tags */}
                    <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
                      {categories.map((cat, index) => {
                        const color = PIE_COLORS[index % PIE_COLORS.length];
                        return (
                          <span
                            key={cat.category}
                            className="badge d-inline-flex align-items-center gap-1 small"
                            style={{
                              backgroundColor: `${color}1A`,
                              color: color,
                              border: `1px solid ${color}40`,
                              fontSize: '0.72rem',
                            }}
                          >
                            <span>{cat.category}:</span>
                            <span className="fw-bold">${cat.amount.toFixed(2)}</span>
                          </span>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted py-5 small">
                    No expense data available for categorization.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Recent Transactions ─── */}
          <div className="card border-0">
            <div className="p-3 p-md-4 border-bottom border-purple-subtle d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-white mb-0">Recent Transactions</h5>
                <small className="text-muted">Latest 5 financial entries recorded</small>
              </div>
              <Link
                to="/transactions"
                className="btn btn-outline-primary btn-sm px-3"
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentTransactions.map((tx) => {
                    const isIncome = tx.type === 'income';
                    return (
                      <tr key={tx._id}>
                        <td className="text-muted text-nowrap small">
                          <span className="d-inline-flex align-items-center gap-1">
                            <Calendar size={13} className="text-muted opacity-50" />
                            {new Date(tx.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge text-uppercase ${
                              isIncome
                                ? 'bg-success-subtle text-success'
                                : 'bg-danger-subtle text-danger'
                            }`}
                            style={{
                              backgroundColor: isIncome ? 'var(--success-bg)' : 'var(--danger-bg)',
                              color: isIncome ? '#34D399' : '#F87171',
                              border: `1px solid ${isIncome ? 'var(--success-border)' : 'var(--danger-border)'}`,
                            }}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-color)',
                            }}
                          >
                            <Tag size={11} className="me-1" />
                            {tx.category}
                          </span>
                        </td>
                        <td
                          className="text-truncate text-white small"
                          style={{ maxWidth: 220 }}
                          title={tx.description}
                        >
                          {tx.description || (
                            <span className="text-muted fst-italic">No description</span>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
