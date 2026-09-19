import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h2 className="fw-bold mb-1">Welcome back, {user?.name}!</h2>
              <p className="text-muted mb-0">
                You are securely logged into your Personal Finance Dashboard.
              </p>
            </div>
            <span className="badge bg-success-subtle text-success fs-6 px-3 py-2 mt-2 mt-sm-0 border border-success-subtle">
              Authenticated Session
            </span>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold text-primary">Your Account Information</h5>
              <hr />
              <p className="mb-2">
                <strong>Name:</strong> {user?.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="mb-0">
                <strong>User ID:</strong> <code className="small">{user?._id}</code>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold text-success">Authentication Status</h5>
              <hr />
              <p className="text-muted small mb-2">
                Token is safely stored in local storage and managed via React Context API.
                Protected routes guard this page from unauthenticated visitors.
              </p>
              <div className="alert alert-info py-2 px-3 small mb-0">
                Ready for Phase 6 (Transaction Frontend) &amp; Phase 7 (Financial Dashboard &amp; Analytics).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
