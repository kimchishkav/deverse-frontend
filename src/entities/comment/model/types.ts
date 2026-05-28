export type CommentAuthor = {
  id?: number;
  name?: string;
  username?: string;
  avatar?: string;
  avatar_url?: string;
};

export type Comment = {
  id: number;
  content: string;
  post_id?: number;
  postId?: number;
  author?: CommentAuthor;
  createdAt?: string;
};
