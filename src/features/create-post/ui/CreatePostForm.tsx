import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/pages/feed/ui/button";
import { Textarea } from "@/pages/feed/ui/textarea";

import styles from "./CreatePostForm.module.css";

type Props = {
  onCreate: (content: string) => void;
};

export const CreatePostForm = ({ onCreate }: Props) => {
  const [text, setText] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = text.trim();

    if (!trimmed) return;

    onCreate(trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Share something</h2>

      <Textarea
        value={text}
        onChange={handleChange}
        placeholder="What do you want to talk about?"
        rows={5}
      />

      <div className={styles.actions}>
        <Button type="submit">Publish</Button>
      </div>
    </form>
  );
};
