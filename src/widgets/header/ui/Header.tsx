import styles from "./Header.module.css";
import avatarImage from "@/img/avatar.jpg";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Deverse</div>

      <div className={styles.profile}>
        <img className={styles.avatar} src={avatarImage} alt="User avatar" />
        <span className={styles.name}>Hello, Victoria</span>
      </div>
    </header>
  );
};
