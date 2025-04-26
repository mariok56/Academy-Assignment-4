import axios from 'axios';
import { useAuthStore } from '../store/authStore';


export const axiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      if (!error.config.url?.includes('/api/login')) {

        useAuthStore.getState().logout();
        window.location.href = '/login';
      } else {

        return Promise.reject({
          result: {
            message: error.response?.data?.result?.message || 'Invalid Credentials!',
          },
        });
      }
    }
    
    // Handle other errors
    const errorResponse = {
      result: {
        message: error.response?.data?.result?.message || 
                error.message || 
                'An unexpected error occurred',
      },
      status: error.response?.status,
    };
    
    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;