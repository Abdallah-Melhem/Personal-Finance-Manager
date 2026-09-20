import { AlertTriangle, RotateCcw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div
      className="alert alert-danger d-flex align-items-center justify-content-between my-3 py-3 px-3 small shadow-sm"
      role="alert"
    >
      <div className="d-flex align-items-center gap-2">
        <AlertTriangle size={18} className="text-danger flex-shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          className="btn btn-outline-danger btn-sm py-1 px-3 ms-2"
          onClick={onRetry}
        >
          <RotateCcw size={14} className="me-1" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
