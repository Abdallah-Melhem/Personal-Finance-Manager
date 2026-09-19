import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import TransactionForm from '../components/TransactionForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const response = await API.get(`/transactions/${id}`);
        if (response.data.success) {
          setTransaction(response.data.transaction);
        }
      } catch (err) {
        setFetchError(
          err.response?.data?.message ||
            'Failed to load transaction. It may not exist or you may not have permission to view it.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await API.put(`/transactions/${id}`, formData);
      if (response.data.success) {
        navigate('/transactions');
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Failed to update transaction.'
      );
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingSpinner message="Loading transaction details..." />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <ErrorMessage message={fetchError} />
            <div className="text-center mt-3">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate('/transactions')}
              >
                Back to Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          {submitError && (
            <div className="alert alert-danger py-2 small mb-3" role="alert">
              {submitError}
            </div>
          )}
          <TransactionForm
            initialData={transaction}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            isEdit={true}
            onCancel={() => navigate('/transactions')}
          />
        </div>
      </div>
    </div>
  );
};

export default EditTransaction;
