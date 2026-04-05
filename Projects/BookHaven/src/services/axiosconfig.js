import api from './api';
const getUserAndToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user || !token) {
    throw new Error('Authentication required: User or token not found.');
  }
  return { user, token };
};

export const initiatePayment = async () => {
  const { user } = getUserAndToken(); // Get user and token once
  const userId = user.userId;
  const url = `/payments/initiate/${userId}`;

  try {
    const response = await api.post(url, {});
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
};

export const fillFields = async () => {
  const { user } = getUserAndToken(); // Get user and token once
  const userId = user.userId
  const url = `/payments/getprofiledetails/${userId}`;
  const amountUrl = `/payments/amount/${userId}`;
  
  try {
    const response = await api.get(url);
    const amountResponse = await api.get(amountUrl);
    const profileDetails = response.data;
    const amountResponseData = amountResponse.data;
    return { profileDetails, amountResponseData };
  } catch (error) {
    console.error("Error retrieving profile details: ", error);
    throw error;
  }
};

export const updateProfileDetails = async (address, phoneNumber) => {
  const { user } = getUserAndToken(); // Get user and token once
  const userId = user.userId;
  const url = `/profile/update/${userId}`;

  try {
    const getProfileDetails = await fillFields();
    const payload = {
      profileId: getProfileDetails.profileId,
      bio: getProfileDetails.bio,
      phoneNumber: phoneNumber,
      address: address,
      imageBase64: getProfileDetails.imageBase64
    };
    const data = await api.put(url, payload);
    const response = data.data;
  } catch (error) {
    console.error("Error updating profile details: ", error);
    throw error;
  }
};

export const retrieveBookInfo = async (paymentId) => {
  const { user } = getUserAndToken(); // Get user and token once
  const userId = user.userId;
  const url = `/api/v1/cart/${userId}/viewAllProducts`;

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error retrieving book details ", error);
    throw error;
  }
};

export const paymentStatusSuccess = async (paymentId, meth) => {
  const { user } = getUserAndToken(); // Get user and token once
  const userId = user.userId;
  const successurl = `/payments/updatestatus/${paymentId}`;
  const cartcontenturl = `/api/v1/cart/${userId}/viewAllProducts`;

  try {
    const bookresponse = await api.get(cartcontenturl);
    const response = await api.put(successurl, {});
    const ress = response.data;
    const bok = bookresponse.data;
    return { ress, bok, meth };
  } catch (error) {
    console.error("Error retreiving book details ", error);
    throw error;
  }
};
