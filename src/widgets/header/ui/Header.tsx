import defaultAvatar from "@/assets/img/acc_default_pic.jpg";
import { getStoredUser } from "@/shared/lib/auth";
import { getDisplayName, getAvatarUrl } from "@/shared/lib/user";

import styles from "./Header.module.css";

export const Header = () => {
  const user = getStoredUser();
  const displayName = user ? getDisplayName(user) : "Guest";
  const avatarSrc = getAvatarUrl(user) ?? defaultAvatar;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Deverse</div>

      <div className={styles.profile}>
        <img
          className={styles.avatar}
          src={avatarSrc}
          alt={displayName}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultAvatar;
          }}
        />
        <span className={styles.name}>Hello, {displayName}</span>
      </div>
    </header>
  );
};
