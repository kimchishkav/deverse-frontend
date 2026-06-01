import { baseApi } from "@/shared/api/baseApi";

export const improveGrammar = async (content: string): Promise<string> => {
  const response = await baseApi.post<{ content: string }>("/post/improve-grammar", { content });
  return response.data.content;
};
