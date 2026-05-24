import { baseApi } from "@/shared/api/baseApi";

type UpdateProjectDto = {
  projectId: number;
  title: string;
  description: string;
  url: string;
};

export const updateProject = async ({
  projectId,
  ...data
}: UpdateProjectDto) => {
  const response = await baseApi.patch(`/project/update/${projectId}`, data);

  return response.data;
};
