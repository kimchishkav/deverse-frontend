export type UserLike = {
  name?: string | null;
  surname?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  avatar?: string | null;
  profession?: string | null;
};

export const getDisplayName = (user: UserLike | null | undefined): string => {
  if (!user) return "User";
  const fullName = [user.name, user.surname].filter(Boolean).join(" ");
  return fullName || user.username || "User";
};

export const getAvatarUrl = (user: UserLike | null | undefined): string | undefined => {
  return user?.avatar_url ?? user?.avatar ?? undefined;
};
