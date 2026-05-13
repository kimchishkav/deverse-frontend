import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getUserById, type UserProfile } from "@/entities/user";
import avatarImage from "@/img/avatar.jpg";
import { getStoredUser } from "@/shared/lib/auth";
import { MainLayout } from "@/widgets/layout";

import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = getStoredUser();
      const profileId = id ?? currentUser?.id;

      if (!profileId) return;

      try {
        setIsLoading(true);

        const userData = await getUserById(profileId);

        setProfile(userData);
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
  const avatar = profile?.avatar ?? avatarImage;

  return (
    <MainLayout>
      <div className={styles.page}>
        {isLoading && <p className={styles.text}>Loading profile...</p>}

        {!isLoading && profile && (
          <section className={styles.profileCard}>
            <div className={styles.cover} />

            <div className={styles.profileInfo}>
              <img className={styles.avatar} src={avatar} alt={displayName} />

              <div>
                <h1 className={styles.name}>{displayName}</h1>
                <p className={styles.profession}>{profession}</p>
                <p className={styles.username}>@{profile.username}</p>
              </div>
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
