import { useEffect, useState } from "react";

import { createPost, type Post } from "@/entities/post";
import { getUserPosts } from "@/entities/post/api/getUserPosts";
import { CreatePostForm } from "@/features/create-post";
import avatarImage from "@/img/avatar.jpg";
import { getStoredUser } from "@/shared/lib/auth";
import { MainLayout } from "@/widgets/layout";
import { PostList } from "@/widgets/post-list";

import styles from "./FeedPage.module.css";

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const currentUser = getStoredUser();

      if (!currentUser) {
        return;
      }

      try {
        setIsLoading(true);

        const userPosts = await getUserPosts(currentUser.id);

        const normalizedPosts = userPosts.map((post: Post) => ({
          ...post,
          author: post.author ?? {
            id: currentUser.id,
            name: currentUser.name ?? currentUser.username ?? "User",
            username: currentUser.username,
            profession: currentUser.profession ?? "Developer",
            avatar: currentUser.avatar ?? avatarImage,
          },
        }));

        setPosts(normalizedPosts);
      } catch (error) {
        console.error("Fetch posts error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (content: string) => {
    const currentUser = getStoredUser();

    try {
      const createdPost = await createPost({ content });

      const newPost: Post = {
        id: createdPost.id ?? Date.now(),
        content: createdPost.content ?? content,
        likesCount: createdPost.likesCount ?? 0,
        commentsCount: createdPost.commentsCount ?? 0,
        viewsCount: createdPost.viewsCount ?? 0,
        author: createdPost.author ?? {
          id: currentUser?.id ?? 0,
          name: currentUser?.name ?? currentUser?.username ?? "User",
          username: currentUser?.username,
          profession: currentUser?.profession ?? "Developer",
          avatar: currentUser?.avatar ?? avatarImage,
        },
      };

      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("Create post error:", error);
      alert("Не удалось создать пост. Убедись, что ты залогинена.");
    }
  };

  const handleDeletePost = (postId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <MainLayout>
      <div className={styles.content}>
        <CreatePostForm onCreate={handleCreatePost} />

        {isLoading ? (
          <p>Loading posts...</p>
        ) : (
          <PostList posts={posts} onDeletePost={handleDeletePost} />
        )}
      </div>
    </MainLayout>
  );
};
