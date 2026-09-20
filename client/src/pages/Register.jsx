import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, Wallet, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await register(name, email, password);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.message || 'Registration failed. Please try again.');
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
          <h3 className="fw-bold text-white mb-1">Create Account</h3>
          <p className="text-muted small">Start tracking your personal income &amp; expenses</p>
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
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="nameInput" className="form-label small">
              Full Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <User size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                id="nameInput"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label small">
              Password (min. 6 characters)
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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPasswordInput" className="form-label small">
              Confirm Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <ShieldCheck size={16} />
              </span>
              <input
                type="password"
                className="form-control"
                id="confirmPasswordInput"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                autoComplete="new-password"
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
                <span>Registering Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-purple-subtle small text-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="fw-semibold text-decoration-none"
            style={{ color: 'var(--accent)' }}
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
