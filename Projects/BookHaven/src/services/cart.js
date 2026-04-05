import axios from './api';

export const addToCart = async (userId, bookId, productDto) => {
  try {
    const response = await axios.post(`/api/v1/cart/${userId}/addproduct/${bookId}`, productDto);
    return response;
  } catch (error) {
    console.error("Add to cart error:", error);
    throw error;
  }
};

export const increaseQuantity = async (userId, bookId, quantityToAdd) => {
  try {
    const response = await axios.put(`/api/v1/cart/${userId}/increaseqnty/${bookId}`, null, {
      params: { quantityToAdd }
    });
    return response;
  } catch (error) {
    console.error("Increase quantity error:", error);
    throw error;
  }
};

export const decreaseQuantity = async (userId, bookId, quantityToRemove) => {
  try {
    const response = await axios.put(`/api/v1/cart/${userId}/decreaseqnty/${bookId}`, null, {
      params: { quantityToRemove }
    });
    return response;
  } catch (error) {
    console.error("Decrease quantity error:", error);
    throw error;
  }
};