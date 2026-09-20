import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Layout>
                  <Transactions />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/add"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddTransaction />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditTransaction />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />


          <Route path="/" element={<Navigate to="/dashboard" replace />} />


          <Route
            path="*"
            element={
              <div className="auth-page text-center">
                <div className="auth-card">
                  <div className="display-1 fw-bold text-primary mb-2">404</div>
                  <h3 className="text-white fw-bold mb-2">Page Not Found</h3>
                  <p className="text-muted mb-4 small">
                    The requested page could not be located in your financial dashboard.
                  </p>
                  <Link to="/dashboard" className="btn btn-primary w-100">
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
