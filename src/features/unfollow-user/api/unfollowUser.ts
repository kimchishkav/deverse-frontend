import { baseApi } from "@/shared/api/baseApi";

export const unfollowUser = async (userId: number) => {
  const response = await baseApi.delete(`/user/unfollow/${userId}`);

  return response.data;
};
