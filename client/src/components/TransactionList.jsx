import { Link } from 'react-router-dom';

const TransactionList = ({ transactions = [], onEdit, onDelete, isDeletingId = null }) => {
  if (!transactions.length) {
    return (
      <div className="card border-0 shadow-sm p-5 text-center my-3">
        <div className="text-muted mb-3">
          <i className="bi bi-inbox fs-1"></i>
        </div>
        <h5 className="fw-bold text-secondary">No transactions recorded yet</h5>
        <p className="text-muted small mb-3">
          Start recording your income and expenses to see your balance and financial reports.
        </p>
        <div>
          <Link to="/transactions/add" className="btn btn-primary btn-sm">
            Add Your First Transaction
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm overflow-hidden my-3">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" className="py-3 px-3">Date</th>
              <th scope="col" className="py-3">Type</th>
              <th scope="col" className="py-3">Category</th>
              <th scope="col" className="py-3">Description</th>
              <th scope="col" className="py-3 text-end">Amount</th>
              <th scope="col" className="py-3 text-center" style={{ width: '140px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const formattedDate = new Date(tx.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <tr key={tx._id}>
                  <td className="px-3 text-nowrap small text-muted">
                    {formattedDate}
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        isIncome ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'
                      } text-uppercase px-2`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {tx.category}
                    </span>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '220px' }} title={tx.description}>
                    {tx.description || <span className="text-muted fst-italic">No description</span>}
                  </td>
                  <td className={`text-end fw-bold ${isIncome ? 'text-success' : 'text-danger'}`}>
                    {isIncome ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                  </td>
                  <td className="text-center text-nowrap">
                    <Link
                      to={`/transactions/edit/${tx._id}`}
                      className="btn btn-outline-primary btn-sm py-0 px-2 me-1"
                      title="Edit"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm py-0 px-2"
                      onClick={() => onDelete(tx._id)}
                      disabled={isDeletingId === tx._id}
                      title="Delete"
                    >
                      {isDeletingId === tx._id ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
