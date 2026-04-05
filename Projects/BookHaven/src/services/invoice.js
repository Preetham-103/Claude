import api from './api'; 
export const fetchPayment = async (paymentId) => {
  return api.get(`/payments/paymentdetails/${paymentId}`);
};

export const addOrder = async (orderData) => {
  return api.post(`/bookstore/addOrder`, orderData);
};

export const getOrdersByUserId = async (id) => {
  return api.get(`/bookstore/getOrderByUserId/${id}`);
};

export const fetchUser = async (userId) => {
  return api.get(`/user/viewuserbyid/${userId}`);
};

export const fetchProfile = async (userId) => {
  return api.get(`/profile/view/${userId}`);
};
