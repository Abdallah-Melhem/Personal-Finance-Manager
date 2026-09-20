import { AlertCircle, Loader2, X } from 'lucide-react';

const ConfirmModal = ({
  show,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(11, 4, 32, 0.75)',
        backdropFilter: 'blur(6px)',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border border-purple shadow-lg"
          style={{
            backgroundColor: 'var(--bg-card)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.15)',
          }}
        >
          <div className="modal-header border-0 pb-0 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--danger)',
                }}
              >
                <AlertCircle size={20} />
              </div>
              <h5 className="modal-title fw-bold text-white mb-0">{title}</h5>
            </div>
            <button
              type="button"
              className="btn btn-link text-muted p-1"
              aria-label="Close"
              onClick={onCancel}
              disabled={isProcessing}
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-body py-3">
            <p className="mb-0 text-muted small">{message}</p>
          </div>

          <div className="modal-footer border-0 pt-0 gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-3"
              onClick={onCancel}
              disabled={isProcessing}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`btn btn-${confirmVariant} btn-sm px-4 fw-semibold`}
              onClick={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2
                    size={16}
                    className="me-1"
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
