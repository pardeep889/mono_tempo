import axios from "axios"

const BACKEND_URL = import.meta.env.VITE_API_URL;


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