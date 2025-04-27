// src/api/BaseURL.jsx

import axios from "axios";

const baseURL = "";

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
