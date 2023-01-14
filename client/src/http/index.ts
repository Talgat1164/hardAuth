import axios from 'axios';

export const API_URL = `http://localhost:5000/api`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
  if (!config) {
    config = {}
  }
  if (!config.headers) {
    config.headers = {}
  }
  const token = localStorage.getItem('token')
  if (token) {
    (config.headers as any)['Authorization'] = `Bearer ${token}`
  }
  return config;
})

export default $api;
