import type { Post } from "../model/types";
import likeIcon from "@/assets/svg/likeIcon.svg";
import commentIcon from "@/assets/svg/commentIcon.svg";
import viewsIcon from "@/assets/svg/viewsIcon.svg";

import styles from "./PostCard.module.css";

type Props = {
  post: Post;
};

export const PostCard = ({ post }: Props) => {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <img
          className={styles.avatar}
          src={post.author.avatar}
          alt={post.author.name}
        />

        <div className={styles.authorInfo}>
          <h3 className={styles.authorName}>{post.author.name}</h3>
          <p className={styles.profession}>{post.author.profession}</p>
        </div>
      </div>

      <div className={styles.content}>
        <p>{post.content}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.leftStats}>
          <span className={styles.stat}>
            <img className={styles.statIcon} src={likeIcon} alt="Likes" />
            {post.likesCount}
          </span>
          <span className={styles.stat}>
            <img className={styles.statIcon} src={commentIcon} alt="Comments" />
            {post.commentsCount}
          </span>
        </div>

        <div className={styles.rightStats}>
          <span className={styles.stat}>
            <img className={styles.statIcon} src={viewsIcon} alt="Views" />
            {post.viewsCount}
          </span>
        </div>
      </div>
    </article>
  );
};
