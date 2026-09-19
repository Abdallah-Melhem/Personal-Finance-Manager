import { useState, useEffect } from 'react';
import API from './services/api';

function App() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/health');
      setBackendStatus(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to connect to backend server. Make sure the server is running on port 5000.'
      );
      setBackendStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <h3 className="mb-0 fs-4 text-center">
                Personal Finance Management System
              </h3>
              <p className="text-center mb-0 small opacity-75">
                MERN Stack Foundation — Phase 1 Setup
              </p>
            </div>
            <div className="card-body p-4">
              <h5 className="card-title text-secondary mb-3">
                System Health &amp; Communication Check
              </h5>

              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Checking backend connection...</p>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  <h6 className="alert-heading fw-bold">Connection Failed</h6>
                  <p className="mb-2">{error}</p>
                  <hr />
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={checkBackendHealth}
                  >
                    Retry Connection
                  </button>
                </div>
              )}

              {backendStatus && !loading && (
                <div className="alert alert-success" role="alert">
                  <div className="d-flex align-items-center mb-2">
                    <span className="badge bg-success me-2">Connected</span>
                    <strong className="fs-6">Backend API is responding!</strong>
                  </div>
                  <ul className="list-group list-group-flush small mt-3">
                    <li className="list-group-item bg-transparent px-0 py-1">
                      <strong>Message:</strong> {backendStatus.message}
                    </li>
                    <li className="list-group-item bg-transparent px-0 py-1">
                      <strong>API Environment:</strong> {backendStatus.environment}
                    </li>
                    <li className="list-group-item bg-transparent px-0 py-1">
                      <strong>Database Status:</strong>{' '}
                      <span
                        className={`badge ${
                          backendStatus.database === 'connected'
                            ? 'bg-success'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {backendStatus.database}
                      </span>
                    </li>
                    <li className="list-group-item bg-transparent px-0 py-1">
                      <strong>Server Timestamp:</strong> {backendStatus.timestamp}
                    </li>
                  </ul>
                  <div className="mt-3">
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={checkBackendHealth}
                    >
                      Re-check Health
                    </button>
                  </div>
                </div>
              )}

              <hr className="my-4" />
              <div className="row text-center">
                <div className="col-4">
                  <div className="border rounded p-2 bg-light">
                    <div className="fw-bold">Frontend</div>
                    <small className="text-success">React + Vite</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded p-2 bg-light">
                    <div className="fw-bold">Backend</div>
                    <small className="text-success">Node.js + Express</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded p-2 bg-light">
                    <div className="fw-bold">Database</div>
                    <small className="text-muted">MongoDB Atlas</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer text-muted text-center py-2 small">
              Phase 1: Foundation Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
