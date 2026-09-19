import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import TransactionList from '../components/TransactionList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isDeletingId, setIsDeletingId] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/transactions');
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load transactions. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setIsDeletingId(id);
    try {
      const response = await API.delete(`/transactions/${id}`);
      if (response.data.success) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        setFeedback({
          type: 'success',
          message: 'Transaction deleted successfully.',
        });
        setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      }
    } catch (err) {
      setFeedback({
        type: 'danger',
        message:
          err.response?.data?.message || 'Failed to delete transaction.',
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  // Calculate quick totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-primary">Transactions</h2>
          <p className="text-muted mb-0 small">
            Review and manage all your income and expense records.
          </p>
        </div>
        <Link to="/transactions/add" className="btn btn-primary px-3 shadow-sm">
          + Add Transaction
        </Link>
      </div>

      {feedback.message && (
        <div
          className={`alert alert-${feedback.type} alert-dismissible fade show py-2 small`}
          role="alert"
        >
          {feedback.message}
          <button
            type="button"
            className="btn-close py-2"
            onClick={() => setFeedback({ type: '', message: '' })}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Quick metrics bar */}
      <div className="row g-3 mb-3">
        <div className="col-sm-4">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <div className="text-muted small">Total Income</div>
            <div className="fs-5 fw-bold text-success">+${totalIncome.toFixed(2)}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <div className="text-muted small">Total Expenses</div>
            <div className="fs-5 fw-bold text-danger">-${totalExpense.toFixed(2)}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <div className="text-muted small">Current Balance</div>
            <div className={`fs-5 fw-bold ${balance >= 0 ? 'text-primary' : 'text-danger'}`}>
              ${balance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching your transactions..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchTransactions} />
      ) : (
        <TransactionList
          transactions={transactions}
          onDelete={handleDelete}
          isDeletingId={isDeletingId}
        />
      )}
    </div>
  );
};

export default Transactions;
