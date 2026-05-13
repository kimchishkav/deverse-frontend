import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  CommentsSection,
  createComment,
  getCommentsByPostId,
  type Comment,
} from "@/entities/comment";
import { getPostById, PostCard, type Post } from "@/entities/post";
import { AppRoutes } from "@/shared/config/routes";
import { MainLayout } from "@/widgets/layout";

import styles from "./PostDetailsPage.module.css";

export const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!id) return;

      try {
        setIsPostLoading(true);

        const postData = await getPostById(id);
        setPost(postData);
      } catch (error) {
        console.error("Fetch post error:", error);
      } finally {
        setIsPostLoading(false);
      }
    };

    const fetchComments = async () => {
      if (!id) return;

      try {
        setIsCommentsLoading(true);

        const commentsData = await getCommentsByPostId(Number(id));
        setComments(commentsData);
      } catch (error) {
        console.error("Fetch comments error:", error);
      } finally {
        setIsCommentsLoading(false);
      }
    };

    fetchPostDetails();
    fetchComments();
  }, [id]);

  const handleCreateComment = async () => {
    if (!id) return;

    const trimmedComment = commentText.trim();

    if (!trimmedComment) return;

    try {
      const createdComment = await createComment({
        post_id: Number(id),
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
    <MainLayout>
      <div className={styles.page}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(AppRoutes.FEED)}
        >
          ← Back to feed
        </button>

        {isPostLoading && <p className={styles.text}>Loading post...</p>}

        {!isPostLoading && post && (
          <>
            <PostCard post={post} />

            <CommentsSection
              comments={comments}
              commentText={commentText}
              isLoading={isCommentsLoading}
              onCommentTextChange={setCommentText}
              onCreateComment={handleCreateComment}
            />
          </>
        )}

        {!isPostLoading && !post && (
          <p className={styles.text}>Post not found</p>
        )}
      </div>
    </MainLayout>
  );
};
