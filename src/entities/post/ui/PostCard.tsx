import defaultAvatar from "@/assets/img/acc_default_pic.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Post } from "../model/types";

import {
  CommentsSection,
  createComment,
  getCommentsByPostId,
  type Comment,
} from "@/entities/comment";

import { deletePost } from "@/features/delete-post/api/deletePost";
import { editPost } from "@/features/edit-post/api/editPost";
import { deleteComment } from "@/features/delete-comment/api/deleteComment";
import { likePost } from "@/features/like-post/api/likePost";
import { unlikePost } from "@/features/unlike-post/api/unlikePost";
import { HeartIcon, CommentIcon } from "@/shared/ui/icons";
import { getStoredUser } from "@/shared/lib/auth";
import { useToast } from "@/shared/ui/toast";

import { PostCardEditForm } from "./PostCardEditForm";
import styles from "./PostCard.module.css";

type Props = {
  post: Post;
  onDelete?: (postId: number) => void;
};

export const PostCard = ({ post, onDelete }: Props) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [postContent, setPostContent] = useState(post.content);

  const isOwnPost = post.author?.id === currentUser?.id;
  const authorName = post.author?.name ?? "User";
  const authorProfession = post.author?.profession ?? "Developer";
  const authorAvatar = post.author?.avatar_url ?? post.author?.avatar ?? defaultAvatar;

  const handleToggleLike = async () => {
    if (isLikeLoading) return;
    try {
      setIsLikeLoading(true);
      if (isLiked) {
        await unlikePost(post.id);
        setIsLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        await likePost(post.id);
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch {
      showToast("Не удалось изменить лайк.");
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
        const storedUser = savedUser ? JSON.parse(savedUser) : null;

        const normalized = postComments.map((comment) => ({
          ...comment,
          author: comment.author ?? {
            id: storedUser?.id,
            name: storedUser?.name ?? storedUser?.username ?? "User",
            username: storedUser?.username,
            avatar_url: storedUser?.avatar_url ?? storedUser?.avatar,
          },
        }));

        setComments(normalized);
        setCommentsCount(normalized.length);
      } catch {
        console.error("Load comments error");
      } finally {
        setIsCommentsLoading(false);
      }
    }
  };

  const handleCreateComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    try {
      const created = await createComment({ post_id: post.id, content: trimmed });
      const savedUser = localStorage.getItem("user");
      const storedUser = savedUser ? JSON.parse(savedUser) : null;

      const normalized = {
        ...created,
        author: created.author ?? {
          id: storedUser?.id,
          name: storedUser?.name ?? storedUser?.username ?? "User",
          username: storedUser?.username,
          avatar: storedUser?.avatar,
        },
      };

      setComments((prev) => [normalized, ...prev]);
      setCommentsCount((prev) => prev + 1);
      setCommentText("");
    } catch {
      showToast("Не удалось добавить комментарий.");
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Удалить этот пост?")) return;
    try {
      await deletePost(post.id);
      onDelete?.(post.id);
    } catch {
      showToast("Не удалось удалить пост.");
    }
  };

  const handleSaveEdit = async (content: string) => {
    try {
      await editPost({ postId: post.id, content });
      setPostContent(content);
      setIsEditing(false);
    } catch {
      showToast("Не удалось обновить пост.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Удалить комментарий?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setCommentsCount((prev) => Math.max(prev - 1, 0));
    } catch {
      showToast("Не удалось удалить комментарий.");
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <img className={styles.avatar} src={authorAvatar} alt={authorName} />

        <button
          type="button"
          className={styles.authorInfoButton}
          onClick={() => post.author?.id && navigate(`/profile/${post.author.id}`)}
        >
          <h3 className={styles.authorName}>{authorName}</h3>
          <p className={styles.profession}>{authorProfession}</p>
        </button>

        {isOwnPost && (
          <>
            <button type="button" className={styles.deleteButton} onClick={handleDeletePost}>
              Delete
            </button>
            <button type="button" className={styles.editButton} onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </>
        )}
      </div>

      <div className={styles.content}>
        {isEditing ? (
          <PostCardEditForm
            initialContent={postContent}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
          />
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
            <HeartIcon filled={isLiked} />
            {likesCount}
          </button>

          <button type="button" className={styles.statButton} onClick={handleToggleComments}>
            <CommentIcon />
            {commentsCount}
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
          onOpenAuthorProfile={(id) => navigate(`/profile/${id}`)}
          currentUserId={currentUser?.id}
        />
      )}
    </article>
  );
};
