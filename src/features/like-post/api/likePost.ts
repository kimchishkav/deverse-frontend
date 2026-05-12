import { baseApi } from "@/shared/api/baseApi";

export const likePost = async (postId: number) => {
  const response = await baseApi.post(`/post/like/create/${postId}`);

  return response.data;
};
