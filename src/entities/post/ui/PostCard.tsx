import { useState } from "react";

import type { Post } from "../model/types";

import {
  createComment,
  getCommentsByPostId,
  type Comment,
} from "@/entities/comment";

import { likePost } from "@/features/like-post/api/likePost";
import { unlikePost } from "@/features/unlike-post/api/unlikePost";

import likeIcon from "@/assets/svg/likeIcon.svg";
import commentIcon from "@/assets/svg/commentIcon.svg";
import viewsIcon from "@/assets/svg/viewsIcon.svg";

import styles from "./PostCard.module.css";

type Props = {
  post: Post;
};

export const PostCard = ({ post }: Props) => {
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const authorName = post.author?.name ?? "Victoria Kim";
  const authorProfession = post.author?.profession ?? "Frontend Developer";

  const authorAvatar = post.author?.avatar ?? "https://i.pravatar.cc/150?img=5";

  const handleToggleLike = async () => {
    if (isLikeLoading) return;

    try {
      setIsLikeLoading(true);

      if (isLiked) {
        await unlikePost(post.id);

        setIsLiked(false);

        setLikesCount((prevCount) => Math.max(prevCount - 1, 0));
      } else {
        await likePost(post.id);

        setIsLiked(true);

        setLikesCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Toggle like error:", error);
      alert("Не удалось изменить лайк.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleToggleComments = async () => {
    setIsCommentsOpen((prev) => !prev);

    if (!isCommentsOpen && comments.length === 0) {
      try {
        setIsCommentsLoading(true);

        const postComments = await getCommentsByPostId(post.id);

        setComments(postComments);
      } catch (error) {
        console.error("Load comments error:", error);
      } finally {
        setIsCommentsLoading(false);
      }
    }
  };

  const handleCreateComment = async () => {
    const trimmedComment = commentText.trim();

    if (!trimmedComment) return;

    try {
      const createdComment = await createComment({
        post_id: post.id,
        content: trimmedComment,
      });

      setComments((prevComments) => [createdComment, ...prevComments]);

      setCommentText("");
    } catch (error) {
      console.error("Create comment error:", error);
      alert("Не удалось добавить комментарий.");
    }
  };

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
          <button
            type="button"
            className={`${styles.statButton} ${isLiked ? styles.liked : ""}`}
            onClick={handleToggleLike}
            disabled={isLikeLoading}
          >
            <img className={styles.statIcon} src={likeIcon} alt="Likes" />

            {likesCount}
          </button>

          <button
            type="button"
            className={styles.statButton}
            onClick={handleToggleComments}
          >
            <img className={styles.statIcon} src={commentIcon} alt="Comments" />

            {post.commentsCount ?? comments.length ?? 0}
          </button>
        </div>

        <div className={styles.rightStats}>
          <span className={styles.stat}>
            <img className={styles.statIcon} src={viewsIcon} alt="Views" />

            {post.viewsCount ?? 0}
          </span>
        </div>
      </div>

      {isCommentsOpen && (
        <div className={styles.comments}>
          <div className={styles.commentForm}>
            <input
              className={styles.commentInput}
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write a comment..."
            />

            <button
              className={styles.commentButton}
              type="button"
              onClick={handleCreateComment}
            >
              Send
            </button>
          </div>

          {isCommentsLoading ? (
            <p className={styles.commentText}>Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <p className={styles.commentAuthor}>
                  {comment.author?.name ?? comment.author?.username ?? "User"}
                </p>

                <p className={styles.commentText}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </article>
  );
};
