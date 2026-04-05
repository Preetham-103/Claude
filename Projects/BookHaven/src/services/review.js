import axios from './api';
const API_BASE = '/reviews';


export const fetchRatingReview = async() => {
  return axios.get(`${API_BASE}/trendingBooks/6`);
};


export const getUserById = (userId) => {
    return axios.get(`/user/viewuserbyid/${userId}`);
  };

export const getProfileById = (userId) =>{
  return axios.get(`/profile/view/${userId}`);
}

export const getReviewsByBook = async (bookId) => {
  try {
    const response = await axios.get(`${API_BASE}/book/${bookId}`);
    return response;
  } catch (error) {
    console.error("Get reviews error:", error);
    throw error;
  }
};

export const addReview = async (userId, bookId, review) => {
  try {
    const response = await axios.post(`${API_BASE}/addreview/${userId}/${bookId}`, review);
    return response;
  } catch (error) {
    console.error("Add review error:", error);
    throw error;
  }
};

export const upvoteReview = async (reviewId) => {
  try {
    const response = await axios.post(`${API_BASE}/${reviewId}/upvote`);
    return response;
  } catch (error) {
    console.error("Upvote error:", error);
    throw error;
  }
};

export const downvoteReview = async (reviewId) => {
  try {
    const response = await axios.post(`${API_BASE}/${reviewId}/downvote`);
    return response;
  } catch (error) {
    console.error("Downvote error:", error);
    throw error;
  }
};

export const flagReview = async (reviewId) => {
  try {
    const response = await axios.post(`${API_BASE}/${reviewId}/flag`);
    return response;
  } catch (error) {
    console.error("Flag error:", error);
    throw error;
  }
}