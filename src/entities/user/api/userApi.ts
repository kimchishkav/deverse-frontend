import { baseApi } from "@/shared/api/baseApi";

export type UserProfile = {
  id: number;
  email?: string;
  username: string;
  name?: string;
  surname?: string;
  profession?: string;
  avatar?: string;
  header?: string;
  role?: string;
};

export const getUserById = async (
  userId: number | string,
): Promise<UserProfile> => {
  const response = await baseApi.get<UserProfile>(`/user/get/${userId}`);

  return response.data;
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  const response = await baseApi.get<UserProfile[]>("/user/search", {
    params: {
      query,
    },
  });

  return response.data;
};
