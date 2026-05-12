import { baseApi } from "@/shared/api/baseApi";

export const unlikePost = async (postId: number) => {
  const response = await baseApi.delete(`/post/like/delete/${postId}`);

  return response.data;
};
