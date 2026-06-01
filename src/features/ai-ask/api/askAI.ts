import { baseApi } from "@/shared/api/baseApi";

export const askAI = async (question: string): Promise<string> => {
  const response = await baseApi.post<{ answer: string }>("/ai/ask", { question });
  return response.data.answer;
};
