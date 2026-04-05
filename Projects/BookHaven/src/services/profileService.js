import api from './api';

export const getUserData = async (userId) => {
    try {
        const response = await api.get(`/user/viewuserbyid/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user data for ID ${userId}:`, error);
        throw error;
    }
};

export const getProfileDataByUserId = async (userId) => {
    try {
        const response = await api.get(`/profile/view/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching profile data for user ID ${userId}:`, error);
        throw error;
    }
};

export const updateUserData = async (userId, userData) => {
    try {
        const response = await api.put(`/user/updateuser/${userId}`, userData, {
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating user data for ID ${userId}:`, error);
        throw error;
    }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const response = await api.put(`/user/changepassword/${userId}`, {
            oldPassword: oldPassword,
            newPassword: newPassword
        });
        return response.data;
    } catch (error) {
        console.error(`Error changing password for user ID ${userId}:`, error);
        throw error;
    }
};

export const updateProfileData = async (userId, profileDto, imageFile) => {
    try {
        const profileResponse = await api.put(`/profile/update/${userId}`, profileDto, {
        });

        if (imageFile) {
            await uploadUserProfileImage(userId, imageFile);
        }

        return profileResponse.data;
    } catch (error) {
        console.error(`Error updating profile data for user ID ${userId}:`, error);
        throw error;
    }
};

export const createProfile = async (userId, profileDto, imageFile) => {
    const formData = new FormData();
    formData.append('profileDto', new Blob([JSON.stringify(profileDto)], {
        type: 'application/json'
    }));
    formData.append('image', imageFile);

    try {
        const response = await api.post(`/profile/create/${userId}`, formData, {
            headers: {},
        });
        return response.data;
    } catch (error) {
        console.error(`Error creating profile for user ID ${userId}:`, error);
        throw error;
    }
};

export const uploadUserProfileImage = async (userId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await api.post(`/profile/upload-image/${userId}`, formData, { // CORRECTED URL HERE
            headers: {},
        });
        return response.data;
    } catch (error) {
        console.error(`Error uploading user image for ID ${userId}:`, error);
        throw error;
    }
};