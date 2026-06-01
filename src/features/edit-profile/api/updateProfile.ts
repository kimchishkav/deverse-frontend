import { baseApi } from "@/shared/api/baseApi";
import type { UserProfile } from "@/entities/user";

export type UpdateProfileDto = {
  name?: string;
  surname?: string;
  username?: string;
  profession?: string;
};

export const updateProfile = async (data: UpdateProfileDto): Promise<UserProfile> => {
  const response = await baseApi.patch<UserProfile>("/user/updateProfile", data);
  return response.data;
};
