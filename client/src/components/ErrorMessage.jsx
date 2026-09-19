const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between my-3 py-2 px-3 small" role="alert">
      <div>
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button className="btn btn-outline-danger btn-sm py-0 px-2" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
