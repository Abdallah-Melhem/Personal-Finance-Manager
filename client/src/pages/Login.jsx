import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Wallet, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please provide both your email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-3 mb-3 sidebar-logo-icon mx-auto">
            <Wallet size={26} />
          </div>
          <h3 className="fw-bold text-white mb-1">Welcome Back</h3>
          <p className="text-muted small">Sign in to access your financial dashboard</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="alert alert-danger py-2 px-3 small mb-4 d-flex align-items-center gap-2"
            role="alert"
          >
            <AlertCircle size={16} className="text-danger flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label small">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="passwordInput" className="form-label small">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Lock size={16} />
              </span>
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                  style={{ animation: 'spin 1s linear infinite' }}
                />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-purple-subtle small text-muted">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="fw-semibold text-decoration-none"
            style={{ color: 'var(--accent)' }}
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
