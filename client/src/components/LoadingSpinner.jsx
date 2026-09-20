import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="text-center py-5">
      <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-2"
        style={{
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
        }}
      >
        <Loader2
          size={32}
          className="text-primary"
          style={{ animation: 'spin 1s linear infinite' }}
        />
      </div>
      <p className="mt-2 text-muted small mb-0">{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
