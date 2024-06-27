import axios from "axios";
import Cookies from 'js-cookie';


export const BACKEND_URL = "https://tempospace.azurewebsites.net/api"
// export const BACKEND_URL = "http://localhost:5000/api"




export const axiosInstance = () => {
    const token = Cookies.get('_auth'); // Get token from cookies
  
    const headers = {
      'Content-Type': 'application/json',
    };
    console.log("token", token )
    if (!token) {
      // Stop and return null if token is not available
      return null;
    }
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Pass token as Bearer Token
    }
  
    return axios.create({
      BACKEND_URL,
      headers,
    });
  };