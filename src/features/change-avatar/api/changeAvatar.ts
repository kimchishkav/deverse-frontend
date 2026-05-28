import { baseApi } from "@/shared/api/baseApi";

export const changeAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file, file.name || "avatar.jpg");

  const response = await baseApi.post("/user/changeProfileAvatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    transformRequest: [(data) => data],
  });

  return response.data;
};
