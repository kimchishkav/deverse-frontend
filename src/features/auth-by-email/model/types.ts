export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email: string;
  username: string;
  role: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};
