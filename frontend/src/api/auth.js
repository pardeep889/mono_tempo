import axios from "axios"
import { BACKEND_URL } from "./config";

export const loginApi = async (data) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/user/login`, data);
      console.log("Data",response.data)
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
};