import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav aria-label="Transaction pagination" className="d-flex justify-content-center">
      <ul className="pagination pagination-sm mb-0 gap-1 align-items-center">
        {/* Previous */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="btn btn-sm d-flex align-items-center justify-content-center p-2 rounded"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'var(--border-color)',
              color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) => {
          const isActive = page === currentPage;
          const isEllipsis = page === '...';

          if (isEllipsis) {
            return (
              <li key={`ellipsis-${idx}`} className="page-item disabled">
                <span className="px-2 text-muted small">...</span>
              </li>
            );
          }

          return (
            <li key={`page-${page}`} className="page-item">
              <button
                className="btn btn-sm rounded px-3 py-1 fw-semibold"
                style={{
                  background: isActive ? 'var(--primary-gradient)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(139, 92, 246, 0.4)' : 'none',
                }}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Next */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="btn btn-sm d-flex align-items-center justify-content-center p-2 rounded"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'var(--border-color)',
              color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.4 : 1,
            }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
