import { baseApi } from "@/shared/api/baseApi";

type CreateProjectDto = {
  title: string;
  description: string;
  url: string;
};

export const createProject = async (data: CreateProjectDto) => {
  const response = await baseApi.post("/project/create", data);

  return response.data;
};
