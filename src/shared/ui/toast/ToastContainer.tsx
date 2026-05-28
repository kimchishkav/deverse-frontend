import type { ToastItem } from "./types";
import styles from "./Toast.module.css";

const ICONS: Record<string, string> = {
  error: "✕",
  success: "✓",
  warning: "!",
};

type Props = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

export const ToastContainer = ({ toasts, onDismiss }: Props) => {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.icon}>{ICONS[toast.type]}</span>

          <div className={styles.body}>
            <p className={styles.message}>{toast.message}</p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
