import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  CommentsSection,
  createComment,
  getCommentsByPostId,
  type Comment,
} from "@/entities/comment";
import { getPostById, PostCard, type Post } from "@/entities/post";
import { getUserById } from "@/entities/user/api/userApi";
import { AppRoutes } from "@/shared/config/routes";
import { getStoredUser } from "@/shared/lib/auth";
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

        if (postData.author?.id && !postData.author.avatar_url && !postData.author.avatar) {
          try {
            const authorProfile = await getUserById(postData.author.id);
            postData.author = {
              ...postData.author,
              avatar_url: authorProfile.avatar_url ?? authorProfile.avatar,
            };
          } catch {
            // не критично — просто покажем дефолтную аватарку
          }
        }

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

        const currentUser = getStoredUser();
        const normalized = commentsData.map((comment) => ({
          ...comment,
          author: comment.author ?? {
            id: currentUser?.id,
            name: currentUser?.name ?? currentUser?.username ?? "User",
            username: currentUser?.username,
            avatar_url: currentUser?.avatar_url ?? currentUser?.avatar,
          },
        }));

        setComments(normalized);
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

      const currentUser = getStoredUser();
      const normalizedComment: Comment = {
        ...createdComment,
        author: createdComment.author ?? {
          id: currentUser?.id,
          name: currentUser?.name ?? currentUser?.username ?? "User",
          username: currentUser?.username,
          avatar_url: currentUser?.avatar_url ?? currentUser?.avatar,
        },
      };

      setComments((prevComments) => [normalizedComment, ...prevComments]);
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
