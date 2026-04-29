export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/user/register",
    LOGIN: "/user/login",
  },
  POST: {
    CREATE: "/post/create",
    GET_BY_ID: (id: number | string) => `/post/get/${id}`,
    GET_BY_USER_ID: (id: number | string) => `/post/users/${id}`,
    UPDATE: (id: number | string) => `/post/update/${id}`,
    DELETE: (id: number | string) => `/post/delete/${id}`,
  },
  COMMENT: {
    CREATE: "/post/comment/create",
    GET_BY_POST_ID: (id: number | string) => `/post/comments/${id}`,
    UPDATE: (id: number | string) => `/post/comment/update/${id}`,
    DELETE: (id: number | string) => `/post/comment/delete/${id}`,
  },
  LIKE: {
    CREATE: (id: number | string) => `/post/like/create/${id}`,
    DELETE: (id: number | string) => `/post/like/delete/${id}`,
  },
} as const;
