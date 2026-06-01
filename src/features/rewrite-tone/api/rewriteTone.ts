import { baseApi } from "@/shared/api/baseApi";

export const rewriteTone = async (
  content: string,
  tone: string,
): Promise<string> => {
  const { data } = await baseApi.post<{ content: string }>(
    "/post/rewrite-tone",
    {
      content,
      tone,
    },
  );
  return data.content;
};
