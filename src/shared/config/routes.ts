export const AppRoutes = {
  AUTH: "/auth",
  FEED: "/feed",
  PROFILE: "/profile",
  PROFILE_BY_ID: "/profile/:id",
  POST_DETAILS: "/post/:id",
  FRIENDS: "/friends",
  PROJECTS: "/projects",
  NOT_FOUND: "*",
} as const;

export const getProfileRoute = (id: string | number) => `/profile/${id}`;
export const getPostDetailsRoute = (id: string | number) => `/post/${id}`;
