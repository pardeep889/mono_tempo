import { BACKEND_URL, axiosInstance } from "./config";

const instance = axiosInstance()

  if (!instance) {
    throw new Error('Token not available')
  }

export const fetchUserCounts = async () => {


  try {
    const response = await instance.get(`${BACKEND_URL}/admin/dashboard-count`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching user counts:', error);
    throw error;
  }
};

export const fetchUsers = async (start, pageSize, role) => {


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

export const fetchExplores = async (page, pageSize) => {
  

  try {
    const response = await instance.get(`${BACKEND_URL}/explore/fetch-explores`, {
      params: { page, pSize: pageSize }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching explores:', error)
    throw error
  }
}


export const promoteExploreAPI = async (id, promote) => {
  try {
    const response = await instance.post(`${BACKEND_URL}/admin/promote-explore`, {
      id: id,
      promote: promote
    });
    return response.data;
  } catch (error) {
    console.error('Error promoting explore:', error);
    throw error;
  }
};