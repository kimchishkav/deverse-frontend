import { useState, type ChangeEvent, type FormEvent } from "react";

import { MainLayout } from "@/widgets/layout";
import { PostList } from "@/widgets/post-list";
import { type Post } from "@/entities/post";
import annaAvatar from "@/assets/img/AnnaNekrassova.jpeg";

import styles from "./FeedPage.module.css";
import { Button } from "./button";
import { Textarea } from "./textarea";

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postText, setPostText] = useState("");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = postText.trim();

    if (!trimmedText) {
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      content: trimmedText,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      author: {
        id: 999,
        name: "Victoria Kim",
        profession: "Frontend Developer",
        avatar: annaAvatar,
      },
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setPostText("");
  };

  return (
    <MainLayout>
      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.title}>Share something</h2>

          <Textarea
            value={postText}
            onChange={handleChange}
            placeholder="What do you want to talk about?"
            rows={5}
          />

          <div className={styles.actions}>
            <Button type="submit">Publish</Button>
          </div>
        </form>

        <PostList posts={posts} />
      </div>
    </MainLayout>
  );
};
