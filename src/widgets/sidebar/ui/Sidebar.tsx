import { NavLink, useNavigate } from "react-router-dom";

import defaultAvatar from "@/assets/img/acc_default_pic.jpg";
import { AppRoutes } from "@/shared/config/routes";
import { getStoredUser } from "@/shared/lib/auth";
import { getDisplayName, getAvatarUrl } from "@/shared/lib/user";
import {
  HomeIcon,
  FriendsIcon,
  ProjectsIcon,
  LogoutIcon,
  CloseIcon,
} from "@/shared/ui/icons";

import styles from "./Sidebar.module.css";

const navItems = [
  { to: AppRoutes.FEED, label: "Home", icon: <HomeIcon /> },
  { to: AppRoutes.FRIENDS, label: "Friends", icon: <FriendsIcon /> },
  { to: AppRoutes.PROJECTS, label: "Projects", icon: <ProjectsIcon /> },
];

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};

export const Sidebar = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const displayName = getDisplayName(user);
  const profession = user?.profession ?? "Developer";
  const avatar = getAvatarUrl(user) ?? defaultAvatar;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate(AppRoutes.AUTH);
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close navigation"
      >
        <CloseIcon />
      </button>

      <div className={styles.profileCard}>
        <img className={styles.avatar} src={avatar} alt={displayName} />
        <h3 className={styles.userName}>{displayName}</h3>
        <p className={styles.role}>{profession}</p>
        <NavLink to={AppRoutes.PROFILE} className={styles.profileButton} onClick={onClose}>
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
            onClick={onClose}
          >
            <span className={styles.linkIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        <span className={styles.linkIcon}>
          <LogoutIcon />
        </span>
        <span>Logout</span>
      </button>
    </aside>
  );
};
