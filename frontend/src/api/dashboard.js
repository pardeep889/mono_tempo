import { BACKEND_URL, axiosInstance } from "./config";

export const fetchUserCounts = async () => {
  const instance = axiosInstance();

  if (!instance) {
    throw new Error('Token not available');
  }

  try {
    const response = await instance.get(`${BACKEND_URL}/admin/dashboard-count`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching user counts:', error);
    throw error;
  }
};

export const fetchUsers = async (start, pageSize, role) => {
  const instance = axiosInstance();

  if (!instance) {
    throw new Error('Token not available');
  }

  try {
    const response = await instance.get(`${BACKEND_URL}/admin/fetch-users`, {
      params: { start, pageSize, role },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
