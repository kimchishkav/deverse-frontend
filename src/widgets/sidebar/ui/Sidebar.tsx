import { NavLink } from "react-router-dom";

import { AppRoutes } from "@/shared/config/routes";
import avatarImage from "@/img/avatar.jpg";

import styles from "./Sidebar.module.css";

const navItems = [
  { to: AppRoutes.FEED, label: "Home" },
  { to: AppRoutes.FRIENDS, label: "Friends" },
  { to: AppRoutes.PROJECTS, label: "Projects" },
];

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileCard}>
        <img className={styles.avatar} src={avatarImage} alt="Victoria Kim" />
        <h3 className={styles.userName}>Victoria Kim</h3>
        <p className={styles.role}>Frontend Developer</p>

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

      <button className={styles.logoutButton}>Logout</button>
    </aside>
  );
};
