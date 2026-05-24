import { baseApi } from "@/shared/api/baseApi";

export const deleteProject = async (projectId: number) => {
  await baseApi.delete(`/project/delete/${projectId}`);
};
