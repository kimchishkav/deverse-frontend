import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getUserById, type UserProfile } from "@/entities/user";
import defaultAvatar from "@/assets/img/acc_default_pic.jpg";
import { getStoredUser } from "@/shared/lib/auth";
import { MainLayout } from "@/widgets/layout";

import { followUser } from "@/features/follow-user/api/followUser";
import { unfollowUser } from "@/features/unfollow-user/api/unfollowUser";
import { getFollowing } from "@/entities/user";
import { changeAvatar } from "@/features/change-avatar/api/changeAvatar";

import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = getStoredUser();
      const profileId = id ?? currentUser?.id;

      if (!profileId) return;

      try {
        setIsLoading(true);

        const userData = await getUserById(profileId);

        setProfile(userData);

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

  const displayName = profile?.name
    ? `${profile.name} ${profile.surname ?? ""}`.trim()
    : (profile?.username ?? "User");

  const profession = profile?.profession ?? "Developer";
  const avatar = profile?.avatar_url ?? profile?.avatar ?? defaultAvatar;

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
      alert("Не удалось изменить подписку.");
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
      alert("Не удалось обновить аватар.");
    } finally {
      setIsAvatarUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        {isLoading && <p className={styles.text}>Loading profile...</p>}

        {!isLoading && profile && (
          <section className={styles.profileCard}>
            <div className={styles.cover} />

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

              <div>
                <h1 className={styles.name}>{displayName}</h1>
                <p className={styles.profession}>{profession}</p>
                <p className={styles.username}>@{profile.username}</p>
              </div>

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
          </section>
        )}

        {!isLoading && !profile && (
          <p className={styles.text}>Profile not found</p>
        )}
      </div>
    </MainLayout>
  );
};
