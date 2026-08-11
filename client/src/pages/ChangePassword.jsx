import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function ChangePassword() {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !currentPassword || !newPassword || !confirmPassword) {
      return setError('All fields are required');
    }
    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters');
    }
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    try {
      await api.post('/auth/change-password', { username, currentPassword, newPassword });
      setSuccess('Password updated successfully. Redirecting to login...');
      localStorage.removeItem('token');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-avatar">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="white" strokeWidth="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <h1 className="login-title">Change Password</h1>

        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}

        <div className="login-field">
          <label>Username</label>
          <div className="login-input-wrap">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="login-field">
          <label>Current Password</label>
          <div className="login-input-wrap">
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="login-field">
          <label>New Password</label>
          <div className="login-input-wrap">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="login-field">
          <label>Confirm New Password</label>
          <div className="login-input-wrap">
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="login-button">Update Password</button>

        <p style={{ marginTop: '16px', fontSize: '0.85rem' }}>
          <Link to="/login" className="login-forgot-link">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ChangePassword;