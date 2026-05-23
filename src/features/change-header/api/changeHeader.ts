import { baseApi } from "@/shared/api/baseApi";

export const changeHeader = async (file: File) => {
  const formData = new FormData();

  formData.append("header", file, file.name || "header.jpg");

  const response = await baseApi.post("/user/changeProfileHeader", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: [(data) => data],
  });

  return response.data;
};
