import { baseApi } from "@/shared/api/baseApi";

export const getUserProjects = async (userId: number) => {
  const response = await baseApi.get(`/project/users/${userId}`);

  return response.data;
};
