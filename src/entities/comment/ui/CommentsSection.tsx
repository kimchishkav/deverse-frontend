import type { Comment } from "../model/types";
import defaultAvatar from "@/assets/img/acc_default_pic.jpg";

import styles from "./CommentsSection.module.css";

type Props = {
  comments: Comment[];
  commentText: string;
  isLoading: boolean;
  onCommentTextChange: (value: string) => void;
  onCreateComment: () => void;
  onDeleteComment?: (commentId: number) => void;
  onOpenAuthorProfile?: (userId: number) => void;
  currentUserId?: number;
};

export const CommentsSection = ({
  comments,
  commentText,
  isLoading,
  onCommentTextChange,
  onCreateComment,
  onDeleteComment,
  onOpenAuthorProfile,
  currentUserId,
}: Props) => {
  return (
    <div className={styles.comments}>
      <div className={styles.commentForm}>
        <input
          className={styles.commentInput}
          value={commentText}
          onChange={(event) => onCommentTextChange(event.target.value)}
          placeholder="Write a comment..."
        />

        <button
          className={styles.commentButton}
          type="button"
          onClick={onCreateComment}
        >
          Send
        </button>
      </div>

      {isLoading ? (
        <p className={styles.commentText}>Loading comments...</p>
      ) : (
        comments.map((comment) => {
          const authorName =
            comment.author?.name ?? comment.author?.username ?? "User";
          const authorUsername = comment.author?.username;
          const avatarSrc =
            comment.author?.avatar_url ?? comment.author?.avatar ?? defaultAvatar;

          return (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <button
                  type="button"
                  className={styles.commentAuthorButton}
                  onClick={() => {
                    if (comment.author?.id) {
                      onOpenAuthorProfile?.(comment.author.id);
                    }
                  }}
                >
                  <img
                    className={styles.commentAvatar}
                    src={avatarSrc}
                    alt={authorName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = defaultAvatar;
                    }}
                  />

                  <div className={styles.commentAuthorInfo}>
                    <span className={styles.commentAuthorName}>{authorName}</span>
                    {authorUsername && (
                      <span className={styles.commentAuthorUsername}>
                        @{authorUsername}
                      </span>
                    )}
                  </div>
                </button>

                {comment.author?.id === currentUserId && (
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => onDeleteComment?.(comment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>

              <p className={styles.commentText}>{comment.content}</p>
            </div>
          );
        })
      )}
    </div>
  );
};
