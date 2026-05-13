import { baseApi } from "@/shared/api/baseApi";

export const followUser = async (userId: number) => {
  const response = await baseApi.post(`/user/follow/${userId}`);

  return response.data;
};
