import { Link, useLocation } from 'react-router-dom';
import { Menu, Plus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Determine page title based on current pathname
  const getPageDetails = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) {
      return { title: 'Financial Overview', badge: 'Overview' };
    }
    if (path.startsWith('/transactions/add')) {
      return { title: 'New Transaction', badge: 'Create' };
    }
    if (path.startsWith('/transactions/edit')) {
      return { title: 'Edit Transaction', badge: 'Modify' };
    }
    if (path.startsWith('/transactions')) {
      return { title: 'Transaction Records', badge: 'Ledger' };
    }
    if (path.startsWith('/profile')) {
      return { title: 'Account Settings', badge: 'Preferences' };
    }
    return { title: 'Personal Finance', badge: 'App' };
  };

  const { title, badge } = getPageDetails();
  const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
  const avatarSrc = user?.profilePicture ? `${baseURL}${user.profilePicture}` : null;

  return (
    <header className="app-topbar">
      <div className="d-flex align-items-center gap-3">
        {/* Mobile menu hamburger toggle */}
        <button
          type="button"
          className="topbar-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Page Title & Context */}
        <div className="d-flex align-items-center gap-2">
          <h1 className="h5 mb-0 fw-bold text-white tracking-tight">{title}</h1>
          <span
            className="badge d-none d-sm-inline-block"
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--accent)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              fontSize: '0.7rem',
            }}
          >
            {badge}
          </span>
        </div>
      </div>

      {/* Topbar Right Controls */}
      <div className="d-flex align-items-center gap-3">
        {/* Quick Add Transaction Button */}
        <Link
          to="/transactions/add"
          className="btn btn-primary btn-sm px-3 shadow-sm d-none d-md-inline-flex"
        >
          <Plus size={16} />
          <span>Add Transaction</span>
        </Link>

        {/* Profile Avatar Pill */}
        <Link
          to="/profile"
          className="d-flex align-items-center gap-2 text-decoration-none px-2 py-1 rounded-pill"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.2s ease',
          }}
          title="Go to profile"
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={user?.name || 'User'}
              className="rounded-circle border"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'cover',
                borderColor: 'var(--accent)',
              }}
            />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(139, 92, 246, 0.3)',
                color: 'var(--accent)',
                fontSize: '0.85rem',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || <User size={16} />}
            </div>
          )}
          <span className="text-white small fw-semibold d-none d-sm-inline pe-1">
            {user?.name?.split(' ')[0] || 'Account'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
