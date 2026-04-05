import React, { useState, useEffect } from 'react';
import { getUserData, changePassword } from '../../../services/profileService';

const AccountSettings = ({ userId }) => {
  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
  const [email, setEmail] = useState('');
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [emailError, setEmailError] = useState(null);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState('');

  useEffect(() => {
    const fetchEmail = async () => {
      if (!userId) {
        setEmailError("User ID not provided.");
        setLoadingEmail(false);
        return;
      }

      try {
        setLoadingEmail(true);
        setEmailError(null);
        const userData = await getUserData(userId);
        setEmail(userData.email);
      } catch (err) {
        console.error("Error fetching user email:", err);
        setEmailError("Failed to load email address.");
        setEmail('');
      } finally {
        setLoadingEmail(false);
      }
    };

    fetchEmail();
  }, [userId]);

  const validateNewPassword = (password) => {
    if (password.length < 8) return "Must be at least 8 characters.";
    if (!/[a-zA-Z]/.test(password)) return "Include at least one letter.";
    if (!/\d/.test(password)) return "Include at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) return "Include one special character.";
    return "";
  };

  const togglePasswordForm = () => {
    setShowPasswordChangeForm(prev => !prev);
    if (showPasswordChangeForm) {
      setPasswordFields({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setPasswordChangeError(null);
      setNewPasswordError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      setNewPasswordError(validateNewPassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setNewPasswordError('');

    const { oldPassword, newPassword, confirmNewPassword } = passwordFields;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordChangeError("All fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("New passwords do not match.");
      return;
    }

    const validationMessage = validateNewPassword(newPassword);
    if (validationMessage) {
      setNewPasswordError(validationMessage);
      return;
    }

    setPasswordChangeLoading(true);

    try {
      await changePassword(userId, oldPassword, newPassword);
      alert("Password updated successfully!");
      setPasswordFields({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowPasswordChangeForm(false);
    } catch (err) {
      console.error("Failed to change password:", err);
      if (err.response?.status === 400 && err.response.data === "Old password mismatch") {
        setPasswordChangeError("Incorrect old password.");
      } else {
        setPasswordChangeError("Password update failed. Please try again.");
      }
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  return (
    <div className="px-4 py-5">
      <h2 className="text-white fw-bold mb-4">Account Settings</h2>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="form-label text-white">Email Address</label>
        {loadingEmail ? (
          <p className="text-secondary">Loading...</p>
        ) : emailError ? (
          <p className="text-danger">{emailError}</p>
        ) : (
          <input
            type="email"
            id="email"
            className="form-control bg-dark text-white border-secondary rounded-3"
            value={email}
            readOnly
          />
        )}
      </div>

      {/* Toggle Button */}
      <div className="mb-4">
        <button
          className="btn btn-outline-light rounded-pill fw-bold px-4 py-2"
          onClick={togglePasswordForm}
          disabled={passwordChangeLoading}
        >
          {passwordChangeLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : showPasswordChangeForm ? 'Cancel' : 'Change Password'}
        </button>
      </div>

      {/* Password Form */}
      {showPasswordChangeForm && (
        <div className="bg-dark border border-secondary rounded-3 shadow-sm p-4">
          <h5 className="text-white mb-3">Change Password</h5>
          <form onSubmit={handleSubmit}>
            {passwordChangeError && (
              <div className="alert alert-danger">{passwordChangeError}</div>
            )}

            <div className="mb-3">
              <label className="form-label text-secondary">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                className="form-control bg-secondary text-white border-0"
                value={passwordFields.oldPassword}
                onChange={handleChange}
                required
                disabled={passwordChangeLoading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control bg-secondary text-white border-0"
                value={passwordFields.newPassword}
                onChange={handleChange}
                required
                disabled={passwordChangeLoading}
              />
              {newPasswordError && (
                <div className="text-danger small mt-1">{newPasswordError}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                className="form-control bg-secondary text-white border-0"
                value={passwordFields.confirmNewPassword}
                onChange={handleChange}
                required
                disabled={passwordChangeLoading}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary rounded-pill px-4 py-2"
                onClick={togglePasswordForm}
                disabled={passwordChangeLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 py-2"
                disabled={passwordChangeLoading || !!newPasswordError}
              >
                {passwordChangeLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
