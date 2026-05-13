import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import { searchUsers, type UserProfile } from "@/entities/user";
import avatarImage from "@/img/avatar.jpg";
import { MainLayout } from "@/widgets/layout";

import styles from "./FriendsPage.module.css";

import { followUser } from "@/features/follow-user/api/followUser";
import { unfollowUser } from "@/features/unfollow-user/api/unfollowUser";

export const FriendsPage = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followingIds, setFollowingIds] = useState<number[]>([]);

  const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);

    if (value.trim().length < 2) {
      setUsers([]);
      return;
    }

    try {
      setIsLoading(true);

      const foundUsers = await searchUsers(value.trim());

      setUsers(foundUsers);
    } catch (error) {
      console.error("Search users error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = (user: UserProfile) => {
    if (user.name) {
      return `${user.name} ${user.surname ?? ""}`.trim();
    }

    return user.username;
  };

  const handleToggleFollow = async (userId: number) => {
    try {
      const isFollowing = followingIds.includes(userId);

      if (isFollowing) {
        await unfollowUser(userId);

        setFollowingIds((prevIds) => prevIds.filter((id) => id !== userId));
      } else {
        await followUser(userId);

        setFollowingIds((prevIds) => [...prevIds, userId]);
      }
    } catch (error) {
      console.error("Toggle follow error:", error);
      alert("Не удалось изменить подписку.");
    }
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Find developers</h1>
            <p className={styles.subtitle}>
              Search users by name, username or profession
            </p>
          </div>

          <input
            className={styles.searchInput}
            value={query}
            onChange={handleSearchChange}
            placeholder="Search users..."
          />
        </div>

        {isLoading && <p className={styles.text}>Searching...</p>}

        {!isLoading && query.trim().length < 2 && (
          <p className={styles.text}>Type at least 2 characters to search.</p>
        )}

        {!isLoading && query.trim().length >= 2 && users.length === 0 && (
          <p className={styles.text}>No users found.</p>
        )}

        <div className={styles.usersList}>
          {users.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <img
                  className={styles.avatar}
                  src={user.avatar ?? avatarImage}
                  alt={getDisplayName(user)}
                />

                <div>
                  <h3 className={styles.userName}>{getDisplayName(user)}</h3>
                  <p className={styles.profession}>
                    {user.profession ?? "Developer"}
                  </p>
                  <p className={styles.username}>@{user.username}</p>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.profileButton}
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  View profile
                </button>

                <button
                  type="button"
                  className={styles.followButton}
                  onClick={() => handleToggleFollow(user.id)}
                >
                  {followingIds.includes(user.id) ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
