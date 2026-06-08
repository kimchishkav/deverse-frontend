import defaultAvatar from "@/assets/img/acc_default_pic.jpg";
import { getStoredUser } from "@/shared/lib/auth";
import { getDisplayName, getAvatarUrl } from "@/shared/lib/user";
import { useTheme } from "@/shared/lib/theme";
import { HamburgerIcon, SunIcon, MoonIcon } from "@/shared/ui/icons";

import styles from "./Header.module.css";

type Props = {
  onMenuToggle: () => void;
};

export const Header = ({ onMenuToggle }: Props) => {
  const user = getStoredUser();
  const displayName = user ? getDisplayName(user) : "Guest";
  const avatarSrc = getAvatarUrl(user) ?? defaultAvatar;
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Open navigation"
        >
          <HamburgerIcon />
        </button>
        <div className={styles.logo}>Deverse</div>
      </div>

      <div className={styles.right}>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

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
      </div>
    </header>
  );
};
