// src/api/BaseURL.jsx

import axios from "axios";
//https://hackta-connect-crm-client.vercel.app/api
//http://localhost:5000/api
const baseURL = "https://hackta-connect-crm-client.vercel.app/api";

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
