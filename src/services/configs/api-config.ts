import axios from 'axios';

import { cleanAllStorage, getTokens } from '../../constants/storage/functions';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
});

export const removeRequestHeaderAuth = () => {
  delete apiInstance.defaults.headers.common['Authorization'];
  const token = getTokens();
  if (token) {
    cleanAllStorage();
  }
};

apiInstance.interceptors.request.use(async (config) => {
  const token = getTokens();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
    //   if (window.location.pathname !== '/' && window.location.pathname !== '/singup') {
    //     removeRequestHeaderAuth();
    //     window.location.href = '/';
    //   }
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
