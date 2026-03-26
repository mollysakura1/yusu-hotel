import axios, { type AxiosRequestConfig } from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error?.response?.data || error)
);

export default {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return http.get<any, T>(url, config);
  }
};
