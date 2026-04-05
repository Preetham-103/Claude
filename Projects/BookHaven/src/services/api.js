import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem('user'));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only set Content-Type if not sending FormData
  if ((config.method === 'post' || config.method === 'put') && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  console.log("Request config:", config);
  return config;
}, error => {
  console.error("Request error:", error);
  return Promise.reject(error);
});

instance.interceptors.response.use(
  response => {
    console.log("Response:", response);
    return response;
  },
  error => {
    console.error("Response error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
