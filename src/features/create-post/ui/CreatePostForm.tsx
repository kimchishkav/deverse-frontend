import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/pages/feed/ui/button";
import { Textarea } from "@/pages/feed/ui/textarea";
import { improveGrammar } from "@/features/improve-grammar/api/improveGrammar";

import styles from "./CreatePostForm.module.css";

type Props = {
  onCreate: (content: string) => void;
};

export const CreatePostForm = ({ onCreate }: Props) => {
  const [text, setText] = useState("");
  const [isImproving, setIsImproving] = useState(false);
  const [improveError, setImproveError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setImproveError(null);
  };

  const handleImprove = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      setIsImproving(true);
      setImproveError(null);
      const improved = await improveGrammar(trimmed);
      setText(improved);
    } catch {
      setImproveError("Failed to improve. Try again.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setText("");
    setImproveError(null);
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

      {improveError && <p className={styles.error}>{improveError}</p>}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.improveButton}
          onClick={handleImprove}
          disabled={isImproving || !text.trim()}
        >
          {isImproving ? "Improving..." : "Improve"}
        </button>

        <Button type="submit" disabled={!text.trim()}>
          Publish
        </Button>
      </div>
    </form>
  );
};
