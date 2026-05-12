import type { Post } from "../model/types";

import likeIcon from "@/assets/svg/likeIcon.svg";
import commentIcon from "@/assets/svg/commentIcon.svg";
import viewsIcon from "@/assets/svg/viewsIcon.svg";

import styles from "./PostCard.module.css";

type Props = {
  post: Post;
};

export const PostCard = ({ post }: Props) => {
  const authorName = post.author?.name ?? "Victoria Kim";

  const authorProfession = post.author?.profession ?? "Frontend Developer";

  const authorAvatar = post.author?.avatar ?? "https://i.pravatar.cc/150?img=5";

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <img className={styles.avatar} src={authorAvatar} alt={authorName} />

        <div className={styles.authorInfo}>
          <h3 className={styles.authorName}>{authorName}</h3>

          <p className={styles.profession}>{authorProfession}</p>
        </div>
      </div>

      <div className={styles.content}>
        <p>{post.content}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.leftStats}>
          <span className={styles.stat}>
            <img className={styles.statIcon} src={likeIcon} alt="Likes" />

            {post.likesCount ?? 0}
          </span>

          <span className={styles.stat}>
            <img className={styles.statIcon} src={commentIcon} alt="Comments" />

            {post.commentsCount ?? 0}
          </span>
        </div>

        <div className={styles.rightStats}>
          <span className={styles.stat}>
            <img className={styles.statIcon} src={viewsIcon} alt="Views" />

            {post.viewsCount ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
};
