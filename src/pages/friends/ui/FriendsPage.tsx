import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  getFollowers,
  getFollowing,
  searchUsers,
  type UserProfile,
} from "@/entities/user";
import defaultAvatar from "@/assets/img/acc_default_pic.jpg";
import { followUser } from "@/features/follow-user/api/followUser";
import { unfollowUser } from "@/features/unfollow-user/api/unfollowUser";
import { getStoredUser } from "@/shared/lib/auth";
import { useToast } from "@/shared/ui/toast";
import { MainLayout } from "@/widgets/layout";

import styles from "./FriendsPage.module.css";

type FriendsTab = "search" | "following" | "followers";

export const FriendsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<FriendsTab>("search");
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [followingUsers, setFollowingUsers] = useState<UserProfile[]>([]);
  const [followersUsers, setFollowersUsers] = useState<UserProfile[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    const fetchFriendsData = async () => {
      const currentUser = getStoredUser();

      if (!currentUser) return;

      try {
        const [following, followers] = await Promise.all([
          getFollowing(currentUser.id),
          getFollowers(currentUser.id),
        ]);

        setFollowingUsers(following);
        setFollowersUsers(followers);
        setFollowingIds(following.map((user) => user.id));
      } catch (error) {
        console.error("Fetch friends data error:", error);
      }
    };

    fetchFriendsData();
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
    if (isFollowLoading) return;

    try {
      setIsFollowLoading(true);

      const isFollowing = followingIds.includes(userId);

      if (isFollowing) {
        await unfollowUser(userId);

        setFollowingIds((prevIds) => prevIds.filter((id) => id !== userId));

        setFollowingUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId),
        );
      } else {
        await followUser(userId);

        setFollowingIds((prevIds) => [...prevIds, userId]);

        const followedUser =
          users.find((user) => user.id === userId) ??
          followersUsers.find((user) => user.id === userId);

        if (followedUser) {
          setFollowingUsers((prevUsers) => [...prevUsers, followedUser]);
        }
      }
    } catch (error) {
      console.error("Toggle follow error:", error);
      showToast("Не удалось изменить подписку.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const displayedUsers =
    activeTab === "search"
      ? users
      : activeTab === "following"
        ? followingUsers
        : followersUsers;

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

        <div className={styles.tabs}>
          <button
            type="button"
            className={activeTab === "search" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("search")}
          >
            Search
          </button>

          <button
            type="button"
            className={
              activeTab === "following" ? styles.activeTab : styles.tab
            }
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>

          <button
            type="button"
            className={
              activeTab === "followers" ? styles.activeTab : styles.tab
            }
            onClick={() => setActiveTab("followers")}
          >
            Followers
          </button>
        </div>

        {isLoading && activeTab === "search" && (
          <p className={styles.text}>Searching...</p>
        )}

        {!isLoading && activeTab === "search" && query.trim().length < 2 && (
          <p className={styles.text}>Type at least 2 characters to search.</p>
        )}

        {!isLoading &&
          activeTab === "search" &&
          query.trim().length >= 2 &&
          displayedUsers.length === 0 && (
            <p className={styles.text}>No users found.</p>
          )}

        {activeTab === "following" && displayedUsers.length === 0 && (
          <p className={styles.text}>You are not following anyone yet.</p>
        )}

        {activeTab === "followers" && displayedUsers.length === 0 && (
          <p className={styles.text}>No followers yet.</p>
        )}

        <div className={styles.usersList}>
          {displayedUsers.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <img
                  className={styles.avatar}
                  src={user.avatar_url ?? user.avatar ?? defaultAvatar}
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
