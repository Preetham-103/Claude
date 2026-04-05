import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserData, getProfileDataByUserId } from '../../../services/profileService';

const ProfileContext = createContext();

export const ProfileProvider = ({ children, userId }) => {
    const [userData, setUserData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserProfile = async () => {
        if (!userId) {
            setError("User ID not provided to Profile Context.");
            setLoading(false); // Ensure loading is off if userId is missing
            return;
        }
        setError(null);
        try {
            const userResponse = await getUserData(userId);
            setUserData(userResponse);
            const profileResponse = await getProfileDataByUserId(userId);
            setProfileData(profileResponse);
            console.log("Profile data fetched in context:", profileResponse);
        } catch (err) {
            console.error(`Error fetching data for user ID ${userId} in context:`, err);
            setError("Failed to load profile data. Please try again.");
            setUserData({ name: "N/A", email: "N/A", createdDate: null, password: null });
            setProfileData({ profileImageUrl: null, bio: "N/A", phoneNumber: "N/A", address: "N/A", createdAt: null });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [userId]); // Re-fetch when userId changes

    const contextValue = {
        userData,
        profileData,
        loading,
        error,
        fetchUserProfile // Expose the fetch function
    };

    return (
        <ProfileContext.Provider value={contextValue}>
            {children}
        </ProfileContext.Provider>
    );
};

// Custom hook to consume the profile context
export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};