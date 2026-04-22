import { PostCard, type Post } from "@/entities/post";

import styles from "./PostList.module.css";

type Props = {
  posts: Post[];
};

export const PostList = ({ posts }: Props) => {
  if (!posts.length) {
    return <div className={styles.empty}>No posts yet</div>;
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
