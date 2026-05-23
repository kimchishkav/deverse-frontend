import defaultAvatar from "@/assets/img/acc_default_pic.jpg";
import { useState } from "react";

import type { Post } from "../model/types";

import { useNavigate } from "react-router-dom";
import { getPostDetailsRoute } from "@/shared/config/routes";

import {
  CommentsSection,
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

import { deletePost } from "@/features/delete-post/api/deletePost";

import { editPost } from "@/features/edit-post/api/editPost";

import { deleteComment } from "@/features/delete-comment/api/deleteComment";
import { getStoredUser } from "@/shared/lib/auth";

type Props = {
  post: Post;
  onDelete?: (postId: number) => void;
};

export const PostCard = ({ post, onDelete }: Props) => {
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const authorName = post.author?.name ?? "Victoria Kim";
  const authorProfession = post.author?.profession ?? "Frontend Developer";
  const authorAvatar =
    post.author?.avatar_url ?? post.author?.avatar ?? defaultAvatar;

  const navigate = useNavigate();

  const currentUser = getStoredUser();
  const isOwnPost = post.author?.id === currentUser?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [postContent, setPostContent] = useState(post.content);

  const handleOpenPost = () => {
    navigate(getPostDetailsRoute(post.id));
  };

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

        const savedUser = localStorage.getItem("user");
        const currentUser = savedUser ? JSON.parse(savedUser) : null;

        const normalizedComments = postComments.map((comment) => ({
          ...comment,
          author: comment.author ?? {
            id: currentUser?.id,
            name: currentUser?.name ?? currentUser?.username ?? "User",
            username: currentUser?.username,
            avatar: currentUser?.avatar,
          },
        }));

        setComments(normalizedComments);
        setCommentsCount(normalizedComments.length);
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

      const savedUser = localStorage.getItem("user");
      const currentUser = savedUser ? JSON.parse(savedUser) : null;

      const normalizedComment = {
        ...createdComment,
        author: createdComment.author ?? {
          id: currentUser?.id,
          name: currentUser?.name ?? currentUser?.username ?? "User",
          username: currentUser?.username,
          avatar: currentUser?.avatar,
        },
      };

      setComments((prevComments) => [normalizedComment, ...prevComments]);
      setCommentsCount((prevCount) => prevCount + 1);
      setCommentText("");
    } catch (error) {
      console.error("Create comment error:", error);
      alert("Не удалось добавить комментарий.");
    }
  };

  const handleDeletePost = async () => {
    const isConfirmed = confirm("Удалить этот пост?");

    if (!isConfirmed) return;

    try {
      await deletePost(post.id);
      onDelete?.(post.id);
    } catch (error) {
      console.error("Delete post error:", error);
      alert("Не удалось удалить пост.");
    }
  };

  const handleEditPost = async () => {
    const trimmedContent = editedContent.trim();

    if (!trimmedContent) return;

    try {
      await editPost({
        postId: post.id,
        content: trimmedContent,
      });

      setPostContent(trimmedContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Edit post error:", error);
      alert("Не удалось обновить пост.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const isConfirmed = confirm("Удалить комментарий?");

    if (!isConfirmed) return;

    try {
      await deleteComment(commentId);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );

      setCommentsCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error("Delete comment error:", error);
      alert("Не удалось удалить комментарий.");
    }
  };

  const handleOpenAuthorProfile = () => {
    if (!post.author?.id) return;

    navigate(`/profile/${post.author.id}`);
  };

  const handleOpenCommentAuthorProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <img className={styles.avatar} src={authorAvatar} alt={authorName} />

        <button
          type="button"
          className={styles.authorInfoButton}
          onClick={handleOpenAuthorProfile}
        >
          <h3 className={styles.authorName}>{authorName}</h3>

          <p className={styles.profession}>{authorProfession}</p>
        </button>

        {isOwnPost && (
          <>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDeletePost}
            >
              Delete
            </button>

            <button
              type="button"
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>

      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.editContainer}>
            <textarea
              className={styles.editTextarea}
              value={editedContent}
              onChange={(event) => setEditedContent(event.target.value)}
            />

            <div className={styles.editActions}>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleEditPost}
              >
                Save
              </button>

              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  setEditedContent(postContent);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p>{postContent}</p>
        )}
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

            {commentsCount}
          </button>
        </div>

        <div className={styles.rightStats}>
          <span className={styles.stat}>
            <img className={styles.statIcon} src={viewsIcon} alt="Views" />

            {post.viewsCount ?? 0}
          </span>

          <button
            type="button"
            className={styles.openButton}
            onClick={handleOpenPost}
          >
            View details
          </button>
        </div>
      </div>

      {isCommentsOpen && (
        <CommentsSection
          comments={comments}
          commentText={commentText}
          isLoading={isCommentsLoading}
          onCommentTextChange={setCommentText}
          onCreateComment={handleCreateComment}
          onDeleteComment={handleDeleteComment}
          onOpenAuthorProfile={handleOpenCommentAuthorProfile}
          currentUserId={currentUser?.id}
        />
      )}
    </article>
  );
};
