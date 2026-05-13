import { baseApi } from "@/shared/api/baseApi";

type EditPostPayload = {
  postId: number;
  content: string;
};

export const editPost = async ({ postId, content }: EditPostPayload) => {
  const response = await baseApi.patch(`/post/update/${postId}`, {
    content,
  });

  return response.data;
};
