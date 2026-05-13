import type { Comment } from "../model/types";

import styles from "./CommentsSection.module.css";

type Props = {
  comments: Comment[];
  commentText: string;
  isLoading: boolean;
  onCommentTextChange: (value: string) => void;
  onCreateComment: () => void;
};

export const CommentsSection = ({
  comments,
  commentText,
  isLoading,
  onCommentTextChange,
  onCreateComment,
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
            <p className={styles.commentAuthor}>
              {comment.author?.name ?? comment.author?.username ?? "User"}
            </p>

            <p className={styles.commentText}>{comment.content}</p>
          </div>
        ))
      )}
    </div>
  );
};
