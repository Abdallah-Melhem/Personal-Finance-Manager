import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PlusCircle,
  User,
  LogOut,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate('/login');
  };

  const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
  const avatarSrc = user?.profilePicture ? `${baseURL}${user.profilePicture}` : null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'show' : ''}`}>
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-purple">
          <Link
            to="/dashboard"
            className="d-flex align-items-center gap-2 text-decoration-none"
            onClick={onClose}
          >
            <div className="sidebar-logo-icon">
              <Wallet size={22} />
            </div>
            <div>
              <div className="sidebar-brand-title">FinanceFlow</div>
              <div className="sidebar-brand-subtitle">Personal Manager</div>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            className="btn btn-link text-muted p-1 d-lg-none"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="sidebar-nav">
          <div className="sidebar-section-title">Navigation</div>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <span className="sidebar-icon">
              <LayoutDashboard size={19} />
            </span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/transactions"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <span className="sidebar-icon">
              <ArrowLeftRight size={19} />
            </span>
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/transactions/add"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <span className="sidebar-icon">
              <PlusCircle size={19} />
            </span>
            <span>Add Transaction</span>
          </NavLink>

          <div className="sidebar-section-title mt-3">Account</div>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <span className="sidebar-icon">
              <User size={19} />
            </span>
            <span>My Profile</span>
          </NavLink>
        </div>

        {/* User Mini Card & Logout Footer */}
        <div className="sidebar-footer">
          <Link
            to="/profile"
            className="sidebar-user-card"
            onClick={onClose}
            title="View profile settings"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.name || 'User'}
                className="rounded-circle border"
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'cover',
                  borderColor: 'var(--border-color)',
                }}
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'rgba(139, 92, 246, 0.25)',
                  color: 'var(--accent)',
                  fontSize: '0.9rem',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="overflow-hidden flex-grow-1">
              <div className="text-white small fw-semibold text-truncate">
                {user?.name || 'User'}
              </div>
              <div
                className="small text-truncate"
                style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}
              >
                {user?.email || 'finance@app.com'}
              </div>
            </div>
          </Link>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign out of your account"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
