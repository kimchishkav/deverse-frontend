export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  surname: string;
  username: string;
  profession: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email: string;
  username: string;
  role: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
