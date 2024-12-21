import axios from 'axios';
import { Alert } from 'react-native';
import { getItem } from '../utils/functions';

const axiosInstance = axios.create({
  baseURL: 'https://api-baniyas.woodenclouds.in/api/v1/',
});

//request
axiosInstance.interceptors.request.use(
  async config => {
    const token = await getItem('token');
    console.log('Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// response interceptor
axiosInstance.interceptors.response.use(
  response => {
    const appData = response?.data?.app_data;
    if (appData && appData.StatusCode === 6000) {
      return appData;
    } else {
      console.log('Response data:', response.data);
      console.log('Error Title:', appData?.title);
      console.log('Error Message:', appData?.message);
      return Promise.reject(new Error(appData?.message || 'Something went wrong.'));
    }
  },
  error => {
    const requestUrl = error.config ? error.config.url : 'Unknown';
    console.log(`Error API Endpoint: ${requestUrl}`, error);

    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error', error.message);
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;


