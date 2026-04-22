import type { TextareaHTMLAttributes } from "react";
import styles from "./Textarea.module.css";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = (props: TextareaProps) => {
  return <textarea className={styles.textarea} {...props} />;
};
