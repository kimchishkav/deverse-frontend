import defaultAvatar from "@/assets/img/acc_default_pic.jpg";
import { useState } from "react";

import type { Post } from "../model/types";

import { useNavigate } from "react-router-dom";

import {
  CommentsSection,
  createComment,
  getCommentsByPostId,
  type Comment,
} from "@/entities/comment";

import { likePost } from "@/features/like-post/api/likePost";
import { unlikePost } from "@/features/unlike-post/api/unlikePost";

const HeartIcon = ({ filled }: { filled?: boolean }) =>
  filled ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

const CommentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

import styles from "./PostCard.module.css";

import { deletePost } from "@/features/delete-post/api/deletePost";

import { editPost } from "@/features/edit-post/api/editPost";

import { deleteComment } from "@/features/delete-comment/api/deleteComment";
import { improveGrammar } from "@/features/improve-grammar/api/improveGrammar";
import { rewriteTone } from "@/features/rewrite-tone/api/rewriteTone";
import { getStoredUser } from "@/shared/lib/auth";
import { useToast } from "@/shared/ui/toast";

const TONES = [
  { value: "formal",   label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "short",    label: "Short" },
];

type Props = {
  post: Post;
  onDelete?: (postId: number) => void;
};

export const PostCard = ({ post, onDelete }: Props) => {
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const authorName = post.author?.name ?? "User";
  const authorProfession = post.author?.profession ?? "Developer";
  const authorAvatar =
    post.author?.avatar_url ?? post.author?.avatar ?? defaultAvatar;

  const navigate = useNavigate();

  const currentUser = getStoredUser();
  const isOwnPost = post.author?.id === currentUser?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [postContent, setPostContent] = useState(post.content);
  const [isImproving, setIsImproving] = useState(false);
  const [rewritingTone, setRewritingTone] = useState<string | null>(null);

  const isEditBusy = isImproving || rewritingTone !== null;

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
        const currentUser = savedUser ? JSON.parse(savedUser) : null;

        const normalizedComments = postComments.map((comment) => ({
          ...comment,
          author: comment.author ?? {
            id: currentUser?.id,
            name: currentUser?.name ?? currentUser?.username ?? "User",
            username: currentUser?.username,
            avatar_url: currentUser?.avatar_url ?? currentUser?.avatar,
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
      showToast("Не удалось добавить комментарий.");
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
      showToast("Не удалось удалить пост.");
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
      showToast("Не удалось обновить пост.");
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
      showToast("Не удалось удалить комментарий.");
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

            <div className={styles.toneRow}>
              <span className={styles.toneLabel}>Tone:</span>
              <div className={styles.toneChips}>
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`${styles.toneChip} ${rewritingTone === t.value ? styles.toneChipLoading : ""}`}
                    disabled={isEditBusy || !editedContent.trim()}
                    onClick={async () => {
                      try {
                        setRewritingTone(t.value);
                        const rewritten = await rewriteTone(editedContent.trim(), t.value);
                        setEditedContent(rewritten);
                      } catch {
                        showToast("Failed to rewrite. Try again.");
                      } finally {
                        setRewritingTone(null);
                      }
                    }}
                  >
                    {rewritingTone === t.value ? "..." : t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.editActions}>
              <button
                type="button"
                className={styles.improveButton}
                disabled={isEditBusy || !editedContent.trim()}
                onClick={async () => {
                  try {
                    setIsImproving(true);
                    const improved = await improveGrammar(editedContent.trim());
                    setEditedContent(improved);
                  } catch {
                    showToast("Failed to improve. Try again.");
                  } finally {
                    setIsImproving(false);
                  }
                }}
              >
                {isImproving ? "Improving..." : "Improve"}
              </button>

              <button
                type="button"
                className={styles.saveButton}
                disabled={isEditBusy}
                onClick={handleEditPost}
              >
                Save
              </button>

              <button
                type="button"
                className={styles.cancelButton}
                disabled={isEditBusy}
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
            <HeartIcon filled={isLiked} />
            {likesCount}
          </button>

          <button
            type="button"
            className={styles.statButton}
            onClick={handleToggleComments}
          >
            <CommentIcon />
            {commentsCount}
          </button>
        </div>

        <div className={styles.rightStats} />
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
