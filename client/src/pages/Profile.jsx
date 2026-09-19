import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Profile = () => {
  const { user, setUser } = useAuth();

  // Profile info form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState({ type: '', message: '' });

  // Password change form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ type: '', message: '' });

  // Avatar upload state
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState({ type: '', message: '' });
  const fileInputRef = useRef(null);

  // Handle profile info update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileFeedback({ type: '', message: '' });

    try {
      const response = await API.put('/users/profile', profileData);
      if (response.data.success) {
        setUser(response.data.user);
        setProfileFeedback({
          type: 'success',
          message: 'Profile information updated successfully!',
        });
      }
    } catch (err) {
      setProfileFeedback({
        type: 'danger',
        message:
          err.response?.data?.message || 'Failed to update profile information.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword.length < 6) {
      setPasswordFeedback({
        type: 'danger',
        message: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'danger',
        message: 'New passwords do not match.',
      });
      return;
    }

    setPasswordLoading(true);
    setPasswordFeedback({ type: '', message: '' });

    try {
      const response = await API.put('/users/password', {
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        setPasswordFeedback({
          type: 'success',
          message: 'Password changed successfully!',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setPasswordFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to change password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle profile picture file selection and upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (<= 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarFeedback({
        type: 'danger',
        message: 'Selected image exceeds the 5MB maximum file size.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    setAvatarLoading(true);
    setAvatarFeedback({ type: '', message: '' });

    try {
      const response = await API.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          profilePicture: response.data.profilePicture,
        }));
        setAvatarFeedback({
          type: 'success',
          message: 'Profile picture uploaded successfully!',
        });
      }
    } catch (err) {
      setAvatarFeedback({
        type: 'danger',
        message:
          err.response?.data?.message || 'Failed to upload profile picture.',
      });
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Base backend URL for profile pictures
  const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
  const avatarSrc = user?.profilePicture ? `${baseURL}${user.profilePicture}` : null;

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-primary mb-1">User Profile</h2>
        <p className="text-muted small mb-0">
          Manage your account information, profile avatar, and security settings.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Column: Avatar & Overview */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm text-center p-4">
            <div className="position-relative d-inline-block mx-auto mb-3">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name}
                  className="rounded-circle object-fit-cover shadow-sm border"
                  style={{ width: '130px', height: '130px' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mx-auto shadow-sm"
                  style={{ width: '130px', height: '130px', fontSize: '3rem' }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              {avatarLoading && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.75)' }}
                >
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              )}
            </div>

            <h5 className="fw-bold mb-1">{user?.name}</h5>
            <p className="text-muted small mb-3">{user?.email}</p>

            {avatarFeedback.message && (
              <div className={`alert alert-${avatarFeedback.type} py-1 small mb-3`} role="alert">
                {avatarFeedback.message}
              </div>
            )}

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="d-none"
                id="avatarInput"
              />
              <button
                type="button"
                className="btn btn-outline-primary btn-sm px-3"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
              >
                {avatarLoading ? 'Uploading...' : 'Change Picture'}
              </button>
            </div>
            <small className="text-muted d-block mt-2">
              JPG, PNG, or WebP. Max 5MB.
            </small>

            <hr className="my-4" />
            <div className="text-start small text-muted">
              <p className="mb-1">
                <strong>User ID:</strong> <code className="text-break">{user?._id}</code>
              </p>
              <p className="mb-0">
                <strong>Member Since:</strong>{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Change Password */}
        <div className="col-12 col-lg-8">
          {/* Edit Profile Information */}
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h5 className="fw-bold text-secondary mb-3">Edit Profile Information</h5>

            {profileFeedback.message && (
              <div className={`alert alert-${profileFeedback.type} py-2 small mb-3`} role="alert">
                {profileFeedback.message}
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm px-4 fw-semibold"
                disabled={profileLoading}
              >
                {profileLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold text-secondary mb-3">Change Password</h5>

            {passwordFeedback.message && (
              <div className={`alert alert-${passwordFeedback.type} py-2 small mb-3`} role="alert">
                {passwordFeedback.message}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                    minLength="6"
                    autoComplete="new-password"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    required
                    minLength="6"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm px-4 fw-semibold"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
