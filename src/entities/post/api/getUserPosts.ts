import axios from "axios";

const API_URL = "https://deverse-backend-production.up.railway.app";

export const getUserPosts = async (userId: number) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/post/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
