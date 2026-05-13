import { baseApi } from "@/shared/api/baseApi";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

import type { Post } from "../model/types";

export type CreatePostRequest = {
  content: string;
};

export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  const response = await baseApi.post<Post>(API_ENDPOINTS.POST.CREATE, data);

  return response.data;
};

export const getPostsByUserId = async (
  userId: number | string,
): Promise<Post[]> => {
  const response = await baseApi.get<Post[]>(
    API_ENDPOINTS.POST.GET_BY_USER_ID(userId),
  );

  return response.data;
};

export const getPostById = async (postId: number | string): Promise<Post> => {
  const response = await baseApi.get<Post>(`/post/get/${postId}`);

  return response.data;
};
