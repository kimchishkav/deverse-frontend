import { baseApi } from "@/shared/api/baseApi";

export const deleteComment = async (commentId: number) => {
  const response = await baseApi.delete(`/post/comment/delete/${commentId}`);

  return response.data;
};
