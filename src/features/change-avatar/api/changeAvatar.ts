import { baseApi } from "@/shared/api/baseApi";

export const changeAvatar = async (file: File) => {
  const formData = new FormData();

  formData.append("avatar", file, file.name || "avatar.jpg");

  console.log("avatar file:", file);
  console.log("is File:", file instanceof File);
  console.log("is Blob:", file instanceof Blob);
  console.log("type:", file.type);
  console.log("name:", file.name);
  console.log("size:", file.size);
  console.log("formData avatar:", formData.get("avatar"));

  const response = await baseApi.post("/user/changeProfileAvatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: [(data) => data],
  });

  return response.data;
};
