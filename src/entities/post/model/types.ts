export type PostAuthor = {
  id: number;
  name: string;
  profession: string;
  avatar: string;
};

export type Post = {
  id: number;
  content: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt?: string;
  isLiked?: boolean;
  author: PostAuthor;
};
