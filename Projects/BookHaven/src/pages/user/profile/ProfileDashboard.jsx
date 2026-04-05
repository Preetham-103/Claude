import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProfileOverview from './ProfileOverview';
import OrderHistory from './OrderHistory';
import AccountSettings from './AccountSettings';
import UpdateProfileModal from './UpdateprofileModal';
import { ProfileProvider, useProfile } from '../context/ProfileContext';
import { updateUserData, updateProfileData } from '../../../services/profileService';

function AppContent({userId}) {
    const { userData, profileData, loading, error, fetchUserProfile } = useProfile();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    const handleShowUpdateModal = () => setShowUpdateModal(true);
    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setUpdateError(null);
    };

    const handleUpdateProfile = async (updatedFormData, imageFile) => {
        try {
            await updateUserData(userId, {
                name: updatedFormData.name,
                email: userData?.email,
                password: userData?.password,
                role: userData?.role,
                createdDate: userData?.createdDate,
                updatedDate: new Date().toISOString(),
            });

            await updateProfileData(userId, {
                bio: updatedFormData.bio,
                phoneNumber: updatedFormData.phoneNumber,
                address: updatedFormData.address,
                profileImageUrl: imageFile ? null : updatedFormData.profileImageUrl,
                createdAt: profileData?.createdAt,
                updatedAt: new Date().toISOString(),
            }, imageFile);

            handleCloseUpdateModal();
            await fetchUserProfile();
            alert("Profile updated successfully!");
        } catch (err) {
            setUpdateError("Failed to update profile. Check console.");
            console.error(err);
        }
    };

    if (loading) return <div className="text-white text-center p-5">Loading...</div>;
    if (error) return <div className="text-danger p-4">Error loading profile data: {error}</div>;

    return (
        <div className="container-fluid bg-dark text-white min-vh-100 py-3">
            <div className="row justify-content-center">
                <div className="col-md-3 col-lg-2"><Sidebar /></div>
                <div className="col-md-9 col-lg-10">
                    {updateError && <div className="alert alert-danger mx-4">{updateError}</div>}

                    <Routes>
                        <Route path="/" element={<ProfileOverview userId={userId} onUpdateClick={handleShowUpdateModal} />} />
                        <Route path="/orders" element={<OrderHistory userId={userId} />} />
                        <Route path="/settings" element={<AccountSettings userId={userId} />} />
                    </Routes>
                </div>
            </div>

            {showUpdateModal && userData && profileData && (
                <UpdateProfileModal
                    show={showUpdateModal}
                    handleClose={handleCloseUpdateModal}
                    currentUserData={userData}
                    currentProfileData={profileData}
                    onUpdate={handleUpdateProfile}
                    userId={userId}
                />
            )}
        </div>
    );
}

function ProfileDashboard() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.userId) {
            setUserId(storedUser.userId);
        }
    }, []);

    if (!userId) {
        return <div className="text-white text-center p-5">Loading user session...</div>;
    }

    return (
        <ProfileProvider userId={userId}>
            <AppContent userId={userId} />
        </ProfileProvider>
    );
}

export default ProfileDashboard;