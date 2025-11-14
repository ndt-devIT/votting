// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://magenta-lokum-c708c2.netlify.app",
});

// const axiosClient = axios.create({
//   baseURL: "https://localhost:3000",
// });

// ✅ Tự gắn token từ localStorage
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
