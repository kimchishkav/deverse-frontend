import { useEffect, useState } from "react";

import { createPost, type Post } from "@/entities/post";
import { getUserPosts } from "@/entities/post/api/getUserPosts";
import { getFollowing } from "@/entities/user";
import { CreatePostForm } from "@/features/create-post";
import { getStoredUser, type StoredUser } from "@/shared/lib/auth";
import { getDisplayName, getAvatarUrl } from "@/shared/lib/user";
import { useToast } from "@/shared/ui/toast";
import { MainLayout } from "@/widgets/layout";
import { PostList } from "@/widgets/post-list";

import styles from "./FeedPage.module.css";

export const FeedPage = () => {
  const { showToast } = useToast();
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

        const user = JSON.parse(userData) as StoredUser;

        const myPosts = await getUserPosts(user.id);
        const followingUsers = await getFollowing(user.id);

        const myPostsWithAvatar = myPosts.map((post: Post) => ({
          ...post,
          author: {
            ...post.author,
            id: user.id,
            name: post.author?.name ?? getDisplayName(user),
            profession: post.author?.profession ?? user.profession ?? "Developer",
            avatar_url: getAvatarUrl(user),
          },
        }));

        const friendsPostsArrays = await Promise.all(
          followingUsers.map(async (friend) => {
            const posts = await getUserPosts(friend.id);

            return posts.map((post: Post) => ({
              ...post,
              author: {
                ...post.author,
                id: friend.id,
                name: post.author?.name ?? getDisplayName(friend),
                profession: post.author?.profession ?? friend.profession ?? "Developer",
                avatar_url: getAvatarUrl(friend),
              },
            }));
          }),
        );

        const friendsPosts = friendsPostsArrays.flat();

        const allPosts = [...myPostsWithAvatar, ...friendsPosts].sort(
          (a, b) => {
            const dateA = new Date(a.createdAt ?? 0).getTime();
            const dateB = new Date(b.createdAt ?? 0).getTime();

            return dateB - dateA;
          },
        );

        setPosts(allPosts);
      } catch (error) {
        console.error("Fetch feed posts error:", error);
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
          profession: currentUser?.profession ?? "Developer",
          avatar: currentUser?.avatar,
          avatar_url: currentUser?.avatar_url,
        },
      };

      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("Create post error:", error);
      showToast("Не удалось создать пост. Убедись, что ты залогинена.");
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
