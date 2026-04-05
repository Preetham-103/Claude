import React, { useState, useCallback } from 'react';
import { useProfile } from '../context/ProfileContext';
import { updateUserData, updateProfileData } from '../../../services/profileService';
import UpdateProfileModal from './UpdateprofileModal';

const ProfileOverview = ({ userId }) => {
  const { userData, profileData, loading, error, fetchUserProfile } = useProfile();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Memoized handlers for better performance
  const handleOpenUpdateModal = useCallback(() => {
    setShowUpdateModal(true);
    setUpdateError(null);
  }, []);

  const handleCloseUpdateModal = useCallback(() => {
    setShowUpdateModal(false);
    setUpdateError(null);
  }, []);

  // Enhanced profile update handler with loading states
  const handleProfileUpdate = async (modalUserId, updatedFormData, selectedImageFile) => {
    setUpdateError(null);
    setIsUpdating(true);
    
    try {
      // Prepare user data payload
      const userUpdatePayload = {
        name: updatedFormData.name,
        email: userData?.email || null,
        password: userData?.password || null,
      };

      // Update user data
      await updateUserData(userId, userUpdatePayload);

      // Prepare profile data payload
      const updatedProfileDto = {
        bio: updatedFormData.bio,
        phoneNumber: updatedFormData.phoneNumber,
        address: updatedFormData.address,
      };

      // Update profile data with image
      await updateProfileData(userId, updatedProfileDto, selectedImageFile);

      console.log("Profile updated successfully!");
      handleCloseUpdateModal();
      await fetchUserProfile();

    } catch (err) {
      console.error("Error updating profile:", err);
      setUpdateError("Failed to update profile. Please ensure all fields are valid and try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Generate profile image source with fallbacks
  const getProfileImageSource = () => {
    if (profileData?.profileImageUrl) {
      return profileData.profileImageUrl;
    }
    if (profileData?.imageBase64) {
      return `data:image/jpeg;base64,${profileData.imageBase64}`;
    }
    return "https://placehold.co/128x128/6c757d/ffffff?text=User";
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh', backgroundColor: '#1a1a1a' }}>
        <div className="text-center text-white">
          <div className="spinner-border text-light mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mb-0 fs-5">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container py-5" style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger bg-dark border-danger text-white" role="alert">
              <h4 className="alert-heading text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Error Loading Profile
              </h4>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No profile data state
  if (!userData || !profileData) {
    return (
      <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="bg-dark p-5 rounded shadow border border-secondary text-center">
                <div className="mb-4">
                  <i className="bi bi-person-circle text-secondary" style={{ fontSize: '5rem' }}></i>
                </div>
                <h3 className="text-white mb-3 fw-bold">No Profile Found</h3>
                <p className="text-muted mb-4 fs-6">
                  No profile data found for user ID <strong className="text-white">{userId}</strong>. 
                  Create your profile to get started.
                </p>
                <button 
                  className="btn btn-outline-light btn-lg px-4 py-2"
                  onClick={handleOpenUpdateModal}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Profile
                </button>
              </div>
            </div>
          </div>

          <UpdateProfileModal
            show={showUpdateModal}
            handleClose={handleCloseUpdateModal}
            currentUserData={userData || { name: '', email: '' }}
            currentProfileData={profileData || { bio: '', phoneNumber: '', address: '', profileImageUrl: '' }}
            onUpdate={handleProfileUpdate}
            userId={userId}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 p-4 border-bottom border-secondary">
        <div>
          <h1 className="text-white mb-1 fw-bold">Profile Overview</h1>
          <p className="text-white mb-0">Manage your personal information</p>
        </div>
        <button 
          className="btn btn-outline-light px-4 py-2"
          onClick={handleOpenUpdateModal}
          disabled={isUpdating}
        >
          <i className="bi bi-pencil-square me-2"></i>
          {isUpdating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Updating...
            </>
          ) : (
            'Edit Profile'
          )}
        </button>
      </div>

      <div className="container py-4">
        {/* Success/Error Alerts */}
        {updateError && (
          <div className="alert alert-danger bg-dark border-danger text-white alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {updateError}
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={() => setUpdateError(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Profile Header */}
        <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-5">
          {/* Profile Image */}
          <div className="position-relative">
            <img
              src={getProfileImageSource()}
              alt={userData.name || "User Profile"}
              className="rounded-circle border border-2 border-light shadow"
              style={{ 
                width: '150px', 
                height: '150px', 
                objectFit: 'cover',
                boxShadow: '0 0 30px rgba(255,255,255,0.1)'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/150x150/6c757d/ffffff?text=Error";
              }}
            />
            <span className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2 border border-2 border-dark">
              <i className="bi bi-check-lg text-white"></i>
            </span>
          </div>

          {/* Basic Info */}
          <div className="text-center text-md-start flex-grow-1">
            <h2 className="text-white fw-bold mb-2" style={{ fontSize: '2.5rem' }}>
              {userData.name || 'Anonymous User'}
            </h2>
            <p className="text-white mb-3 fs-5">
              <i className="bi bi-envelope me-2 "></i>
              {userData.email || 'No email provided'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="row g-4">
          {/* Personal Information Card */}
          <div className="col-lg-8">
            <div className="bg-dark p-4 rounded shadow border border-secondary h-100">
              <h4 className="text-white mb-4 fw-bold">
                <i className="bi bi-person-lines-fill me-2"></i>
                Personal Information
              </h4>
              
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="info-item">
                    <label className="form-label text-secondary mb-2 fw-semibold">
                      <i className="bi bi-person me-2"></i>
                      Full Name
                    </label>
                    <div className="bg-secondary bg-opacity-10 p-3 rounded border border-secondary text-white">
                      {userData.name || 'Not provided'}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-item">
                    <label className="form-label text-secondary mb-2 fw-semibold">
                      <i className="bi bi-envelope me-2"></i>
                      Email Address
                    </label>
                    <div className="bg-secondary bg-opacity-10 p-3 rounded border border-secondary text-white">
                      {userData.email || 'Not provided'}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="info-item">
                    <label className="form-label text-secondary mb-2 fw-semibold">
                      <i className="bi bi-card-text me-2"></i>
                      Biography
                    </label>
                    <div className="bg-secondary bg-opacity-10 p-3 rounded border border-secondary text-white" style={{ minHeight: '100px' }}>
                      {profileData.bio || 'No biography provided'}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-item">
                    <label className="form-label text-secondary mb-2 fw-semibold">
                      <i className="bi bi-telephone me-2"></i>
                      Phone Number
                    </label>
                    <div className="bg-secondary bg-opacity-10 p-3 rounded border border-secondary text-white">
                      {profileData.phoneNumber || 'Not provided'}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-item">
                    <label className="form-label text-secondary mb-2 fw-semibold">
                      <i className="bi bi-geo-alt me-2"></i>
                      Address
                    </label>
                    <div className="bg-secondary bg-opacity-10 p-3 rounded border border-secondary text-white">
                      {profileData.address || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Update Modal */}
      <UpdateProfileModal
        show={showUpdateModal}
        handleClose={handleCloseUpdateModal}
        currentUserData={userData}
        currentProfileData={profileData}
        onUpdate={handleProfileUpdate}
        userId={userId}
      />
    </div>
  );
};

export default ProfileOverview;