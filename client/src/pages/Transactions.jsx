import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import TransactionList from '../components/TransactionList';
import TransactionFilters from '../components/TransactionFilters';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';

const DEFAULT_FILTERS = {
  search: '',
  type: '',
  category: '',
  startDate: '',
  endDate: '',
};
const PAGE_LIMIT = 10;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce timer for search input
  const searchTimer = useRef(null);

  const fetchTransactions = useCallback(async (activeFilters, page) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeFilters.search) params.append('search', activeFilters.search);
      if (activeFilters.type) params.append('type', activeFilters.type);
      if (activeFilters.category) params.append('category', activeFilters.category);
      if (activeFilters.startDate) params.append('startDate', activeFilters.startDate);
      if (activeFilters.endDate) params.append('endDate', activeFilters.endDate);
      params.append('page', page);
      params.append('limit', PAGE_LIMIT);

      const response = await API.get(`/transactions?${params.toString()}`);
      if (response.data.success) {
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || 0);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load transactions. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on filters or page change (debounce search)
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchTransactions(filters, currentPage);
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [filters, currentPage, fetchTransactions]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInitiateDelete = (id) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    setIsDeletingId(deleteTargetId);
    try {
      const response = await API.delete(`/transactions/${deleteTargetId}`);
      if (response.data.success) {
        setFeedback({ type: 'success', message: 'Transaction deleted successfully.' });
        setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
        setDeleteTargetId(null);
        fetchTransactions(filters, currentPage);
      }
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to delete transaction.',
      });
      setDeleteTargetId(null);
    } finally {
      setIsDeletingId(null);
    }
  };

  const isFiltered = Object.values(filters).some((v) => v !== '');

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-primary">Transactions</h2>
          <p className="text-muted mb-0 small">
            {isFiltered
              ? `Showing ${totalCount} result${totalCount !== 1 ? 's' : ''} for active filters.`
              : `You have ${totalCount} transaction${totalCount !== 1 ? 's' : ''} total.`}
          </p>
        </div>
        <Link to="/transactions/add" className="btn btn-primary px-3 shadow-sm">
          + Add Transaction
        </Link>
      </div>

      {/* Feedback */}
      {feedback.message && (
        <div
          className={`alert alert-${feedback.type} alert-dismissible fade show py-2 small mb-3`}
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

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching your transactions..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => fetchTransactions(filters, currentPage)}
        />
      ) : transactions.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center mt-2">
          <div className="text-muted mb-3 fs-1">🔍</div>
          <h5 className="fw-bold text-secondary">
            {isFiltered ? 'No transactions match your filters' : 'No transactions yet'}
          </h5>
          <p className="text-muted small mb-3">
            {isFiltered
              ? 'Try adjusting the search terms or clearing the filters.'
              : 'Add your first income or expense to get started.'}
          </p>
          <div className="d-flex justify-content-center gap-2">
            {isFiltered && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            )}
            <Link to="/transactions/add" className="btn btn-primary btn-sm">
              Add Transaction
            </Link>
          </div>
        </div>
      ) : (
        <>
          <TransactionList
            transactions={transactions}
            onDelete={handleInitiateDelete}
            isDeletingId={isDeletingId}
          />
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-2 gap-2">
            <p className="text-muted small mb-0">
              Page {currentPage} of {totalPages} &nbsp;·&nbsp; {totalCount} total record{totalCount !== 1 ? 's' : ''}
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmModal
        show={!!deleteTargetId}
        title="Delete Transaction"
        message="Are you sure you want to permanently delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isProcessing={!!isDeletingId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default Transactions;
