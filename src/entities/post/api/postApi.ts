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
