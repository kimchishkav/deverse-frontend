import { baseApi } from "@/shared/api/baseApi";

export const deletePost = async (postId: number) => {
  await baseApi.delete(`/post/delete/${postId}`);
};
