import { baseApi } from "@/shared/api/baseApi";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getUserPosts = async (userId: number) => {
  const response = await baseApi.get(API_ENDPOINTS.POST.GET_BY_USER_ID(userId));
  return response.data;
};
