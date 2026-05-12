import { useEffect, useState } from "react";

import { createPost, type Post } from "@/entities/post";
import { getUserPosts } from "@/entities/post/api/getUserPosts";
import { CreatePostForm } from "@/features/create-post";
import avatarImage from "@/img/avatar.jpg";
import { MainLayout } from "@/widgets/layout";
import { PostList } from "@/widgets/post-list";

import styles from "./FeedPage.module.css";

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const userData = localStorage.getItem("user");

      if (!userData) {
        return;
      }

      try {
        setIsLoading(true);

        const user = JSON.parse(userData) as { id: number };
        const userPosts = await getUserPosts(user.id);

        setPosts(userPosts);
      } catch (error) {
        console.error("Fetch posts error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

        {isLoading ? <p>Loading posts...</p> : <PostList posts={posts} />}
      </div>
    </MainLayout>
  );
};
