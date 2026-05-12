import axios from "axios";

const API_URL = "http://localhost:3000";

export const getUserPosts = async (userId: number) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/post/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
