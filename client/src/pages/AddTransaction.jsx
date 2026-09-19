import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          {error && (
            <div className="alert alert-danger py-2 small mb-3" role="alert">
              {error}
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
