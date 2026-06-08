import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getUserById, type UserProfile } from "@/entities/user";
import defaultAvatar from "@/assets/img/acc_default_pic.jpg";
import { getStoredUser } from "@/shared/lib/auth";
import { getDisplayName, getAvatarUrl } from "@/shared/lib/user";
import { MainLayout } from "@/widgets/layout";

import { followUser } from "@/features/follow-user/api/followUser";
import { unfollowUser } from "@/features/unfollow-user/api/unfollowUser";
import { getFollowing } from "@/entities/user";
import { changeAvatar } from "@/features/change-avatar/api/changeAvatar";
import { changeHeader } from "@/features/change-header/api/changeHeader";
import { EditProfileModal } from "@/features/edit-profile";
import { type Post } from "@/entities/post";
import { getUserPosts } from "@/entities/post/api/getUserPosts";
import { PostList } from "@/widgets/post-list";
import { getUserProjects, type Project } from "@/entities/project";
import { useToast } from "@/shared/ui/toast";

import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [isHeaderUploading, setIsHeaderUploading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);

  type ProfileTab = "posts" | "projects";

  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = getStoredUser();
      const profileId = id ?? currentUser?.id;

      if (!profileId) return;

      try {
        setIsLoading(true);

        const userData = await getUserById(profileId);

        setProfile(userData);

        try {
          setIsPostsLoading(true);

          const userPosts = await getUserPosts(Number(profileId));

          const profileDisplayName = getDisplayName(userData);

          const postsWithAuthorAvatar = userPosts.map((post: Post) => ({
            ...post,
            author: {
              ...post.author,
              id: userData.id,
              name: post.author?.name ?? profileDisplayName,
              profession: post.author?.profession ?? userData.profession ?? "Developer",
              avatar_url: getAvatarUrl(userData),
            },
          }));

          setPosts(postsWithAuthorAvatar);
        } catch (error) {
          console.error("Fetch profile posts error:", error);
        } finally {
          setIsPostsLoading(false);
        }

        try {
          setIsProjectsLoading(true);

          const userProjects = await getUserProjects(Number(profileId));

          setProjects(userProjects);
        } catch (error) {
          console.error("Fetch profile projects error:", error);
        } finally {
          setIsProjectsLoading(false);
        }

        const currentUser = getStoredUser();

        if (currentUser && Number(profileId) !== currentUser.id) {
          const followingUsers = await getFollowing(currentUser.id);

          setIsFollowing(
            followingUsers.some((user) => user.id === Number(profileId)),
          );
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const displayName = getDisplayName(profile);
  const profession = profile?.profession ?? "Developer";
  const avatar = getAvatarUrl(profile) ?? defaultAvatar;

  const handleToggleFollow = async () => {
    if (!profile) return;

    try {
      setIsFollowLoading(true);

      if (isFollowing) {
        await unfollowUser(profile.id);
        setIsFollowing(false);
      } else {
        await followUser(profile.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Toggle follow error:", error);
      showToast("Не удалось изменить подписку.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const currentUser = getStoredUser();
  const isOwnProfile = profile?.id === currentUser?.id;

  const handleChangeAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsAvatarUploading(true);

      const updatedUser = await changeAvatar(file);

      const newAvatarUrl = updatedUser.avatar_url;

      if (!newAvatarUrl) {
        throw new Error("Avatar URL not found in response");
      }

      setAvatarPreview(newAvatarUrl);

      if (profile) {
        setProfile({
          ...profile,
          avatar: newAvatarUrl,
          avatar_url: newAvatarUrl,
        });
      }

      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const currentUser = JSON.parse(savedUser);

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            avatar: newAvatarUrl,
            avatar_url: newAvatarUrl,
          }),
        );
      }
    } catch (error) {
      console.error("Change avatar error:", error);
      showToast("Не удалось обновить аватар.");
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleDeletePost = (postId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    setIsEditModalOpen(false);

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const current = JSON.parse(savedUser);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...current,
          name: updated.name,
          surname: updated.surname,
          username: updated.username,
          profession: updated.profession,
        }),
      );
    }
  };

  const handleChangeHeader = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsHeaderUploading(true);

      const updatedUser = await changeHeader(file);

      const newHeaderUrl = updatedUser.header_url;

      if (!newHeaderUrl) {
        throw new Error("Header URL not found");
      }

      setHeaderPreview(newHeaderUrl);

      if (profile) {
        setProfile({
          ...profile,
          header_url: newHeaderUrl,
        });
      }

      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const currentUser = JSON.parse(savedUser);

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            header_url: newHeaderUrl,
          }),
        );
      }
    } catch (error) {
      console.error("Change header error:", error);
      showToast("Не удалось обновить обложку.");
    } finally {
      setIsHeaderUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        {isLoading && <p className={styles.text}>Loading profile...</p>}

        {!isLoading && profile && (
          <section className={styles.profileCard}>
            <div
              className={styles.cover}
              style={{
                backgroundImage: `url(${headerPreview ?? profile.header_url ?? ""})`,
              }}
            >
              {isOwnProfile && (
                <label className={styles.headerUploadButton}>
                  {isHeaderUploading ? "Uploading..." : "Change cover"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeHeader}
                    hidden
                  />
                </label>
              )}
            </div>

            <div className={styles.profileInfo}>
              <div className={styles.avatarWrapper}>
                <img
                  className={styles.avatar}
                  src={avatarPreview ?? avatar}
                  alt={displayName}
                />

                {isOwnProfile && (
                  <label className={styles.avatarUploadButton}>
                    {isAvatarUploading ? "Uploading..." : "Change avatar"}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChangeAvatar}
                      hidden
                    />
                  </label>
                )}
              </div>

              <div className={styles.profileTextInfo}>
                <h1 className={styles.name}>{displayName}</h1>
                <p className={styles.profession}>{profession}</p>
                <p className={styles.username}>@{profile.username}</p>

                {isOwnProfile && (
                  <button
                    type="button"
                    className={styles.editProfileButton}
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit profile
                  </button>
                )}

                {!isOwnProfile && (
                  <button
                    type="button"
                    className={styles.followButton}
                    onClick={handleToggleFollow}
                    disabled={isFollowLoading}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        <section className={styles.profileContent}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={activeTab === "posts" ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>

            <button
              type="button"
              className={
                activeTab === "projects" ? styles.activeTab : styles.tab
              }
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
          </div>

          {activeTab === "posts" &&
            (isPostsLoading ? (
              <p className={styles.text}>Loading posts...</p>
            ) : posts.length > 0 ? (
              <PostList posts={posts} onDeletePost={handleDeletePost} />
            ) : (
              <p className={styles.text}>No posts yet.</p>
            ))}

          {activeTab === "projects" &&
            (isProjectsLoading ? (
              <p className={styles.text}>Loading projects...</p>
            ) : projects.length > 0 ? (
              <div className={styles.projectList}>
                {projects.map((project) => (
                  <article key={project.id} className={styles.projectCard}>
                    <h2 className={styles.projectTitle}>{project.title}</h2>
                    <p className={styles.projectDescription}>
                      {project.description}
                    </p>

                    <a
                      className={styles.projectLink}
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open project
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.text}>No projects yet.</p>
            ))}
        </section>

        {!isLoading && !profile && (
          <p className={styles.text}>Profile not found</p>
        )}
      </div>

      {isEditModalOpen && profile && (
        <EditProfileModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </MainLayout>
  );
};
