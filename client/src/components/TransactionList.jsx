import { Link } from 'react-router-dom';
import {
  Calendar,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  Utensils,
  Briefcase,
  Car,
  ShoppingBag,
  Film,
  GraduationCap,
  HeartPulse,
  Receipt,
  Gift,
  CircleDollarSign,
} from 'lucide-react';

// Helper to select an appropriate Lucide icon for categories
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'salary':
    case 'freelance':
      return Briefcase;
    case 'gift':
      return Gift;
    case 'food':
      return Utensils;
    case 'transportation':
      return Car;
    case 'shopping':
      return ShoppingBag;
    case 'bills':
      return Receipt;
    case 'entertainment':
      return Film;
    case 'education':
      return GraduationCap;
    case 'health':
      return HeartPulse;
    default:
      return CircleDollarSign;
  }
};

const TransactionList = ({ transactions = [], onDelete, isDeletingId = null }) => {
  if (!transactions.length) {
    return (
      <div className="card p-5 text-center my-3 border-0">
        <div
          className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mx-auto mb-3"
          style={{
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            color: 'var(--accent)',
          }}
        >
          <Receipt size={36} />
        </div>
        <h5 className="fw-bold text-white mb-1">No Transactions Found</h5>
        <p className="text-muted small mb-4">
          No records match your selected criteria or ledger history.
        </p>
        <div>
          <Link to="/transactions/add" className="btn btn-primary btn-sm px-4 shadow-sm">
            Record New Transaction
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ─── Desktop Table View (>= md breakpoint) ─── */}
      <div className="card border-0 overflow-hidden d-none d-md-block mb-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col" className="py-3 px-3">Date</th>
                <th scope="col" className="py-3">Type</th>
                <th scope="col" className="py-3">Category</th>
                <th scope="col" className="py-3">Description</th>
                <th scope="col" className="py-3 text-end">Amount</th>
                <th scope="col" className="py-3 text-center" style={{ width: '160px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const CategoryIcon = getCategoryIcon(tx.category);
                const formattedDate = new Date(tx.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <tr key={tx._id}>
                    <td className="px-3 text-nowrap small text-muted">
                      <span className="d-inline-flex align-items-center gap-1">
                        <Calendar size={13} className="text-muted opacity-60" />
                        {formattedDate}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge d-inline-flex align-items-center gap-1 text-uppercase"
                        style={{
                          backgroundColor: isIncome ? 'var(--success-bg)' : 'var(--danger-bg)',
                          color: isIncome ? '#34D399' : '#F87171',
                          border: `1px solid ${isIncome ? 'var(--success-border)' : 'var(--danger-border)'}`,
                          fontSize: '0.75rem',
                        }}
                      >
                        {isIncome ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                        {tx.type}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge d-inline-flex align-items-center gap-1"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <CategoryIcon size={12} className="text-primary" />
                        {tx.category}
                      </span>
                    </td>
                    <td
                      className="text-truncate text-white small"
                      style={{ maxWidth: '240px' }}
                      title={tx.description}
                    >
                      {tx.description || <span className="text-muted fst-italic">No description</span>}
                    </td>
                    <td
                      className={`text-end fw-bold ${
                        isIncome ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </td>
                    <td className="text-center text-nowrap">
                      <Link
                        to={`/transactions/edit/${tx._id}`}
                        className="btn btn-outline-primary btn-sm py-1 px-2 me-2"
                        title="Edit Transaction"
                      >
                        <Pencil size={13} />
                        <span>Edit</span>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm py-1 px-2"
                        onClick={() => onDelete(tx._id)}
                        disabled={isDeletingId === tx._id}
                        title="Delete Transaction"
                      >
                        {isDeletingId === tx._id ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                            style={{ animation: 'spin 1s linear infinite' }}
                          />
                        ) : (
                          <>
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Mobile Transaction Cards (< md breakpoint) ─── */}
      <div className="d-block d-md-none mb-3">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';
          const CategoryIcon = getCategoryIcon(tx.category);
          const formattedDate = new Date(tx.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={tx._id} className="mobile-transaction-card">
              {/* Card Header: Type, Category, and Amount */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: isIncome ? 'var(--success-bg)' : 'var(--danger-bg)',
                      color: isIncome ? '#34D399' : '#F87171',
                    }}
                  >
                    <CategoryIcon size={16} />
                  </div>
                  <div>
                    <span className="fw-semibold text-white d-block small">
                      {tx.category}
                    </span>
                    <span
                      className="badge p-0 text-uppercase"
                      style={{
                        color: isIncome ? '#34D399' : '#F87171',
                        fontSize: '0.68rem',
                      }}
                    >
                      {tx.type}
                    </span>
                  </div>
                </div>

                <div
                  className={`fw-bold fs-6 ${
                    isIncome ? 'text-success' : 'text-danger'
                  }`}
                >
                  {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                </div>
              </div>

              {/* Description & Date */}
              {tx.description && (
                <p className="text-muted small mb-0 ps-1" style={{ fontSize: '0.82rem' }}>
                  {tx.description}
                </p>
              )}

              <div className="d-flex align-items-center justify-content-between pt-2 border-top border-purple-subtle mt-1">
                <span className="text-muted small d-flex align-items-center gap-1">
                  <Calendar size={12} />
                  {formattedDate}
                </span>

                <div className="d-flex gap-2">
                  <Link
                    to={`/transactions/edit/${tx._id}`}
                    className="btn btn-outline-primary btn-sm py-1 px-2"
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm py-1 px-2"
                    onClick={() => onDelete(tx._id)}
                    disabled={isDeletingId === tx._id}
                  >
                    {isDeletingId === tx._id ? (
                      <Loader2
                        size={13}
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                    ) : (
                      <>
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TransactionList;
