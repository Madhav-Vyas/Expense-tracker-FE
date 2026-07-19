import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const headers = {
  "Content-Type": "application/json",
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers,
  withCredentials: true, // sending cookies to backend
});
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

export { addTransaction,getAllTransactions };

