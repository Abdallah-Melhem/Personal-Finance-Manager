import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
  const avatarSrc = user?.profilePicture ? `${baseURL}${user.profilePicture}` : null;

  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold text-white d-flex align-items-center gap-2" to={isAuthenticated ? '/dashboard' : '/login'}>
          <div className="sidebar-logo-icon" style={{ width: '32px', height: '32px' }}>
            <Wallet size={18} />
          </div>
          <span>FinanceFlow</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active fw-semibold text-white' : 'text-muted'}`
                    }
                    to="/dashboard"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active fw-semibold text-white' : 'text-muted'}`
                    }
                    to="/transactions"
                  >
                    Transactions
                  </NavLink>
                </li>
              </ul>
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/profile"
                  className="d-flex align-items-center text-decoration-none text-white me-2 px-2 py-1 rounded"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)' }}
                  title="View Profile"
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={user?.name}
                      className="rounded-circle me-2 border border-purple"
                      style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center me-2 small"
                      style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="small fw-semibold">{user?.name}</span>
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                >
                  <LogOut size={14} className="me-1" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-2">
              <li className="nav-item">
                <NavLink
                  className="btn btn-outline-secondary btn-sm"
                  to="/login"
                >
                  Sign In
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="btn btn-primary btn-sm"
                  to="/register"
                >
                  Get Started
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
