import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import { getFollowing, searchUsers, type UserProfile } from "@/entities/user";
import avatarImage from "@/img/avatar.jpg";
import { getStoredUser } from "@/shared/lib/auth";
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
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    const fetchFollowing = async () => {
      const currentUser = getStoredUser();

      if (!currentUser) {
        return;
      }

      try {
        const followingUsers = await getFollowing(currentUser.id);

        setFollowingIds(followingUsers.map((user) => user.id));
      } catch (error) {
        console.error("Fetch following error:", error);
      }
    };

    fetchFollowing();
  }, []);

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
      const currentUser = getStoredUser();

      const filteredUsers = currentUser
        ? foundUsers.filter((user) => user.id !== currentUser.id)
        : foundUsers;

      setUsers(filteredUsers);
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
    if (isFollowLoading) {
      return;
    }

    try {
      setIsFollowLoading(true);

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
    } finally {
      setIsFollowLoading(false);
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
                  src={user.avatar_url ?? user.avatar ?? avatarImage}
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
                  disabled={isFollowLoading}
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
