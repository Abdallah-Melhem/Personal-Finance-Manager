import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import API from '../services/api';
import TransactionForm from '../components/TransactionForm';

const AddTransaction = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await API.post('/transactions', formData);
      if (response.data.success) {
        navigate('/transactions');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to create transaction. Please check your inputs.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-transaction-container">
      {/* Top back navigation */}
      <div className="mb-4">
        <Link
          to="/transactions"
          className="d-inline-flex align-items-center gap-2 text-decoration-none text-muted small hover-accent"
          style={{ transition: 'color 0.2s ease' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Transactions</span>
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          {error && (
            <div className="alert alert-danger py-2 px-3 small mb-4 d-flex align-items-center gap-2" role="alert">
              <AlertCircle size={16} className="text-danger flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <TransactionForm
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
            isEdit={false}
            onCancel={() => navigate('/transactions')}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
