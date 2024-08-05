// src/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // Set your base URL here
});

export default axiosInstance;
