import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  const accessToken = localStorage.getItem('accessToken');
  config.headers!.Authorization = `Bearer ${accessToken}`;
  return config;
});

export default axiosInstance;
