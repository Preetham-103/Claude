import axios from './api';

const API_BASE_URL = '/api/v1/cart';

export const cartService = {
  increaseProductQuantity: async (userId, bookId, quantityToAdd) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${userId}/increaseqnty/${bookId}`, null, {
        params: { quantityToAdd }
      });
      return response.data;
    } catch (error) {
      console.error(`Error increasing quantity for book ${bookId} for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  decreaseProductQuantity: async (userId, bookId, quantityToRemove) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${userId}/decreaseqnty/${bookId}`, null, {
        params: { quantityToRemove }
      });
      return response.data;
    } catch (error) {
      console.error(`Error decreasing quantity for book ${bookId} for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  removeProductFromCart: async (userId, bookId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${userId}/removeBook/${bookId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing book ${bookId} from cart for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getTotalPrice: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}/total-price`);
      return response.data;
    } catch (error) {
      console.error(`Error getting total price for cart of user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getCartItems: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}/viewAllProducts`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error getting cart items for user ${userId}:`, error.response?.data || error.message);
      console.log(`the error message in fetching is: ${error.message}`);
      throw error;
    }
  },

  clearCart: async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${userId}/clearcart`);
      return response.data;
    } catch (error) {
      console.error(`Error clearing cart for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  updateCartTotal: async (userId, grandTotal) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${userId}/total`,  grandTotal );
      return response.data;
    } catch (error) {
      console.error(`Error updating cart total for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  }
};