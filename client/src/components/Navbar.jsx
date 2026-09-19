import { Link, useNavigate, NavLink } from 'react-router-dom';
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={isAuthenticated ? '/dashboard' : '/login'}>
          <i className="bi bi-wallet2 me-2"></i>Personal Finance
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'nav-link active fw-semibold' : 'nav-link'
                    }
                    to="/dashboard"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'nav-link active fw-semibold' : 'nav-link'
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
                  className="d-flex align-items-center text-decoration-none text-white me-2 px-2 py-1 rounded bg-white bg-opacity-10 hover-opacity"
                  title="View Profile"
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={user?.name}
                      className="rounded-circle me-2 border border-white"
                      style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center me-2 small"
                      style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="small fw-semibold">{user?.name}</span>
                </Link>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-link active fw-semibold' : 'nav-link'
                  }
                  to="/login"
                >
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-link active fw-semibold' : 'nav-link'
                  }
                  to="/register"
                >
                  Register
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
