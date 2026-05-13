import { baseApi } from "@/shared/api/baseApi";

import type { Comment } from "../model/types";

export type CreateCommentRequest = {
  post_id: number;
  content: string;
};

export const createComment = async (
  data: CreateCommentRequest,
): Promise<Comment> => {
  const response = await baseApi.post<Comment>("/post/comment/create", data);

  return response.data;
};

export const getCommentsByPostId = async (
  postId: number,
): Promise<Comment[]> => {
  const response = await baseApi.get<Comment[]>(`/post/comments/${postId}`);

  return response.data;
};
