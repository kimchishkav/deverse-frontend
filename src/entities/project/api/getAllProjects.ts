import { baseApi } from "@/shared/api/baseApi";

export const getAllProjects = async () => {
  const response = await baseApi.get("/project/all");

  return response.data;
};
