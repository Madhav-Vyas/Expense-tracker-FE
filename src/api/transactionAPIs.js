import axios from "axios";
import useAuthStore from "../hooks/useAuthStore";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const API_URL = rawApiUrl.replace(/\/+$/, "");

const headers = {
  "Content-Type": "application/json",
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers,
  withCredentials: true, // sending cookies to backend
});

// Request interceptor to append JWT token in Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const addTransaction = async (transactionData) => {
  try {
    const response = await axiosInstance.post("/transaction", transactionData);
    return response.data;
  } catch (error) {
    console.error("Adding transaction failed:", error);
    throw error;
  }
};

const getAllTransactions = async (params) => {
  try {
    const response = await axiosInstance.get("/transaction", { params });
    return response.data;
  } catch (error) {
    console.error("Getting all transactions failed:", error);
    throw error;
  }
};

const getAnalyticsSummary = async (params) => {
  try {
    const response = await axiosInstance.get("/analytics/summary", { params });
    return response.data;
  } catch (error) {
    console.error("Getting analytics summary failed:", error);
    throw error;
  }
};

const getAnalyticsLifestyle = async (params) => {
  try {
    const response = await axiosInstance.get("/analytics/lifestyle", { params });
    return response.data;
  } catch (error) {
    console.error("Getting analytics lifestyle failed:", error);
    throw error;
  }
};

const getAnalyticsForecast = async (params) => {
  try {
    const response = await axiosInstance.get("/analytics/forecast", { params });
    return response.data;
  } catch (error) {
    console.error("Getting analytics forecast failed:", error);
    throw error;
  }
};

export {
  addTransaction,
  getAllTransactions,
  getAnalyticsSummary,
  getAnalyticsLifestyle,
  getAnalyticsForecast,
};

