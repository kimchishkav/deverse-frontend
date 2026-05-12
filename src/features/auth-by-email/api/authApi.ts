import { baseApi } from "@/shared/api/baseApi";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../model/types";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await baseApi.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    data,
  );
  return response.data;
};

export const register = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  const response = await baseApi.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    data,
  );

  return response.data;
};
