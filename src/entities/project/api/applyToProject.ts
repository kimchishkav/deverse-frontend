import { baseApi } from "@/shared/api/baseApi";

export const applyToProject = async (projectId: number) => {
  const response = await baseApi.post(`/project/apply/${projectId}`);

  return response.data;
};
