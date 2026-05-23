import type { Comment } from "../model/types";

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
        comments.map((comment) => (
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
                {comment.author?.name ?? comment.author?.username ?? "User"}
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
        ))
      )}
    </div>
  );
};
