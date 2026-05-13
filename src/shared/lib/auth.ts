export type StoredUser = {
  id: number;
  email: string;
  username: string;
  role: string;
  name?: string;
  surname?: string;
  profession?: string;
  avatar?: string;
};

export const getStoredUser = (): StoredUser | null => {
  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user) as StoredUser;
  } catch {
    return null;
  }
};
