import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const headers = {
  "Content-Type": "application/json",
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers,
  withCredentials: true, // sending cookies to backend
});

export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post(`/auth/signup`, userData);
    return response.data; // return response data so token is available to caller
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axiosInstance.post(`/auth/login`, userData);
    return response.data; // return response data instead of calling undefined set()
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
