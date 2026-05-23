import styles from "./Header.module.css";
import defaultAvatar from "@/assets/img/acc_default_pic.jpg";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Deverse</div>

      <div className={styles.profile}>
        <img className={styles.avatar} src={defaultAvatar} alt="User avatar" />
        <span className={styles.name}>Hello, Victoria</span>
      </div>
    </header>
  );
};
