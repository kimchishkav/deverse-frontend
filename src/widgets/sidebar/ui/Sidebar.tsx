import { NavLink, useNavigate } from "react-router-dom";

import avatarImage from "@/img/avatar.jpg";
import { AppRoutes } from "@/shared/config/routes";
import { getStoredUser } from "@/shared/lib/auth";

import styles from "./Sidebar.module.css";

const navItems = [
  { to: AppRoutes.FEED, label: "Home" },
  { to: AppRoutes.FRIENDS, label: "Friends" },
  { to: AppRoutes.PROJECTS, label: "Projects" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const displayName = user?.name
    ? `${user.name} ${user.surname ?? ""}`.trim()
    : (user?.username ?? "User");

  const profession = user?.profession ?? "Developer";
  const avatar = user?.avatar ?? avatarImage;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate(AppRoutes.AUTH);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileCard}>
        <img className={styles.avatar} src={avatar} alt={displayName} />

        <h3 className={styles.userName}>{displayName}</h3>

        <p className={styles.role}>{profession}</p>

        <NavLink to={AppRoutes.PROFILE} className={styles.profileButton}>
          View profile
        </NavLink>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
};
