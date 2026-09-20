import { useState, useRef } from 'react';
import {
  User,
  Mail,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Loader2,
  Calendar,
  Fingerprint,
} from 'lucide-react';
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
          message: 'Profile information successfully updated!',
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
          message: 'Password successfully changed!',
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

  // Handle avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAvatarFeedback({
        type: 'danger',
        message: 'Selected image exceeds the 5MB maximum file limit.',
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
          message: 'Profile photo uploaded successfully!',
        });
      }
    } catch (err) {
      setAvatarFeedback({
        type: 'danger',
        message:
          err.response?.data?.message || 'Failed to upload profile photo.',
      });
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
  const avatarSrc = user?.profilePicture ? `${baseURL}${user.profilePicture}` : null;

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-white mb-1">Account &amp; Security</h2>
        <p className="text-muted small mb-0">
          Manage your personal profile credentials, picture, and security password.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Column: Avatar Card & Account Meta */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 text-center p-4 p-md-5">
            {/* Avatar Section */}
            <div className="position-relative d-inline-block mx-auto mb-3">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name}
                  className="rounded-circle object-fit-cover shadow-lg border"
                  style={{
                    width: '128px',
                    height: '128px',
                    borderColor: 'var(--primary)',
                  }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-lg fw-bold"
                  style={{
                    width: '128px',
                    height: '128px',
                    fontSize: '2.75rem',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(168, 85, 247, 0.2) 100%)',
                    color: 'var(--accent)',
                    border: '2px solid rgba(139, 92, 246, 0.4)',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              {/* Uploading Spinner Overlay */}
              {avatarLoading && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: 'rgba(15, 7, 42, 0.75)',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  <Loader2
                    size={28}
                    className="text-primary animate-spin"
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                </div>
              )}
            </div>

            <h5 className="fw-bold text-white mb-1">{user?.name}</h5>
            <p className="text-muted small mb-3">{user?.email}</p>

            {avatarFeedback.message && (
              <div
                className={`alert alert-${avatarFeedback.type} py-1 px-2 small mb-3 d-flex align-items-center justify-content-center gap-1`}
                role="alert"
              >
                {avatarFeedback.type === 'success' ? (
                  <CheckCircle2 size={14} className="text-success" />
                ) : (
                  <AlertCircle size={14} className="text-danger" />
                )}
                <span>{avatarFeedback.message}</span>
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
                <Camera size={14} />
                <span>{avatarLoading ? 'Uploading...' : 'Change Photo'}</span>
              </button>
            </div>
            <small className="text-muted d-block mt-2" style={{ fontSize: '0.72rem' }}>
              Supported: PNG, JPG, WebP (Max 5MB)
            </small>

            <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

            <div className="text-start small text-muted d-flex flex-column gap-2">
              <div className="d-flex align-items-center justify-content-between">
                <span className="d-flex align-items-center gap-1">
                  <Fingerprint size={14} className="text-primary" />
                  <strong>User ID:</strong>
                </span>
                <code className="text-truncate ms-2" style={{ maxWidth: 140, color: 'var(--accent)' }}>
                  {user?._id}
                </code>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-primary" />
                  <strong>Member Since:</strong>
                </span>
                <span>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Details & Password */}
        <div className="col-12 col-lg-8">
          {/* Card 1: Edit Profile Details */}
          <div className="card border-0 p-4 p-md-4 mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <User size={18} className="text-primary" />
              <h5 className="fw-bold text-white mb-0">Personal Information</h5>
            </div>

            {profileFeedback.message && (
              <div
                className={`alert alert-${profileFeedback.type} py-2 px-3 small mb-3 d-flex align-items-center gap-2`}
                role="alert"
              >
                {profileFeedback.type === 'success' ? (
                  <CheckCircle2 size={16} className="text-success" />
                ) : (
                  <AlertCircle size={16} className="text-danger" />
                )}
                <span>{profileFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <User size={15} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={15} />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-4 fw-semibold"
                  disabled={profileLoading}
                >
                  {profileLoading ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin me-2"
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Change Password */}
          <div className="card border-0 p-4 p-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <KeyRound size={18} className="text-primary" />
              <h5 className="fw-bold text-white mb-0">Security &amp; Password</h5>
            </div>

            {passwordFeedback.message && (
              <div
                className={`alert alert-${passwordFeedback.type} py-2 px-3 small mb-3 d-flex align-items-center gap-2`}
                role="alert"
              >
                {passwordFeedback.type === 'success' ? (
                  <CheckCircle2 size={16} className="text-success" />
                ) : (
                  <AlertCircle size={16} className="text-danger" />
                )}
                <span>{passwordFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label small">Current Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock size={15} />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter existing password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label small">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size={15} />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min. 6 characters"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      minLength="6"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <ShieldCheck size={15} />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Repeat new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      minLength="6"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-4 fw-semibold"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin me-2"
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                      Updating Password...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
