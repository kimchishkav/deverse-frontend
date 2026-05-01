import { useState } from "react";

import { MainLayout } from "@/widgets/layout";
import { PostList } from "@/widgets/post-list";
import { type Post } from "@/entities/post";
import avatarImage from "@/img/avatar.jpg";

import { createPost } from "@/entities/post";

import styles from "./FeedPage.module.css";
import { CreatePostForm } from "@/features/create-post";

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleCreatePost = async (content: string) => {
    try {
      const createdPost = await createPost({ content });

      const newPost: Post = {
        id: createdPost.id ?? Date.now(),
        content: createdPost.content ?? content,
        likesCount: createdPost.likesCount ?? 0,
        commentsCount: createdPost.commentsCount ?? 0,
        viewsCount: createdPost.viewsCount ?? 0,
        author: createdPost.author ?? {
          id: 999,
          name: "Victoria Kim",
          profession: "Frontend Developer",
          avatar: avatarImage,
        },
      };

      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("Create post error:", error);
      alert("Не удалось создать пост. Убедись, что ты залогинена.");
    }
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
