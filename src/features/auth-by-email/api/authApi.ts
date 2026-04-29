import { baseApi } from "@/shared/api/baseApi";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

import type { LoginRequest, LoginResponse } from "../model/types";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await baseApi.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    data,
  );

  return response.data;
};
