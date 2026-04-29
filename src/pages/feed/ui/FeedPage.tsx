import { useState } from "react";

import { MainLayout } from "@/widgets/layout";
import { PostList } from "@/widgets/post-list";
import { type Post } from "@/entities/post";
import avatarImage from "@/img/avatar.jpg";

import styles from "./FeedPage.module.css";
import { CreatePostForm } from "@/features/create-post";

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleCreatePost = (content: string) => {
    const newPost: Post = {
      id: Date.now(),
      content,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      author: {
        id: 999,
        name: "Victoria Kim",
        profession: "Frontend Developer",
        avatar: avatarImage,
      },
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <MainLayout>
      <div className={styles.content}>
        <CreatePostForm onCreate={handleCreatePost} />

        <PostList posts={posts} />
      </div>
    </MainLayout>
  );
};
